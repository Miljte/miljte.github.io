import { GravityFieldCanvas } from "@/components/GravityFieldCanvas";
import { PostFocusOverlay } from "@/components/PostFocusOverlay";
import { TimelineSurface } from "@/components/TimelineSurface";
import { loadFeed } from "@/lib/content/server";

export default async function Home() {
  const items = await loadFeed();

  return (
    <div>
      <GravityFieldCanvas />
      <TimelineSurface items={items} />
      <PostFocusOverlay items={items} />
    </div>
  );
}
