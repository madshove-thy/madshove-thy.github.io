# madshove-thy.github.io

Personal academic website of Mads Fuglsang Hove, Assistant Professor at the Department of
Political Science, Aarhus University. Live at <https://madshove-thy.github.io>.

Built with [Quarto](https://quarto.org). Every push to `main` triggers a GitHub Action
that renders the site and pushes the result to the `gh-pages` branch, which is what
GitHub Pages serves.

---

## Current state

**Live pages:** About · Publications · Teaching · Office hours · Media & outreach

**Hidden but kept in the repo:** `research.qmd` and the whole `blog/` (Notes) section.
They are excluded by the `render:` list in `_quarto.yml`, not deleted. See
[Re-enabling a hidden page](#re-enabling-a-hidden-page).

**Design brief:** deliberately plain. System font stack, no webfonts, no accent colour,
no hover effects, flat components. If you edit `styles.scss`, keep it boring on purpose.

## Open items

- [ ] **Bookings URL** — the office-hours page shows a placeholder until a Microsoft
      Bookings calendar is connected. See [below](#connecting-the-office-hours-booking-calendar).
- [ ] **DOIs and links** on `publications.qmd` — there is a `TODO` comment near the top
      showing the exact markup for DOI / PDF / replication-data buttons.
- [ ] **Missing year** — the Votta et al. Routledge chapter ("Who Do Parties Target?") has
      no publication year; it was not on the CV.
- [ ] **Individual media pieces** — `media.qmd` currently lists outlets only. There is a
      commented-out `.entry` template if specific pieces should be listed.

## Files

| File | What it is |
| --- | --- |
| `_quarto.yml` | Site config: title, navbar, footer, theme, and the `render:` list |
| `styles.scss` | All custom styling |
| `index.qmd` | Home / about page |
| `publications.qmd` | Publication list |
| `teaching.qmd` | Courses and thesis supervision |
| `office-hours.qmd` | Booking page (Microsoft Bookings embed) |
| `media.qmd` | Media appearances |
| `research.qmd` | Research themes — **not currently rendered** |
| `blog/` | Notes section — **not currently rendered** |
| `images/` | Profile photo (`profile.jpg`), favicon |
| `.github/workflows/publish.yml` | The build-and-deploy action |

## Working locally

Quarto ships with RStudio, so there is no separate install. Open the project in RStudio
and click **Render**, or from a terminal:

```bash
quarto preview     # live preview, rebuilds on save
quarto render      # build into _site/
```

**On this machine specifically**, Quarto is not on the `PATH`. It lives inside RStudio,
and the long path breaks because of the space in "Program Files" — use the 8.3 short
path from Git Bash:

```bash
/c/PROGRA~1/RStudio/resources/app/bin/quarto/bin/quarto.cmd render
```

If a render fails with `Device or resource busy` or `cannot access the file`, Dropbox is
holding a lock on the build directory. `rm -rf _site .quarto` and render again.

## Publishing

Commit and push to `main`; the action does the rest. Check the **Actions** tab if the
site has not updated within a few minutes. Builds take roughly 6 minutes, most of it
installing R packages.

Do not commit `_site/` — it is gitignored, and the deployed site is built fresh by CI.

## Re-enabling a hidden page

To bring the Research page back:

1. In `_quarto.yml`, delete the line `- "!research.qmd"` from the `render:` list.
2. Add it back to the navbar under `navbar: left:`:

   ```yaml
   - href: research.qmd
     text: Research
   ```

For the Notes section, delete `- "!blog/"` instead and add a navbar entry pointing at
`blog/index.qmd`.

## Adding a blog post

Only relevant once the Notes section is un-hidden. Create
`blog/posts/my-post/index.qmd`:

```yaml
---
title: "Post title"
description: "One line for the listing page."
date: 2026-10-01
categories: [microtargeting, r]
---
```

R code chunks work exactly as in R Markdown and plots render into the page. The build
already installs R, knitr, rmarkdown, ggplot2 and dplyr — **any other package a post
uses must be added to the `packages:` list in `.github/workflows/publish.yml`**, or the
CI render will fail.

## Connecting the office-hours booking calendar

`office-hours.qmd` has the embed in place but no calendar behind it yet. GitHub Pages is
static hosting, so the scheduling logic has to live in an external service. Microsoft
Bookings is the right fit: it comes with the AU Microsoft 365 account, writes to the
Outlook calendar, and holds and releases slots automatically.

1. Go to <https://outlook.office.com/bookings/> and sign in with the AU account. Create a
   booking calendar (e.g. "Office Hours — Mads Fuglsang Hove").
2. Under **Services**, create one service: duration **15 minutes**, buffer time as
   preferred, `Maximum attendees = 1` so a booked slot closes for everyone else.
3. Add a required custom field — "What would you like to discuss?" — which is what makes
   15 minutes usable.
4. Under **Staff**, add yourself and tick **"Events on this staff member's calendar
   affect availability"**. This is the setting that prevents double-booking against
   teaching, meetings, and leave.
5. Under **Booking page**, set the page to *available to people in your organisation* (or
   public, if external students should book too) and publish it. Copy the URL.
6. In `office-hours.qmd`: paste the URL into the `src=""` of the commented-out
   `<iframe>`, uncomment the iframe, and delete the placeholder `<div>` above it.
7. Commit and push.

If AU restricts Bookings, [Cal.com](https://cal.com) free tier does the same job and
connects to an Outlook or Google calendar.

## Notes on the setup

Two things that are easy to trip over if this is ever rebuilt from scratch:

- `quarto publish gh-pages` **fails unless the `gh-pages` branch already exists**. It was
  seeded once with `git push origin main:refs/heads/gh-pages`.
- Pages must be configured to serve the **`gh-pages` branch**, not `main`. GitHub
  auto-enables Pages on `main` for any `<user>.github.io` repo, which serves raw `.qmd`
  source and 404s everywhere.
- Image filenames are case-sensitive on the Linux build runner but not on Windows. Keep
  `profile.jpg` lowercase; a `profile.JPG` will render locally and 404 in production.
