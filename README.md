# Benson & Mecki — Wedding E-Invitation

Mobile-first static wedding invitation, bilingual on one page (English + 简体中文).

**Live site:** https://www.sensify.my/invite/

## The day

- **Friday, 20 November 2026**, W Factory Event Space, 15, Jalan Lira U3/41, U 5, 47200 Shah Alam, Selangor
- 3:00 PM Tea Ceremony · 5:00 PM ROM (Registry of Marriage) · 7:00 PM Dinner · 9:30 PM After Party
- RSVP by **20 October 2026**

## Page flow

1. Full-bleed hero (date, names, countdown to the 3:00 PM start, Malaysia time)
2. Intro ("You're invited") with RSVP / The Day / Save the Date buttons
3. Our story + "read more"
4. Our love story in five chapters: The Beginning 初见 · Little Adventures 一起走过 (3-photo swipe) ·
   The Proposal 求婚 · Our Family 我们的家 · The Big Day 大日子 (leads into the Schedule of the Day)
5. Schedule of the Day 当日流程 (Tea Ceremony, ROM, Dinner, After Party), with "Guests are welcome from 3:00 PM onwards"
6. Sip, Create & Enjoy · 小酌 · 手作 · 享受相聚: Coffee Cart, Ice Cream Cart, Handcraft Corner (3:00 PM onwards); Drinks & Bites · 美酒 · 小食 (from 5:00 PM)
7. Venue with map, Google Maps button and venue website link
8. RSVP form (live)
9. Add to Calendar (Google Calendar link + `assets/benson-mecki-wedding.ics`)

## Files

| File | Purpose |
|------|---------|
| `index.html` | Page content (English + Chinese copy) |
| `styles.css` | Theme and layout |
| `script.js` | Countdown, scroll reveal, menu, story carousel dots, RSVP form (`CONFIG`) |
| `assets/photos/` | Photos (resized web JPEG, EXIF stripped): hero `hero-rings.jpg` (wedding rings, compress only), story `story-0*.jpg` |
| `assets/benson-mecki-wedding.ics` | Calendar file (Fri 20 Nov 2026, 3:00 PM to 11:30 PM MYT) |
| `responses/` | Private, passcode-gated page for viewing RSVP replies |

## RSVP

The RSVP form is live (`CONFIG.rsvp.enabled: true` in `script.js`). Replies are saved to the
Supabase table `wedding_rsvp` (insert-only public key): name, attendance (yes / no / maybe),
guest count (0 to 20, "Please include yourself"; set to 0 automatically when
"not attending" is picked, at least 1 for "yes"), optional phone and message.
The reply-by date (20 October 2026 / 2026年10月20日) is hardcoded in `index.html`.

```js
rsvp: {
  enabled: true,
  deadline: "20 October 2026",   // shown under the RSVP heading; "" to hide
  deadlineZh: "2026年10月20日",     // Chinese deadline line
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
