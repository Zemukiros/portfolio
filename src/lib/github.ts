/**
 * Public GitHub activity, fetched once at build time (no token, no runtime requests).
 * Any failure returns null and the section hides itself — never placeholder numbers.
 */
export type ContributionDay = { date: string; count: number; level: number };

export type GithubActivity = {
  publicRepos: number;
  joinedYear: number;
  totalContributions: number;
  /** Weeks (columns) of 7 days, oldest first, as GitHub draws its calendar. */
  weeks: ContributionDay[][];
};

const HEADERS = { "User-Agent": "zemariam-portfolio-build" };

export async function getGithubActivity(user: string): Promise<GithubActivity | null> {
  try {
    const [profileRes, calendarRes] = await Promise.all([
      fetch(`https://api.github.com/users/${user}`, { headers: HEADERS }),
      fetch(`https://github.com/users/${user}/contributions`, {
        headers: { ...HEADERS, "X-Requested-With": "XMLHttpRequest" },
      }),
    ]);
    if (!profileRes.ok || !calendarRes.ok) return null;

    const profile = (await profileRes.json()) as { public_repos: number; created_at: string };
    const html = await calendarRes.text();

    // Each day cell: data-date + id (+ data-level); its count lives in the matching <tool-tip for=id>.
    const cells = [
      ...html.matchAll(/data-date="([\d-]+)" id="(contribution-day-component-\d+-\d+)" data-level="(\d)"/g),
    ];
    const counts = new Map<string, number>();
    for (const [, id, text] of html.matchAll(/for="(contribution-day-component-\d+-\d+)"[^>]*>([^<]+)/g)) {
      const n = /^(\d+) contribution/.exec(text.trim());
      counts.set(id, n ? Number(n[1]) : 0);
    }
    if (cells.length < 300) return null;

    const days = cells
      .map(([, date, id, level]) => ({ date, count: counts.get(id) ?? 0, level: Number(level) }))
      .sort((a, b) => a.date.localeCompare(b.date));

    // Group into Sunday-first weeks like GitHub's calendar.
    const weeks: ContributionDay[][] = [];
    for (const day of days) {
      const weekday = new Date(`${day.date}T00:00:00Z`).getUTCDay();
      if (weekday === 0 || weeks.length === 0) weeks.push([]);
      weeks[weeks.length - 1].push(day);
    }

    return {
      publicRepos: profile.public_repos,
      joinedYear: new Date(profile.created_at).getUTCFullYear(),
      totalContributions: days.reduce((sum, d) => sum + d.count, 0),
      weeks,
    };
  } catch {
    return null;
  }
}
