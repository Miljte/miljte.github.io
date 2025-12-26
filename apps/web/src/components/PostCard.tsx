"use client";

import { FeedItem } from "@/lib/content/schema";
import { IconPin } from "@/components/icons";
import { motion } from "framer-motion";
import { useMemo } from "react";
import Image from "next/image";
import type { GitHubProfile } from "@/lib/github/server";

export function PostCard({ item, onClick, profile }: { item: FeedItem; onClick: () => void; profile?: GitHubProfile }) {
  const isSection = item.post.type === "section";
  const title = item.revision.title ?? item.post.id;
  const createdDate = useMemo(() => new Date(item.post.createdAt).toLocaleDateString(), [item.post.createdAt]);

  return (
    <motion.article
      layout
      whileHover={{ backgroundColor: "rgba(255,255,255,0.02)" }}
      transition={{ type: "spring", stiffness: 320, damping: 26 }}
      className="group relative w-full rounded-2xl bg-transparent text-left"
    >
      <div className="flex items-start gap-3">
        <div className="mt-0.5 h-10 w-10 overflow-hidden rounded-full border border-white/10 bg-white/5">
          {profile?.avatarUrl ? (
            <Image src={profile.avatarUrl} alt={profile.name ?? profile.login} width={40} height={40} />
          ) : (
            <div className="h-full w-full" />
          )}
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2 text-[13px]">
            <span className="font-semibold tracking-tight text-white/95">{profile?.name ?? profile?.login ?? "Portfolio"}</span>
            <span className="text-white/50">@{profile?.login ?? "me"}</span>
            <span className="text-white/40">·</span>
            <span className="text-white/50">{createdDate}</span>
            {item.isPinned ? (
              <span className="inline-flex items-center gap-1 rounded-full border border-amber-500/30 bg-gradient-to-br from-amber-500/20 to-amber-600/15 px-2.5 py-0.5 text-[11px] font-medium text-amber-200/95 shadow-sm">
                <IconPin className="h-3 w-3" /> pinned
              </span>
            ) : null}
            {isSection ? (
              <span className="inline-flex items-center gap-1 rounded-full border border-blue-500/30 bg-gradient-to-br from-blue-500/15 to-blue-600/10 px-2.5 py-0.5 text-[11px] font-medium text-blue-200/90">section</span>
            ) : null}
          </div>

          <button
            onClick={onClick}
            className="mt-2 block w-full rounded-lg px-0 py-1 text-left transition-colors hover:bg-white/[0.02] focus:outline-none focus:ring-2 focus:ring-white/15 focus:ring-offset-2 focus:ring-offset-black"
            type="button"
            aria-label={`Open ${title}`}
          >
            <h2 className="text-[15px] font-semibold leading-6 tracking-tight text-white/95 group-hover:text-white">{title}</h2>
            {item.revision.summary ? (
              <p className="mt-1.5 text-sm leading-relaxed text-white/80">{item.revision.summary}</p>
            ) : null}
          </button>

          {item.post.tags.length ? (
            <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-white/60">
              {item.post.tags.map((tag) => (
                <span key={tag} className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-[11px] font-medium text-white/75">#{tag}</span>
              ))}
            </div>
          ) : null}
        </div>
      </div>
    </motion.article>
  );
}
