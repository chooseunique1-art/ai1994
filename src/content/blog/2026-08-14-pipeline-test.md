---
title: "Pipeline test post"
description: "A hand-written reference post showing the exact file format the automation must produce."
pubDate: 2026-08-14
sourceUrl: "https://example.com/reference"
sourceName: "Manual"
status: "published"
---

This post was written by hand. It exists as a known-good reference — when a build
breaks, diff the failing file against this one.

The frontmatter above is the contract. Every field is required except `status`,
which defaults to `draft`. The build fails if `pubDate` is not a valid date or
`sourceUrl` is not a valid URL.

Body content is plain markdown. Headings, paragraphs, and links all work.

Filename convention is `YYYY-MM-DD-short-slug.md`. The slug becomes the URL, so
keep it lowercase with hyphens and no punctuation.
