"use client";

import { FeedItem } from "@/lib/content/schema";
import { useFieldStore } from "@/lib/motion/fieldStore";
import { IconClose, IconHeart } from "@/components/icons";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useMemo, useRef } from "react";

function Blocks({ item }: { item: FeedItem }) {
  return (
    <div className="mt-6 space-y-4">
      {item.revision.body.blocks.map((b, idx) => {
        if (b.type === "paragraph") {
          return (
            <p key={idx} className="text-sm leading-7 text-white/85">
              {b.text}
            </p>
          );
        }

        return (
          <ul key={idx} className="list-disc space-y-2.5 pl-6 text-sm leading-7 text-white/85 marker:text-white/50">
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
          <motion.div className="absolute inset-0 bg-black/70 backdrop-blur-md" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} />

          <motion.div
            layout
            role="dialog"
            aria-modal="true"
            aria-label={item.revision.title ?? "Post"}
            className="absolute left-1/2 top-1/2 w-[min(760px,94vw)] max-h-[88vh] -translate-x-1/2 -translate-y-1/2 overflow-y-auto rounded-3xl border border-white/20 bg-gradient-to-b from-black/95 to-black p-6 shadow-2xl shadow-white/5 md:p-8"
            initial={{ scale: 0.96, y: 20, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.96, y: 20, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-6 border-b border-white/15 pb-6">
              <div className="min-w-0">
                <div className="inline-block rounded-full border border-white/15 bg-white/5 px-2.5 py-1 text-[11px] font-medium uppercase tracking-wider text-white/70">{item.post.type}</div>
                <h2 className="mt-3 text-2xl font-bold leading-tight tracking-tight text-white/95">{item.revision.title ?? "Untitled"}</h2>
                {item.revision.summary ? <p className="mt-3 text-sm leading-relaxed text-white/75">{item.revision.summary}</p> : null}
              </div>
              <div className="flex shrink-0 items-center gap-2">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={
                    "rounded-full border px-4 py-2 text-xs font-medium shadow-lg transition-all " +
                    (isLiked
                      ? "border-white/30 bg-gradient-to-br from-white/20 to-white/15 text-white shadow-white/20"
                      : "border-white/20 bg-gradient-to-br from-white/10 to-white/5 text-white/85 hover:border-white/25 hover:from-white/15 hover:to-white/10")
                  }
                  onClick={() => toggleLike(item.post.id)}
                  type="button"
                  aria-pressed={isLiked}
                >
                  <span className="inline-flex items-center gap-1.5">
                    <IconHeart className="h-4 w-4" />
                    like <span className="tabular-nums">{item.post.engagement.likeCount + localLikes}</span>
                  </span>
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  ref={closeRef}
                  className="rounded-full border border-white/20 bg-gradient-to-br from-white/10 to-white/5 px-4 py-2 text-xs font-medium text-white/85 shadow-lg transition-all hover:border-white/25 hover:from-white/15 hover:to-white/10"
                  onClick={blur}
                  type="button"
                >
                  <span className="inline-flex items-center gap-1.5">
                    <IconClose className="h-4 w-4" />
                    close
                    <span className="ml-1 rounded-md bg-white/15 px-1.5 py-0.5 text-[10px] font-mono">esc</span>
                  </span>
                </motion.button>
              </div>
            </div>

            <Blocks item={item} />
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
