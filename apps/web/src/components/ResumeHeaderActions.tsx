"use client";

import Link from "next/link";
import { PrintButton } from "@/components/PrintButton";

export function ResumeHeaderActions({ profileUrl }: { profileUrl: string }) {
  return (
    <div className="flex items-center gap-2">
      <Link
        href={profileUrl}
        target="_blank"
        className="rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-xs text-white/85 hover:bg-white/15"
      >
        GitHub Profile
      </Link>
      <PrintButton />
    </div>
  );
}
