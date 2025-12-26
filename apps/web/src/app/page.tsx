import Image from "next/image";
import { loadFeed } from "@/lib/content/server";
import { loadGitHubProfile } from "@/lib/github/server";
import { ResumeHeaderActions } from "@/components/ResumeHeaderActions";

type SectionKind = "about" | "skills" | "experience" | "projects";
type Block = { type: "paragraph"; text: string } | { type: "list"; items: string[] };

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="cv-section rounded-2xl border border-white/10 bg-white/5 p-5 shadow-sm">
      <h2 className="text-lg font-semibold text-white/95">{title}</h2>
      <div className="mt-3 text-sm text-white/85">{children}</div>
    </section>
  );
}

function Blocks({ blocks }: { blocks: Block[] }) {
  return (
    <div className="mt-2 space-y-3">
      {blocks.map((b, idx) => {
        if (b.type === "paragraph") {
          return (
            <p key={idx} className="leading-7 text-white/85">
              {b.text}
            </p>
          );
        }
        return (
          <ul key={idx} className="list-disc space-y-2 pl-5 text-white/85 marker:text-white/50">
            {b.items?.map((it: string, i: number) => (
              <li key={i}>{it}</li>
            ))}
          </ul>
        );
      })}
    </div>
  );
}

export default async function Home() {
  const items = await loadFeed();
  const profile = await loadGitHubProfile();

  const byKind = (kind: SectionKind) =>
    items.find((x) => x.post.type === "section" && x.revision.sectionKind === kind) ?? null;

  const about = byKind("about");
  const skills = byKind("skills");
  const experience = byKind("experience");
  const projects = byKind("projects");

  return (
    <div className="mx-auto w-full max-w-6xl px-5 py-8 md:py-12">
      <header className="flex items-start justify-between">
        <div className="flex items-center gap-4">
          <div className="h-14 w-14 overflow-hidden rounded-full border border-white/15 bg-white/5">
            <Image src={profile.avatarUrl} alt={profile.name ?? profile.login} width={56} height={56} />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-white/95">{profile.name ?? profile.login}</h1>
            <div className="mt-1 text-sm text-white/70">@{profile.login}</div>
            {profile.bio ? <p className="mt-2 max-w-prose text-sm leading-7 text-white/80">{profile.bio}</p> : null}
          </div>
        </div>
        <ResumeHeaderActions profileUrl={profile.htmlUrl} />
      </header>

      <div className="mt-8 grid gap-6 md:grid-cols-[300px_1fr]">
        {/* Sidebar */}
        <aside className="space-y-6">
          {skills ? (
            <Section title={skills.revision.title ?? "Skills"}>
              {skills.revision.summary ? (
                <p className="leading-7 text-white/80">{skills.revision.summary}</p>
              ) : null}
              <Blocks blocks={skills.revision.body.blocks} />
            </Section>
          ) : null}

          <Section title="Contact">
            <ul className="space-y-2 text-sm text-white/85">
              <li>
                <span className="text-white/60">GitHub: </span>
                <a href={profile.htmlUrl} target="_blank" className="hover:underline" rel="noreferrer">
                  {profile.login}
                </a>
              </li>
            </ul>
          </Section>
        </aside>

        {/* Main content */}
        <main className="space-y-6">
          {about ? (
            <Section title={about.revision.title ?? "About"}>
              {about.revision.summary ? (
                <p className="leading-7 text-white/80">{about.revision.summary}</p>
              ) : null}
              <Blocks blocks={about.revision.body.blocks} />
            </Section>
          ) : null}

          {experience ? (
            <Section title={experience.revision.title ?? "Experience"}>
              {experience.revision.summary ? (
                <p className="leading-7 text-white/80">{experience.revision.summary}</p>
              ) : null}
              <Blocks blocks={experience.revision.body.blocks} />
            </Section>
          ) : null}

          {projects ? (
            <Section title={projects.revision.title ?? "Projects"}>
              {projects.revision.summary ? (
                <p className="leading-7 text-white/80">{projects.revision.summary}</p>
              ) : null}
              <Blocks blocks={projects.revision.body.blocks} />
            </Section>
          ) : null}

          <footer className="cv-section mt-4 flex items-center text-xs text-white/50">
            <span>Updated {new Date().toLocaleDateString()}</span>
          </footer>
        </main>
      </div>
    </div>
  );
}
