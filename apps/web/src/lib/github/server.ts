export type GitHubProfile = {
  login: string;
  name: string | null;
  avatarUrl: string;
  htmlUrl: string;
  bio: string | null;
};

function env(name: string): string | undefined {
  const v = process.env[name];
  return v && v.trim().length ? v.trim() : undefined;
}

export async function loadGitHubProfile(): Promise<GitHubProfile> {
  const username = env("GITHUB_USERNAME") ?? "Miljte";
  const token = env("GITHUB_TOKEN");

  const res = await fetch(`https://api.github.com/users/${encodeURIComponent(username)}`,
    {
      headers: {
        Accept: "application/vnd.github+json",
        "User-Agent": "miljte-platform",
        ...(token ? { Authorization: `Bearer ${token}` } : {})
      },
      next: { revalidate: 60 * 60 }
    }
  );

  if (!res.ok) {
    return {
      login: username,
      name: username,
      avatarUrl: "https://avatars.githubusercontent.com/u/0?v=4",
      htmlUrl: `https://github.com/${username}`,
      bio: null
    };
  }

  const data = (await res.json()) as {
    login: string;
    name: string | null;
    avatar_url: string;
    html_url: string;
    bio: string | null;
  };

  return {
    login: data.login,
    name: data.name,
    avatarUrl: data.avatar_url,
    htmlUrl: data.html_url,
    bio: data.bio
  };
}
