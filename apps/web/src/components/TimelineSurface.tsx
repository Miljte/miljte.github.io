"use client";

import { FeedItem } from "@/lib/content/schema";
import { useFieldStore } from "@/lib/motion/fieldStore";
import { usePrefersReducedMotion } from "@/lib/motion/reducedMotion";
import { IconInfo, IconKeyboard, IconPin, IconZap } from "@/components/icons";
import { useEffect, useMemo } from "react";
import { PostCard } from "./PostCard";

export function TimelineSurface({ items }: { items: FeedItem[] }) {
  const setPointer = useFieldStore((s) => s.setPointer);
  const focus = useFieldStore((s) => s.focus);
  const likeImpulse = useFieldStore((s) => s.likeImpulse);
  const blur = useFieldStore((s) => s.blur);
  const focusPostId = useFieldStore((s) => s.focusPostId);
  const prefersReducedMotion = usePrefersReducedMotion();

  const pinned = useMemo(() => items.filter((x) => x.isPinned), [items]);

  useEffect(() => {
    if (prefersReducedMotion) return;
    const onMove = (e: PointerEvent) => {
      const x = Math.min(1, Math.max(0, e.clientX / window.innerWidth));
      const y = Math.min(1, Math.max(0, e.clientY / window.innerHeight));
      setPointer({ x, y });
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, [setPointer, prefersReducedMotion]);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        blur();
        return;
      }

      if (e.key === "Enter" && focusPostId) {
        return;
      }

      const key = e.key.toLowerCase();
      if (key !== "j" && key !== "k") return;

      e.preventDefault();
      const idx = focusPostId ? items.findIndex((x) => x.post.id === focusPostId) : -1;
      const next = key === "j" ? idx + 1 : idx - 1;
      const clamped = Math.max(0, Math.min(items.length - 1, next));
      const id = items[clamped]?.post.id;
      if (id) focus(id);
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [items, focus, blur, focusPostId]);

  return (
    <div className="relative mx-auto w-full max-w-6xl px-0 pb-24 pt-0">
      <div className="grid min-h-dvh grid-cols-1 md:grid-cols-[300px_1fr]">
        <aside className="border-b border-white/10 bg-black/20 px-4 py-4 md:border-b-0 md:border-r md:border-white/10 md:bg-black/0 md:py-6">
          <div className="md:sticky md:top-0 md:pt-2">
            <div className="flex items-center justify-between">
              <h1 className="text-lg font-semibold text-white/95">Gravity Feed</h1>
              <button
                className="rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-xs text-white/85 hover:bg-white/15"
                onClick={likeImpulse}
                type="button"
                aria-label="Pulse the field"
              >
                <span className="inline-flex items-center gap-1.5">
                  <IconZap className="h-4 w-4" />
                  pulse
                </span>
              </button>
            </div>

            <div className="mt-3 text-sm text-white/70">
              A feed first. Motion second.
            </div>

            <div className="mt-4 text-xs text-white/55">
              <span className="inline-flex items-center gap-2">
                <IconKeyboard className="h-4 w-4" />
                j/k navigate · enter focus · esc close
              </span>
            </div>

            {pinned.length ? (
              <div className="mt-6">
                <div className="mb-2 inline-flex items-center gap-2 text-xs font-medium text-white/70">
                  <IconPin className="h-4 w-4" />
                  Pinned
                </div>
                <div className="grid gap-1">
                  {pinned.map((p) => (
                    <button
                      key={p.post.id}
                      onClick={() => focus(p.post.id)}
                      className="flex items-center justify-between rounded-xl px-3 py-2 text-left text-sm text-white/85 hover:bg-white/5"
                      type="button"
                    >
                      <span className="truncate">{p.revision.title ?? p.post.id}</span>
                      <span className="text-xs text-white/40">open</span>
                    </button>
                  ))}
                </div>
              </div>
            ) : null}

            <div className="mt-6 text-xs text-white/45">{prefersReducedMotion ? "Reduced motion." : "Motion on."}</div>
          </div>
        </aside>

        <main className="px-0 md:px-0">
          <div className="border-b border-white/10 px-4 py-4 md:px-6 md:py-5">
            <div className="flex items-center justify-between">
              <div className="text-sm font-medium text-white/90">Timeline</div>
              <div className="text-xs text-white/50">{items.length} posts</div>
            </div>
            <div className="mt-1 text-sm text-white/65">Hover to stabilize. Click to focus.</div>
          </div>

          <div className="divide-y divide-white/10">
            {items.map((it) => (
              <div key={it.post.id} className="px-4 py-3 md:px-6">
                <PostCard item={it} onClick={() => focus(it.post.id)} />
              </div>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}
