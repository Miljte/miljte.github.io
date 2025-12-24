import { z } from "zod";

export const TimelineSchema = z.object({
  updatedAt: z.string(),
  pinned: z.array(z.string()).default([]),
  order: z.array(z.string())
});

export type Timeline = z.infer<typeof TimelineSchema>;

export const PostSchema = z.object({
  id: z.string(),
  type: z.enum(["text", "media", "project", "section", "thread"]),
  createdAt: z.string(),
  updatedAt: z.string(),
  status: z.enum(["draft", "published", "archived"]),
  visibility: z.enum(["public", "unlisted", "hidden"]),
  mass: z.number().min(0).max(1),
  tags: z.array(z.string()).default([]),
  thread: z
    .object({
      parentId: z.string().optional(),
      replyIds: z.array(z.string()).default([])
    })
    .default({ replyIds: [] }),
  pointers: z.object({
    publishedRevisionId: z.string().optional(),
    draftRevisionId: z.string().optional()
  }),
  engagement: z.object({ likeCount: z.number().int().nonnegative() })
});

export type Post = z.infer<typeof PostSchema>;

const RevisionBodySchema = z.object({
  blocks: z.array(
    z.discriminatedUnion("type", [
      z.object({ type: z.literal("paragraph"), text: z.string() }),
      z.object({
        type: z.literal("list"),
        style: z.enum(["bullets", "numbers"]).default("bullets"),
        items: z.array(z.string())
      })
    ])
  )
});

export const PostRevisionSchema = z.object({
  id: z.string(),
  postId: z.string(),
  createdAt: z.string(),
  title: z.string().optional(),
  summary: z.string().optional(),
  sectionKind: z.enum(["about", "skills", "experience", "projects"]).optional(),
  body: RevisionBodySchema,
  embeds: z
    .object({
      mediaIds: z.array(z.string()).optional(),
      projectIds: z.array(z.string()).optional()
    })
    .default({})
});

export type PostRevision = z.infer<typeof PostRevisionSchema>;

export type FeedItem = {
  post: Post;
  revision: PostRevision;
  isPinned: boolean;
};
