"use client";

import { motion, AnimatePresence } from "framer-motion";
import { IconClose, IconPlus } from "@/components/icons";
import { useEffect, useRef, useState } from "react";

export function ComposeOverlay({ onClose, onPublish }: { onClose: () => void; onPublish: (text: string) => void }) {
  const [text, setText] = useState("");
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    closeRef.current?.focus();
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [onClose]);

  const publish = () => {
    const trimmed = text.trim();
    if (!trimmed) return;
    onPublish(trimmed);
    setText("");
    onClose();
  };

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div className="absolute inset-0 bg-black/70 backdrop-blur-md" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} />

        <motion.div
          role="dialog"
          aria-modal="true"
          aria-label="Compose"
          className="absolute left-1/2 top-1/2 w-[min(640px,92vw)] max-h-[80vh] -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-3xl border border-white/20 bg-gradient-to-b from-black/95 to-black p-6 shadow-2xl shadow-white/5 md:p-7"
          initial={{ scale: 0.96, y: 16, opacity: 0 }}
          animate={{ scale: 1, y: 0, opacity: 1 }}
          exit={{ scale: 0.96, y: 16, opacity: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-between gap-3 border-b border-white/15 pb-4">
            <div className="text-base font-semibold text-white/95">Compose</div>
            <div className="flex items-center gap-2">
              <button
                onClick={publish}
                type="button"
                className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs font-medium text-white hover:bg-white/15"
              >
                <IconPlus className="h-4 w-4" /> Publish
              </button>
              <button
                ref={closeRef}
                onClick={onClose}
                type="button"
                className="rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-xs text-white/85 hover:bg-white/15"
              >
                <span className="inline-flex items-center gap-1.5">
                  <IconClose className="h-4 w-4" /> close
                  <span className="ml-1 rounded bg-white/10 px-1.5 py-0.5 text-[10px]">esc</span>
                </span>
              </button>
            </div>
          </div>

          <div className="mt-4">
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="What is happening?!"
              rows={5}
              className="w-full resize-none rounded-xl border border-white/15 bg-black/60 p-4 text-sm text-white/90 placeholder:text-white/35 focus:outline-none focus:ring-2 focus:ring-white/20"
            />
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
