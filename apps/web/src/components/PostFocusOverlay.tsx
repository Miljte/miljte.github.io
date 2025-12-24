"use client";

import { FeedItem } from "@/lib/content/schema";
import { useFieldStore } from "@/lib/motion/fieldStore";
import { IconClose, IconHeart } from "@/components/icons";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useMemo, useRef } from "react";

function Blocks({ item }: { item: FeedItem }) {
  return (
    <div className="mt-4 space-y-3">
      {item.revision.body.blocks.map((b, idx) => {
        if (b.type === "paragraph") {
          return (
            <p key={idx} className="text-sm leading-6 text-white/80">
              {b.text}
            </p>
          );
        }

        return (
          <ul key={idx} className="list-disc space-y-2 pl-5 text-sm text-white/80">
            {b.items.map((it, i) => (
              <li key={i}>{it}</li>
            ))}
          </ul>
        );
      })}
    </div>
  );
}

export function PostFocusOverlay({ items }: { items: FeedItem[] }) {
  const focusPostId = useFieldStore((s) => s.focusPostId);
  const blur = useFieldStore((s) => s.blur);
  const toggleLike = useFieldStore((s) => s.toggleLike);
  const localLikes = useFieldStore((s) => (focusPostId ? s.likes[focusPostId] ?? 0 : 0));
  const isLiked = useFieldStore((s) => (focusPostId ? !!s.liked[focusPostId] : false));
  const closeRef = useRef<HTMLButtonElement>(null);

  const item = useMemo(() => items.find((x) => x.post.id === focusPostId) ?? null, [items, focusPostId]);

  useEffect(() => {
    if (!item) return;
    closeRef.current?.focus();
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") blur();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [item, blur]);

  return (
    <AnimatePresence>
      {item ? (
        <motion.div
          className="fixed inset-0 z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={blur}
        >
          <motion.div className="absolute inset-0 bg-black/60 backdrop-blur-sm" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} />

          <motion.div
            layout
            role="dialog"
            aria-modal="true"
            aria-label={item.revision.title ?? "Post"}
            className="absolute left-1/2 top-1/2 w-[min(720px,92vw)] max-h-[84vh] -translate-x-1/2 -translate-y-1/2 overflow-y-auto rounded-2xl border border-white/15 bg-black p-5"
            initial={{ scale: 0.98, y: 10, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.98, y: 10, opacity: 0 }}
            transition={{ type: "spring", stiffness: 260, damping: 28 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-4 border-b border-white/10 pb-4">
              <div className="min-w-0">
                <div className="text-xs tracking-wide text-white/60">{item.post.type}</div>
                <h2 className="mt-2 text-xl font-semibold text-white/95">{item.revision.title ?? "Untitled"}</h2>
                {item.revision.summary ? <p className="mt-2 text-sm text-white/70">{item.revision.summary}</p> : null}
              </div>
              <div className="flex items-center gap-2">
                <button
                  className={
                    "rounded-full border px-3 py-1.5 text-xs transition " +
                    (isLiked
                      ? "border-white/25 bg-white/15 text-white"
                      : "border-white/15 bg-white/10 text-white/85 hover:bg-white/15")
                  }
                  onClick={() => toggleLike(item.post.id)}
                  type="button"
                  aria-pressed={isLiked}
                >
                  <span className="inline-flex items-center gap-1.5">
                    <IconHeart className="h-4 w-4" />
                    like <span className="tabular-nums">{item.post.engagement.likeCount + localLikes}</span>
                  </span>
                </button>
                <button
                  ref={closeRef}
                  className="rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-xs text-white/85 hover:bg-white/15"
                  onClick={blur}
                  type="button"
                >
                  <span className="inline-flex items-center gap-1.5">
                    <IconClose className="h-4 w-4" />
                    close
                    <span className="ml-1 rounded bg-white/10 px-1.5 py-0.5 text-[10px]">esc</span>
                  </span>
                </button>
              </div>
            </div>

            <Blocks item={item} />
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
