import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

/**
 * THE CONTRACT.
 *
 * Every markdown file written into src/content/blog/ must satisfy this schema.
 * If n8n writes a file with a missing field, a bad date, or an invalid URL,
 * the Vercel build FAILS LOUDLY instead of publishing something broken.
 *
 * This is the first quality gate in the pipeline. Do not loosen it.
 */
const blog = defineCollection({
  loader: glob({ base: './src/content/blog', pattern: '**/*.md' }),
  schema: z.object({
    // Headline. Keep under ~70 chars.
    title: z.string().min(1).max(200),

    // One-sentence summary. Used on the index page and in meta tags.
    description: z.string().min(1).max(400),

    // ISO date, e.g. 2026-08-14
    pubDate: z.coerce.date(),

    // Where the facts came from. Optional — some stories are aggregated
    // from a source with no single linkable page.
    sourceUrl: z.string().url().optional(),

    // Which outlet, handle, or dataset the source belongs to. Optional —
    // some stories (local tips, no clean attribution) genuinely have none.
    // Leave the field out entirely rather than writing a placeholder like
    // "NA" — the template hides source attribution cleanly when it's unset.
    sourceName: z.string().min(1).optional(),

    // Geographic tag shown in the meta line, e.g. "Middle East".
    region: z.string().min(1).optional(),

    // 'draft' = written but not live. 'published' = appears on the site.
    // n8n should write 'draft' until you trust the pipeline.
    status: z.enum(['draft', 'published']).default('draft'),

    // Lead image. Optional — many stories are text-only by design.
    image: z.string().url().optional(),

    // Credit line for the image, e.g. "Reuters".
    imageCredit: z.string().min(1).optional(),

    // Genuinely urgent, developing story — shows the homepage's breaking
    // banner. Leave false/unset for normal coverage; don't set this just
    // to get a story more visibility.
    breaking: z.boolean().default(false),
  }),
});

export const collections = { blog };
