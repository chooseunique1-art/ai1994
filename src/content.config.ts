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

// Values the pipeline has written as a "nothing here" placeholder at one
// point or another. Treated identically to a genuinely absent field so the
// site never displays a placeholder as if it were real data.
const BLANK_VALUES = new Set(['', 'Confidential source', 'NA', 'N/A']);

// Treats a known placeholder/empty value the same as a genuinely absent
// field. The pipeline sometimes writes "" or a fallback string like
// "Confidential source" instead of omitting a key entirely — Zod's
// .optional() only tolerates a *missing* key, not these placeholder
// values, so without this the build fails (or the placeholder text
// renders on the live site) whenever the source data is blank.
const emptyToUndefined = <T extends z.ZodTypeAny>(schema: T) =>
  z.preprocess(
    (val) => (typeof val === 'string' && BLANK_VALUES.has(val.trim()) ? undefined : val),
    schema.optional()
  );

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
    sourceUrl: emptyToUndefined(z.string().url()),

    // Which outlet, handle, or dataset the source belongs to. Optional —
    // some stories (local tips, no clean attribution) genuinely have none.
    sourceName: emptyToUndefined(z.string().min(1)),

    // Geographic tag shown in the meta line, e.g. "Middle East".
    region: emptyToUndefined(z.string().min(1)),

    // 'draft' = written but not live. 'published' = appears on the site.
    // n8n should write 'draft' until you trust the pipeline.
    status: z.enum(['draft', 'published']).default('draft'),

    // Lead image. Optional — many stories are text-only by design.
    image: emptyToUndefined(z.string().url()),

    // Credit line for the image, e.g. "Reuters".
    imageCredit: emptyToUndefined(z.string().min(1)),

    // Genuinely urgent, developing story — shows the homepage's breaking
    // banner. Leave false/unset for normal coverage; don't set this just
    // to get a story more visibility.
    breaking: z.boolean().default(false),
  }),
});

export const collections = { blog };
