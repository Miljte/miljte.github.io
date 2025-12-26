"use client";

import { FeedItem } from "@/lib/content/schema";
import { useFieldStore } from "@/lib/motion/fieldStore";
import { usePrefersReducedMotion } from "@/lib/motion/reducedMotion";
import { AvatarOrb } from "@/components/AvatarOrb";
import { useEffect, useMemo } from "react";
import { PostCard } from "./PostCard";
import type { GitHubProfile } from "@/lib/github/server";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

export function TimelineSurface({ items, profile }: { items: FeedItem[]; profile: GitHubProfile }) {
  const setPointer = useFieldStore((s) => s.setPointer);
  const focus = useFieldStore((s) => s.focus);
  const blur = useFieldStore((s) => s.blur);
  const focusPostId = useFieldStore((s) => s.focusPostId);
  const prefersReducedMotion = usePrefersReducedMotion();

  const feed = useMemo(() => {
    const sorted = [...items].sort(
      (a, b) => new Date(b.post.createdAt).getTime() - new Date(a.post.createdAt).getTime()
    );
    return sorted;
  }, [items]);

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
      const idx = focusPostId ? feed.findIndex((x) => x.post.id === focusPostId) : -1;
      const next = key === "j" ? idx + 1 : idx - 1;
      const clamped = Math.max(0, Math.min(feed.length - 1, next));
      const id = feed[clamped]?.post.id;
      if (id) focus(id);
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [feed, focus, blur, focusPostId]);

  return (
    <div className="relative mx-auto w-full max-w-7xl px-0 pb-32 pt-0">
      <div className="grid min-h-dvh grid-cols-1 md:grid-cols-[340px_1fr]">
        <aside className="border-b border-white/10 bg-gradient-to-b from-black/40 to-black/20 px-5 py-6 backdrop-blur-xl md:border-b-0 md:border-r md:border-white/10 md:py-8">
          <div className="md:sticky md:top-0 md:pt-4">
            <div className="text-sm font-medium uppercase tracking-wider text-white/60">Profile</div>
            <div className="mt-4 rounded-2xl border border-white/15 bg-gradient-to-br from-white/8 to-white/4 p-5 shadow-lg shadow-black/20 backdrop-blur-sm">
              <AvatarOrb src={profile.avatarUrl} alt={profile.name ?? profile.login} href={profile.htmlUrl} />
              <div className="mt-3.5 text-sm font-semibold tracking-tight text-white/95">
                {profile.name ?? profile.login}
                <span className="ml-2 text-xs font-normal text-white/50">@{profile.login}</span>
              </div>
              {profile.bio ? <div className="mt-2 text-sm leading-relaxed text-white/75">{profile.bio}</div> : null}
              <div className="mt-4">
                <Link
                  href="/"
                  className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-gradient-to-br from-white/12 to-white/8 px-4 py-2 text-xs font-medium text-white/90 shadow-sm transition-all hover:scale-[1.02] hover:border-white/30 hover:from-white/18 hover:to-white/12 hover:text-white hover:shadow-md"
                >
                  ← Back to Resume
                </Link>
              </div>
            </div>
          </div>
        </aside>

        <main className="px-0 md:px-0">
          <div className="sticky top-0 z-10 border-b border-white/10 bg-black/80 backdrop-blur-xl md:bg-gradient-to-b md:from-black/80 md:to-black/60">
            <div className="px-5 py-6 md:px-8 md:py-7">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <div className="text-base font-semibold tracking-tight text-white/95">Profile Feed</div>
                  <div className="mt-1 text-sm leading-relaxed text-white/70">Latest highlights and updates.</div>
                </div>
                <div className="rounded-full bg-white/10 px-3 py-1 text-xs font-medium tabular-nums text-white/70">
                  {feed.length} {feed.length === 1 ? "post" : "posts"}
                </div>
              </div>
            </div>
          </div>

          <div className="divide-y divide-white/8">
            <AnimatePresence mode="popLayout">
              {feed.map((it, idx) => (
                <motion.div
                  key={it.post.id}
                  layout
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.22, delay: Math.min(idx * 0.02, 0.25) }}
                  className="px-5 py-6 transition-colors hover:bg-white/[0.02] md:px-8 md:py-7"
                >
                  <PostCard item={it} profile={profile} onClick={() => focus(it.post.id)} />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {feed.length === 0 && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="flex flex-col items-center justify-center py-24 text-center"
            >
              <div className="text-6xl opacity-20">📭</div>
              <div className="mt-4 text-sm font-medium text-white/70">No posts yet</div>
            </motion.div>
          )}
        </main>

      </div>
    </div>
  );
}
