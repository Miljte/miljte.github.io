"use client";

import { FeedItem } from "@/lib/content/schema";
import { useFieldStore } from "@/lib/motion/fieldStore";
import { IconChevronRight, IconHeart, IconPin } from "@/components/icons";
import { motion } from "framer-motion";
import { useMemo } from "react";

export function PostCard({ item, onClick }: { item: FeedItem; onClick: () => void }) {
  const isSection = item.post.type === "section";
  const title = item.revision.title ?? item.post.id;
  const toggleLike = useFieldStore((s) => s.toggleLike);
  const localLikes = useFieldStore((s) => s.likes[item.post.id] ?? 0);
  const isLiked = useFieldStore((s) => !!s.liked[item.post.id]);

  const massBadge = useMemo(() => {
    const m = item.post.mass;
    if (m > 0.9) return "anchor";
    if (m > 0.7) return "heavy";
    return "drift";
  }, [item.post.mass]);

  return (
    <motion.article
      layout
      whileHover={{ y: -1 }}
      className="group relative w-full rounded-2xl bg-transparent text-left"
    >
      <div className="flex items-start justify-between gap-4">
        <button
          onClick={onClick}
          className="min-w-0 flex-1 text-left focus:outline-none"
          type="button"
          aria-label={`Open ${title}`}
        >
          <div className="flex items-center gap-2">
            {item.isPinned ? (
              <span className="inline-flex items-center gap-1 rounded-full bg-white/10 px-2 py-1 text-[11px] tracking-wide text-white/80">
                <IconPin className="h-3.5 w-3.5" />
                pinned
              </span>
            ) : null}
            <span className="rounded-full bg-white/10 px-2 py-1 text-[11px] tracking-wide text-white/75">{massBadge}</span>
            {isSection ? (
              <span className="rounded-full bg-white/10 px-2 py-1 text-[11px] tracking-wide text-white/75">section</span>
            ) : null}
          </div>
          <h2 className="mt-2 text-[15px] font-semibold leading-5 text-white/95">{title}</h2>
          {item.revision.summary ? <p className="mt-1 text-sm leading-6 text-white/70">{item.revision.summary}</p> : null}
          <div className="mt-2 text-[11px] text-white/45">click to open</div>
        </button>

        <div className="flex shrink-0 flex-col items-end gap-2">
          <div className="text-xs text-white/50">{new Date(item.post.createdAt).toLocaleDateString()}</div>
          <motion.button
            type="button"
            onClick={() => toggleLike(item.post.id)}
            whileTap={{ scale: 0.96 }}
            className={
              "rounded-full border px-3 py-1.5 text-xs transition " +
              (isLiked
                ? "border-white/25 bg-white/15 text-white"
                : "border-white/15 bg-white/10 text-white/85 hover:bg-white/15")
            }
            aria-pressed={isLiked}
            aria-label={isLiked ? "Unlike" : "Like"}
          >
            <span className="inline-flex items-center gap-1.5">
              <IconHeart className="h-4 w-4" />
              like <span className="tabular-nums">{item.post.engagement.likeCount + localLikes}</span>
            </span>
          </motion.button>
        </div>
      </div>
    </motion.article>
  );
}
