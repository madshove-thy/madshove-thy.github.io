# madshove-thy.github.io

Personal academic website of Mads Fuglsang Hove, Assistant Professor at the Department of
Political Science, Aarhus University. Live at <https://madshove-thy.github.io>.

Built with [Quarto](https://quarto.org). Every push to `main` triggers a GitHub Action
that renders the site and publishes it to the `gh-pages` branch.

## Editing

| File | What it is |
| --- | --- |
| `_quarto.yml` | Site config: title, navigation bar, footer, theme |
| `styles.scss` | All custom styling (colours, fonts, layout) |
| `index.qmd` | Home / about page |
| `research.qmd` | Research themes |
| `publications.qmd` | Publication list |
| `teaching.qmd` | Courses and thesis supervision |
| `office-hours.qmd` | Booking page (Microsoft Bookings embed) |
| `media.qmd` | Media appearances, policy work, talks |
| `blog/index.qmd` | Listing page for notes |
| `blog/posts/<slug>/index.qmd` | An individual post |
| `images/` | Profile photo, favicon |
| `files/` | Downloadable PDFs |

Search the `.qmd` files for `TODO` to find the spots that still need your input.

## Working locally

Quarto ships with RStudio, so no separate install is needed.

```bash
quarto preview     # live preview at localhost, rebuilds on save
quarto render      # build the site into _site/
```

From RStudio you can also just open the project and click **Render**.

## Adding a blog post

```bash
mkdir -p blog/posts/my-post
```

Create `blog/posts/my-post/index.qmd` with front matter:

```yaml
---
title: "Post title"
description: "One line for the listing page."
date: 2026-10-01
categories: [microtargeting, r]
---
```

R code chunks work exactly as in R Markdown; plots render into the page.

## Publishing

Commit and push to `main`. The action in `.github/workflows/publish.yml` does the rest —
check the **Actions** tab if the site does not update within a couple of minutes.

## Connecting the office-hours booking calendar

`office-hours.qmd` has the embed in place but no calendar behind it yet. GitHub Pages is
static hosting, so the scheduling logic has to live in an external service. Microsoft
Bookings is the right fit here: it comes with the AU Microsoft 365 account, writes to the
Outlook calendar, and releases/holds slots automatically.

1. Go to <https://outlook.office.com/bookings/> and sign in with the AU account. Create a
   booking calendar (e.g. "Office Hours — Mads Fuglsang Hove").
2. Under **Services**, create one service: duration **15 minutes**, buffer time as
   preferred, `Maximum attendees = 1` so a booked slot closes for everyone else.
3. Turn on **"Add a custom field"** and make a "What would you like to discuss?" field
   required — this is what makes 15 minutes usable.
4. Under **Staff**, add yourself and tick **"Events on this staff member's calendar affect
   availability"**. This is the setting that prevents double-booking against teaching,
   meetings, and leave.
5. Under **Booking page**, set the page to *available to people in your organisation* (or
   public, if external students should book too) and publish it. Copy the resulting URL.
6. In `office-hours.qmd`: paste the URL into the `src=""` of the commented-out `<iframe>`,
   uncomment the iframe, and delete the placeholder `<div>` above it.
7. Commit and push.

If AU restricts Bookings, [Cal.com](https://cal.com) free tier does the same job and
connects to an Outlook or Google calendar.
