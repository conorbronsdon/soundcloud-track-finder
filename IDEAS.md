# Ideas & Roadmap

Running list of feature ideas, deferred work, and things considered and skipped. Open an [issue](https://github.com/conorbronsdon/track-finder/issues) with your own.

## On deck

### More platforms
Easy additions — same URL-template pattern as the existing five.
- **Tidal** — `https://tidal.com/search?q=<query>`
- **Bandcamp** — `https://bandcamp.com/search?q=<query>`
- **Mixcloud** — `https://www.mixcloud.com/search/?q=<query>`
- **Deezer** — `https://www.deezer.com/search/<query>`

### Import from a 1001tracklists URL
In progress. Paste a 1001tracklists set URL → fetch + parse on a Vercel serverless function → pipe into the tracklist textarea. Cloudflare posture is the open question; existing open-source scrapers (elte0/1001-tracklists-api) don't handle CF challenges. Likely path: lightweight Cheerio/node-fetch function with realistic headers, fail gracefully + tell the user to copy-paste if blocked.

### Import a YouTube playlist as a tracklist
Paste a YouTube playlist URL, fetch video titles, clean them up, feed into the existing parser.

- Fetch via YouTube Data API (`playlistItems.list`) — needs API key, ideally behind a small Vercel serverless function so the key isn't in the client
- Title cleanup is the hard part, not the fetch: strip `[FREE DL]`, `[Official Video]`, `(Prod. by...)`, `【...】` markers, leading channel prefixes, trailing release-label tags
- Stretch: also support Spotify playlists via Web API

### Import from a SoundCloud set description
Many DJ sets include a tracklist in the description. Could be:
- A pasted-description flow (the existing parser already handles most of these formats)
- Automated via the SoundCloud API if I can get app approval (hard since 2021)

## Considered

### Naming — renamed to Track Finder across the board
Renamed 2026-04-19 after the platform selector shipped: H1, page title, meta tags, README, GitHub repo (`conorbronsdon/track-finder`), and Vercel primary domain (`track-finder.vercel.app`). Old slugs 301 to the new ones, so existing stars, inbound links from the launch post, and bookmarks all keep working.

## Not planned

### Shazam-style ID of flips that only live on SoundCloud/YouTube
Suggested April 2026. Audio fingerprinting against an index of non-commercial releases is a fundamentally different app — indexing, ingestion, DMCA surface area, and probably a real backend. Not an extension of this tool.
