"use client";

import { create } from "zustand";

export type MotionMode = "ambient" | "focus";

type FieldState = {
  mode: MotionMode;
  focusPostId: string | null;
  pointer: { x: number; y: number };
  energy: number;
  likes: Record<string, number>;
  liked: Record<string, boolean>;
  setPointer: (p: { x: number; y: number }) => void;
  focus: (postId: string) => void;
  blur: () => void;
  likeImpulse: () => void;
  toggleLike: (postId: string) => void;
};

export const useFieldStore = create<FieldState>((set) => ({
  mode: "ambient",
  focusPostId: null,
  pointer: { x: 0.5, y: 0.5 },
  energy: 0,
  likes: {},
  liked: {},
  setPointer: (p) => set({ pointer: p }),
  focus: (postId) => set({ mode: "focus", focusPostId: postId }),
  blur: () => set({ mode: "ambient", focusPostId: null }),
  likeImpulse: () => set((s) => ({ energy: Math.min(1, s.energy + 0.35) })),
  toggleLike: (postId) =>
    set((s) => {
      const isLiked = !!s.liked[postId];
      const current = s.likes[postId] ?? 0;
      const nextLiked = { ...s.liked, [postId]: !isLiked };
      const nextLikes = { ...s.likes, [postId]: Math.max(0, current + (isLiked ? -1 : 1)) };
      return {
        liked: nextLiked,
        likes: nextLikes,
        energy: Math.min(1, s.energy + (isLiked ? 0.08 : 0.35))
      };
    })
}));
