import { GravityFieldCanvas } from "@/components/GravityFieldCanvas";
import { PostFocusOverlay } from "@/components/PostFocusOverlay";
import { TimelineSurface } from "@/components/TimelineSurface";
import { loadFeed } from "@/lib/content/server";
import { loadGitHubProfile } from "@/lib/github/server";

export default async function Home() {
  const items = await loadFeed();
  const profile = await loadGitHubProfile();

  return (
    <div>
      <GravityFieldCanvas />
      <TimelineSurface items={items} profile={profile} />
      <PostFocusOverlay items={items} />
    </div>
  );
}
