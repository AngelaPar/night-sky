# Night Sky

A GitHub calendar for my homepage: every time I make progress, a star lights up.

**Live:** https://sky.angelaparahinog.com

As of November 2026, you can probably count the stars on one hand, but fingers crossed that having this on my homepage will remind me to keep working on my stuff.

## How it works
- A daily GitHub Action reads my public contribution calendar and saves it as `contributions.json` (no token needed)
- `sky.js` draws each day of the year as a pixel star: dim for rest days, bright for progress, twinkling gold for big days
- Hosted on Cloudflare Pages, which redeploys whenever the data updates

## Built with
HTML · CSS · JavaScript (SVG) · GitHub Actions · Cloudflare Pages
