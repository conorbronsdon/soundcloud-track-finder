# Ideas & Roadmap

Running list of feature ideas, deferred work, and things considered and skipped. Open an [issue](https://github.com/conorbronsdon/soundcloud-track-finder/issues) with your own.

## On deck

### More platforms
Easy additions — same URL-template pattern as the existing four.
- **Tidal** — `https://tidal.com/search?q=<query>`
- **Beatport** — `https://www.beatport.com/search?q=<query>` (relevant for DJs)
- **Bandcamp** — `https://bandcamp.com/search?q=<query>`
- **Mixcloud** — `https://www.mixcloud.com/search/?q=<query>`
- **Deezer** — `https://www.deezer.com/search/<query>`

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

### Naming — repo + URL still say "soundcloud-track-finder"
The visible name is now "Track Finder" (H1, page title, meta tags, README) after the platform selector shipped. The GitHub repo slug and the Vercel URL still say `soundcloud-track-finder` — renaming those costs existing stars, inbound links from the launch post, and bookmarks, so deferring until analytics show it matters. If SoundCloud keeps being the dominant platform people click, the URL staying as-is is fine.

## Not planned

### Shazam-style ID of flips that only live on SoundCloud/YouTube
Suggested April 2026. Audio fingerprinting against an index of non-commercial releases is a fundamentally different app — indexing, ingestion, DMCA surface area, and probably a real backend. Not an extension of this tool.
