<div align="center">

# Track Finder

Paste a tracklist — or a YouTube playlist URL — and get a search link for every track on your platform of choice: SoundCloud, Spotify, YouTube, Apple Music, or Beatport.

[![GitHub stars](https://img.shields.io/github/stars/conorbronsdon/track-finder?style=social)](https://github.com/conorbronsdon/track-finder/stargazers)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg?style=flat-square)](LICENSE)
[![X](https://img.shields.io/badge/X-@ConorBronsdon-black?style=flat-square&logo=x)](https://x.com/ConorBronsdon)
[![Web App](https://img.shields.io/badge/Try_the_web_app-ff5500?style=flat-square&logo=vercel&logoColor=white)](https://track-finder.vercel.app)

</div>

---

As an avid SoundCloud user (I have too many playlists), I've always wished it was easier to pull a tracklist — or Shazams — into a SoundCloud playlist. Right now it requires a lot of manual searching, so I built a mini app to find each track for me. Then friends pointed out they'd want the same thing on Spotify, YouTube, and Apple Music — so it does all four.

If you're constantly crate digging, or found a set on YouTube with a tracklist you love, this helps you find the individual tracks much more easily. Paste the list, pick your platform, click through the search links, mark tracks as you add them. Progress saves to your browser so you can come back to it.

**Live site:** https://track-finder.vercel.app

## Usage

1. Visit [track-finder.vercel.app](https://track-finder.vercel.app) (or open `index.html` locally)
2. Paste a tracklist — one track per line
3. Click **Generate**
4. Click **Search** next to each track to find it on SoundCloud (auto-marks it done)
5. Or use **Open next 10** to batch-open the next ten in new tabs

Progress is saved in `localStorage`, so you can close the tab and come back later. Named playlists are kept in a saved list on the input screen.

## Supported formats

One track per line. The parser handles most common formats:

```
Artist - Title
Artist — Title        (em dash, with or without spaces)
Artist – Title        (en dash)
Artist: Title
Artist | Title
Artist<TAB>Title      (paste from a spreadsheet)
1. Artist - Title     (numbered list)
• Artist - Title      (bulleted list)
"Artist" - "Title"    (quotes are stripped)
```

Hyphenated names like `D-Nox` survive because the hyphen splitter requires a space on at least one side. Lines with no recognized separator are searched as a single phrase.

## Features

- Zero dependencies — single HTML file, no build step
- Progress tracking with `localStorage` persistence
- Named saved playlists you can return to
- Batch-open the next 10 undone tracks in new tabs
- `Ctrl+Enter` / `⌘+Enter` in the textarea to generate
- Mobile-friendly

## Deployment

Hosted on Vercel — pushes to the default branch auto-deploy. Static site plus one serverless function (`api/import/youtube`) for the YouTube playlist import.

**For the YouTube playlist import to work**, set one environment variable in the Vercel project:

- `YOUTUBE_API_KEY` — a YouTube Data API v3 key ([get one here](https://console.cloud.google.com/apis/credentials))

Without it, the site still works for pasted tracklists; only the URL-import path errors out with a "Server not configured" message.

To deploy your own fork:

```bash
npx vercel        # preview deployment
npx vercel --prod # production
```

No build step required.

## Pre-fill via URL params

For bookmarklets, shareable links, browser extensions, or third-party integrations, Track Finder accepts these query params on load:

| Param | Value | Effect |
|-------|-------|--------|
| `tracks` | URL-encoded tracklist, one per line (`%0A` between lines) | Populates the textarea |
| `platform` | `soundcloud` / `spotify` / `youtube` / `apple` / `beatport` | Sets the search platform |
| `name` | Playlist name | Populates the Playlist Name field |
| `go` | `1` | Auto-generates and jumps straight to results |

Example:

```
https://track-finder.vercel.app/?tracks=Kanine%20-%20Feel%20The%20Vibration%0ASub%20Focus%20-%20On%20%26%20On&platform=spotify&name=DnB%20Set&go=1
```

All params are optional. Use any combination. The user can still edit the textarea before generating unless `go=1` is set.

## Contributing

Open an [issue](https://github.com/conorbronsdon/track-finder/issues) with a format the parser doesn't handle, a bug, or a feature idea. PRs welcome.

---

Built by [Conor Bronsdon](https://github.com/conorbronsdon) · [X](https://x.com/ConorBronsdon) · [LinkedIn](https://www.linkedin.com/in/conorbronsdon/) · [Chain of Thought podcast](https://chainofthought.show)

## Disclaimer

*All views, opinions, and statements expressed on this project are solely my own and are made in my personal capacity. They do not reflect, and should not be construed as reflecting, the views, positions, or policies of Modular. This project is not affiliated with, authorized by, or endorsed by Modular in any way.*

## License

MIT — see [LICENSE](LICENSE).
