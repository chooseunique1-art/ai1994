# The South Press

Automated content pipeline test. Astro static site, deployed on Vercel, written to by n8n.

> ✅ Write access confirmed via Claude Dispatch — 2026-08-27

## The contract

n8n's only job on the publishing end is: **commit one markdown file to `src/content/blog/`.**

Everything else — routing, index page, build, deploy — happens automatically.

### File path

```
src/content/blog/YYYY-MM-DD-short-slug.md
```

The slug becomes the URL: `/blog/2026-08-14-short-slug/`

Lowercase, hyphens only, no punctuation or spaces.

### Required frontmatter

```yaml
---
title: "Headline here"
description: "One sentence summary."
pubDate: 2026-08-14
sourceUrl: "https://source.example.com/article"
sourceName: "Reuters"
status: "draft"
---
```

| Field | Type | Notes |
|---|---|---|
| `title` | string | 1–200 chars |
| `description` | string | 1–400 chars |
| `pubDate` | date | `YYYY-MM-DD` |
| `sourceUrl` | url | Must be a valid URL. No source, no post. |
| `sourceName` | string | Outlet or dataset name |
| `status` | `draft` \| `published` | Defaults to `draft` |

### Draft vs published

Only `status: "published"` posts appear on the live site. Drafts are committed
and version-controlled but invisible.

**Keep n8n writing `draft` until the pipeline is trusted.** Read every output,
check for invented facts, then flip to `published` manually. Once the invention
rate is near zero, change n8n to write `published` directly.

### Schema enforcement

`src/content.config.ts` validates every file at build time. A malformed file
fails the Vercel build loudly rather than publishing something broken. This is
the first quality gate — do not loosen it.

## Local development

```bash
npm install
npm run dev
```

## Deploy

Connected to Vercel. Framework preset: Astro. Build command `npm run build`,
output directory `dist`. Deploys on every push to `main`.

## Reference

`src/content/blog/2026-08-14-pipeline-test.md` is a hand-written known-good file.
When a build breaks, diff the failing file against it.
