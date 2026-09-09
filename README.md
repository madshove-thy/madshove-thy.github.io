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
