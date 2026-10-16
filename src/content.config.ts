import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

/**
 * 文章集合：Markdown 文件放在 src/content/posts/ 下
 * 文件名即 URL：src/content/posts/hello-world.md → /posts/hello-world
 */
const posts = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/posts' }),
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    summary: z.string().default(''),
    tags: z.array(z.string()).default([]),
    category: z.string().default('投资研究'),
    draft: z.boolean().default(false),
  }),
});

export const collections = { posts };
