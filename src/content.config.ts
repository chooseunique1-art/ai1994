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

    // Where the facts came from. Required — no source, no post.
    sourceUrl: z.string().url(),

    // Which outlet or dataset the source belongs to.
    sourceName: z.string().min(1),

    // 'draft' = written but not live. 'published' = appears on the site.
    // n8n should write 'draft' until you trust the pipeline.
    status: z.enum(['draft', 'published']).default('draft'),
    image: z.string().url().optional(),
    imageCredit: z.string().optional(),
  }),
});

export const collections = { blog };
