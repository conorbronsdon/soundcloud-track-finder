// Vercel serverless function: given a YouTube playlist URL (or bare playlist ID),
// return the video titles via the YouTube Data API v3.
//
// Env var required: YOUTUBE_API_KEY (YouTube Data API v3 key, no OAuth).
// Set in the Vercel project: Settings -> Environment Variables.

const YT_API = "https://www.googleapis.com/youtube/v3";
const MAX_ITEMS = 500; // upper bound; API quota is the real guard

function extractPlaylistId(input) {
  if (!input) return null;
  const trimmed = String(input).trim();

  // Bare ID — YouTube playlist IDs start with one of these prefixes
  if (/^(PL|UU|FL|LP|OLAK|RD)[A-Za-z0-9_-]{10,}$/.test(trimmed)) {
    return trimmed;
  }

  try {
    const u = new URL(trimmed);
    const host = u.hostname.toLowerCase();
    if (!host.endsWith("youtube.com") && !host.endsWith("youtu.be")) return null;
    const list = u.searchParams.get("list");
    if (list) return list;
  } catch {
    // not a URL
  }
  return null;
}

// Strip the most common noise YouTube creators add to titles. Conservative —
// only touches whole bracketed markers, never the middle of a title.
function cleanTitle(t) {
  if (!t) return "";
  return t
    // [Official Video], (Official Music Video), [Official Audio], [Audio],
    // [Lyric Video], [Lyrics], [Visualizer], [HD], [4K], [HQ], [Live], [MV]
    .replace(/\s*[\[\(](?:official\s+(?:music\s+)?video|official\s+audio|official\s+visualizer|visualizer|lyric(?:s)?\s+video|lyrics|audio|hd|4k|hq|live|mv|m\/v)\s*[\]\)]/gi, "")
    // [Free DL], [Free Download], [Premiere]
    .replace(/\s*[\[\(]\s*(?:free\s+dl|free\s+download|premiere|exclusive\s+premiere)\s*[\]\)]/gi, "")
    // 【Japanese brackets】 — often channel/label tags
    .replace(/【[^】]*】/g, "")
    // Collapse internal whitespace
    .replace(/\s{2,}/g, " ")
    .trim()
    // Trim leading/trailing dashes, pipes, or separators left behind
    .replace(/^[\s\-–—|]+|[\s\-–—|]+$/g, "")
    .trim();
}

async function fetchPlaylistTitle(playlistId, apiKey) {
  const params = new URLSearchParams({ part: "snippet", id: playlistId, key: apiKey });
  const r = await fetch(`${YT_API}/playlists?${params}`);
  if (!r.ok) return "";
  const data = await r.json();
  return data?.items?.[0]?.snippet?.title || "";
}

async function fetchAllTitles(playlistId, apiKey) {
  const items = [];
  let pageToken = "";
  while (items.length < MAX_ITEMS) {
    const params = new URLSearchParams({
      part: "snippet",
      playlistId,
      maxResults: "50",
      key: apiKey,
    });
    if (pageToken) params.set("pageToken", pageToken);

    const r = await fetch(`${YT_API}/playlistItems?${params}`);
    if (!r.ok) {
      const body = await r.text().catch(() => "");
      const err = new Error(`YouTube API ${r.status}`);
      err.status = r.status;
      err.body = body;
      throw err;
    }
    const data = await r.json();
    for (const item of data.items || []) {
      const title = item?.snippet?.title;
      if (!title) continue;
      if (title === "Private video" || title === "Deleted video") continue;
      items.push(cleanTitle(title));
    }
    if (!data.nextPageToken) break;
    pageToken = data.nextPageToken;
  }
  return items.filter(Boolean);
}

export default async function handler(req, res) {
  // CORS — same-origin by default on Vercel, but be defensive.
  if (req.method === "OPTIONS") {
    res.status(204).end();
    return;
  }
  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  const apiKey = process.env.YOUTUBE_API_KEY;
  if (!apiKey) {
    res.status(500).json({
      error: "Server not configured. The site owner needs to set the YOUTUBE_API_KEY environment variable in Vercel.",
    });
    return;
  }

  let body = req.body;
  if (typeof body === "string") {
    try { body = JSON.parse(body); } catch { body = {}; }
  }
  const url = body?.url;
  if (!url) {
    res.status(400).json({ error: "Missing 'url' in request body" });
    return;
  }

  const playlistId = extractPlaylistId(url);
  if (!playlistId) {
    res.status(400).json({ error: "Couldn't find a YouTube playlist ID in that URL. Make sure it includes ?list=..." });
    return;
  }

  try {
    const [title, tracks] = await Promise.all([
      fetchPlaylistTitle(playlistId, apiKey),
      fetchAllTitles(playlistId, apiKey),
    ]);
    if (!tracks.length) {
      res.status(404).json({ error: "No videos found. The playlist may be empty or private." });
      return;
    }
    res.status(200).json({ title, tracks, count: tracks.length });
  } catch (e) {
    const status = e.status || 500;
    const msg = status === 403
      ? "YouTube API quota exceeded or request blocked. Try again later."
      : status === 404
        ? "Playlist not found. It may be private or the ID is invalid."
        : (e.message || "Failed to fetch playlist");
    res.status(status).json({ error: msg });
  }
}
