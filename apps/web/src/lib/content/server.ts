import fs from "node:fs/promises";
import path from "node:path";
import { FeedItem, PostRevisionSchema, PostSchema, TimelineSchema } from "./schema";

const ROOT = path.join(process.cwd(), "..", "..", "content");

async function readJson(filePath: string) {
  const raw = await fs.readFile(filePath, "utf8");
  return JSON.parse(raw);
}

export async function loadFeed(): Promise<FeedItem[]> {
  const timelinePath = path.join(ROOT, "timeline.json");
  const timeline = TimelineSchema.parse(await readJson(timelinePath));
  const pinnedSet = new Set(timeline.pinned);

  const items = await Promise.all(
    timeline.order.map(async (postId) => {
      const postPath = path.join(ROOT, "posts", postId, "post.json");
      const post = PostSchema.parse(await readJson(postPath));

      const revId = post.pointers.publishedRevisionId;
      if (!revId) throw new Error(`Post ${postId} has no publishedRevisionId`);

      const revPath = path.join(ROOT, "posts", postId, "revisions", `${revId}.json`);
      const revision = PostRevisionSchema.parse(await readJson(revPath));

      return {
        post,
        revision,
        isPinned: pinnedSet.has(postId)
      } satisfies FeedItem;
    })
  );

  return items.filter((it) => it.post.status === "published" && it.post.visibility === "public");
}
