# Benson & Mecki — Wedding E-Invitation

Mobile-first static wedding invitation, bilingual on one page (English + 简体中文).

**Live site:** https://www.sensify.my/invite/

## The day

- **Friday, 20 November 2026**, W Factory Event Space, 15, Jalan Lira U3/41, U 5, 47200 Shah Alam, Selangor
- 3:00 PM Tea Ceremony · 5:00 PM ROM (Registry of Marriage) · 7:00 PM Dinner · 9:30 PM After Party
- RSVP by **1 November 2026**

## Page flow

1. Full-bleed hero (date, names, countdown to the 3:00 PM start, Malaysia time)
2. Intro ("You're invited") with RSVP / The Day / Save the Date buttons
3. Our story + "read more"
4. Three photo chapters (everyday joy · walking together · a new beginning)
5. Family & friends, photo carousel
6. Order of the day (Tea Ceremony, ROM, Dinner, After Party)
7. Venue with map, Google Maps button and venue website link
8. RSVP form (live)
9. Add to Calendar (Google Calendar link + `assets/benson-mecki-wedding.ics`)

## Files

| File | Purpose |
|------|---------|
| `index.html` | Page content (English + Chinese copy) |
| `styles.css` | Theme and layout |
| `script.js` | Countdown, scroll reveal, menu, carousel, RSVP form (`CONFIG`) |
| `assets/photos/` | Photos (resized, JPEG) |
| `assets/benson-mecki-wedding.ics` | Calendar file (Fri 20 Nov 2026, 3:00 PM to 11:30 PM MYT) |
| `responses/` | Private, passcode-gated page for viewing RSVP replies |

## RSVP

The RSVP form is live (`CONFIG.rsvp.enabled: true` in `script.js`). Replies are saved to the
Supabase table `wedding_rsvp` (insert-only public key): name, attendance (yes / no / maybe),
guest count (0 to 20), optional phone and message.

```js
rsvp: {
  enabled: true,
  deadline: "1 November 2026",   // shown under the RSVP heading; "" to hide
  deadlineZh: "2026年11月1日",     // Chinese deadline line
  supabaseUrl: "https://….supabase.co",
  supabaseAnonKey: "…",
},
```

Replies can be viewed, searched, downloaded (CSV) and deleted on the owner page at
https://www.sensify.my/invite/responses/ (passcode required).

If the date or times change, update all of: `CONFIG.weddingISO` in `script.js`, the timeline,
calendar and footer text in `index.html`, the Google Calendar link (`#gcalLink`), and
`assets/benson-mecki-wedding.ics`.

## Local preview

```bash
python3 -m http.server 8000   # then open http://localhost:8000
```
