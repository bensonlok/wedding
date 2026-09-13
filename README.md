# Benson & Mecki — Wedding E-Invitation

A polished, mobile-first static wedding invitation for **Benson Lok & Mecki Tan**.

Inspired by [chester050.github.io/wedding](https://chester050.github.io/wedding/).

- Cream / ivory, burgundy / rose, soft gold
- Google Fonts: Great Vibes + Cormorant Garamond (+ Noto Serif SC)
- Countdown timer, scroll fade-ins, WhatsApp-friendly layout
- No npm, no backend — plain HTML / CSS / JS

## Live site

After GitHub Pages is enabled:

**https://bensonlok.github.io/wedding/**

## Files

| File | Purpose |
|------|---------|
| `index.html` | All invitation sections & placeholders |
| `styles.css` | Theme, layout, animations |
| `script.js` | Countdown (`CONFIG.weddingISO`) + fade-ins |
| `README.md` | This guide |

## How to edit placeholders

Open `index.html` and search for bracketed tokens. Replace each one with your real details:

| Placeholder | Where | Example |
|-------------|-------|---------|
| `[WEDDING DATE]` | Hero, footer, OG description | `22 November 2026 (Sunday)` |
| `[GUEST ARRIVAL TIME]` | Timeline | `04:30 PM` |
| `[CEREMONY TIME]` | Timeline | `05:00 PM` |
| `[DINNER TIME]` | Timeline | `07:00 PM` |
| `[VENUE NAME]` | Location | `FGA KL` |
| `[VENUE ADDRESS]` | Location | Full street address |
| `[MAP LINK]` | Location button `href` | Google Maps / Waze URL |
| `[RSVP LINK]` | RSVP button `href` | Google Form / WhatsApp link |
| `[RSVP DEADLINE]` | RSVP section | `1 November 2026` |
| `[STORY]` | Three story cards | Your story paragraphs |

Also update the countdown date in `script.js`:

```js
const CONFIG = {
  // Replace with your real wedding date/time (ISO 8601 + timezone)
  weddingISO: "2099-01-01T17:00:00+08:00",
};
```

Example for Malaysia (UTC+8):

```js
weddingISO: "2026-11-22T17:00:00+08:00",
```

Optional: add an Open Graph image and set `og:image` / `og:url` in `index.html` for nicer WhatsApp / Messenger previews.

## Local preview

Open `index.html` in a browser, or serve the folder:

```bash
# Python
python3 -m http.server 8080

# Or any static file server pointed at this directory
```

Then visit `http://localhost:8080`.

## Deploy to GitHub Pages

### First-time setup (already done if you followed the create flow)

```bash
git init
git add .
git commit -m "Initial wedding invitation"
gh repo create wedding --public --source=. --remote=origin --push
```

Enable Pages from the `main` branch root:

```bash
gh api repos/bensonlok/wedding/pages \
  -X POST \
  -H "Accept: application/vnd.github+json" \
  -f build_type=legacy \
  -f source='{"branch":"main","path":"/"}'
```

Or in the GitHub UI: **Settings → Pages → Source: Deploy from a branch → Branch: `main` / `/ (root)` → Save**.

Site URL: **https://bensonlok.github.io/wedding/**

### Updating later

```bash
# Edit placeholders / styles / script
git add .
git commit -m "Update wedding details"
git push
```

Pages rebuilds automatically within a minute or two.

## Licence

Personal wedding invitation — all rights reserved by Benson Lok & Mecki Tan.
