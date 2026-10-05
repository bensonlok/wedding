# Benson & Mecki — Wedding E-Invitation

Mobile-first static wedding invitation (bilingual English + 简体中文).

**Live site:** https://www.sensify.my/invite/

## Page flow

1. Full-bleed hero (date, names, countdown to the 3:30 PM ceremony)
2. "We are getting married" intro
3. Short story + "read more"
4. Three photo chapters (everyday moments · the journey · our forever)
5. Family & friends, photo carousel
6. Day-of timeline (ceremony, tea ceremony, dinner, DJ party)
7. Location with map, Google Maps button and venue link
8. RSVP (hidden until enabled) 
9. Save to Calendar (Google Calendar link + `assets/benson-mecki-wedding.ics`)

## Files

| File | Purpose |
|------|---------|
| `index.html` | Page content |
| `styles.css` | Theme and layout |
| `script.js` | Countdown, scroll reveal, menu, carousel, RSVP switch (`CONFIG`) |
| `assets/photos/` | Photos (resized, JPEG) |
| `assets/benson-mecki-wedding.ics` | Calendar file (20 Nov 2026, 3:30 PM MYT) |

## RSVP

The RSVP section is hidden. To enable it, edit `CONFIG.rsvp` in `script.js`:

```js
rsvp: {
  enabled: true,
  link: "https://…",            // Google Form / WhatsApp link
  deadline: "1 November 2026",  // optional; "" to omit
},
```

## Local preview

```bash
python3 -m http.server 8000   # then open http://localhost:8000
```
