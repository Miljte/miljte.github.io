"use client";

import Image from "next/image";
import { motion, useSpring } from "framer-motion";
import { useEffect, useMemo } from "react";
import { useFieldStore } from "@/lib/motion/fieldStore";
import { usePrefersReducedMotion } from "@/lib/motion/reducedMotion";

export function AvatarOrb({
  src,
  alt,
  href
}: {
  src: string;
  alt: string;
  href: string;
}) {
  const prefersReducedMotion = usePrefersReducedMotion();
  const pointer = useFieldStore((s) => s.pointer);
  const energy = useFieldStore((s) => s.energy);

  const tiltX = useSpring(0, { stiffness: 220, damping: 26 });
  const tiltY = useSpring(0, { stiffness: 220, damping: 26 });
  const glow = useSpring(0, { stiffness: 160, damping: 22 });

  useEffect(() => {
    if (prefersReducedMotion) return;
    // subtle parallax tilt based on pointer
    tiltX.set((pointer.y - 0.5) * -10);
    tiltY.set((pointer.x - 0.5) * 10);
  }, [pointer.x, pointer.y, tiltX, tiltY, prefersReducedMotion]);

  useEffect(() => {
    if (prefersReducedMotion) return;
    glow.set(Math.min(1, energy));
  }, [energy, glow, prefersReducedMotion]);

  const ringVariants = useMemo(
    () => ({
      rest: { rotate: 0 },
      active: { rotate: 360 }
    }),
    []
  );

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="group relative inline-flex items-center gap-3"
      aria-label="Open GitHub profile"
    >
      <motion.div
        className="relative h-12 w-12"
        style={{ rotateX: prefersReducedMotion ? 0 : tiltX, rotateY: prefersReducedMotion ? 0 : tiltY }}
      >
        <motion.div
          className="absolute inset-0 rounded-full border border-white/15"
          variants={ringVariants}
          animate={prefersReducedMotion ? "rest" : "active"}
          transition={{ duration: 18, ease: "linear", repeat: Infinity }}
          style={{ opacity: prefersReducedMotion ? 0.8 : 0.7 }}
        />

        <motion.div
          className="absolute inset-0 rounded-full"
          style={{
            boxShadow: "0 0 0 1px rgba(255,255,255,0.10)",
            opacity: prefersReducedMotion ? 0.25 : 0.25
          }}
        />

        <motion.div
          className="absolute inset-[2px] overflow-hidden rounded-full border border-white/10 bg-white/5"
          animate={prefersReducedMotion ? undefined : { scale: [1, 1 + 0.02 * (0.2 + energy), 1] }}
          transition={{ duration: 1.1, ease: "easeInOut", repeat: prefersReducedMotion ? 0 : Infinity }}
        >
          <Image src={src} alt={alt} fill sizes="48px" className="object-cover opacity-95" />
        </motion.div>

        <motion.div
          className="pointer-events-none absolute -inset-2 rounded-full"
          style={{
            background:
              "radial-gradient(circle at 50% 50%, rgba(255,255,255,0.18), rgba(255,255,255,0) 60%)",
            opacity: prefersReducedMotion ? 0 : glow
          }}
        />
      </motion.div>

      <span className="text-sm font-medium text-white/90 group-hover:text-white">GitHub</span>
    </a>
  );
}
