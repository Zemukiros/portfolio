import type { GithubActivity as Activity } from "@/lib/github";

const LEVEL = ["var(--color-bg-panel)", "#c9d8bf", "#8fb184", "#4f8a57", "#2f6a3b"];
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

/** Build-time GitHub stats + 12-month contribution heatmap. Real numbers only. */
export default function GithubActivity({ data, profileUrl }: { data: Activity; profileUrl: string }) {
  const stats = [
    { value: data.publicRepos, label: "Public repos" },
    { value: data.totalContributions, label: "Contributions · 12 mo" },
    { value: data.joinedYear, label: "On GitHub since" },
  ];

  // Month label at the first week whose first day starts a new month.
  const monthLabels = data.weeks.map((w, i) => {
    const m = Number(w[0].date.slice(5, 7)) - 1;
    const prev = i > 0 ? Number(data.weeks[i - 1][0].date.slice(5, 7)) - 1 : -1;
    return m !== prev && i > 0 ? MONTHS[m] : "";
  });

  const CELL = 11;
  const GAP = 3;
  const width = data.weeks.length * (CELL + GAP);
  const height = 7 * (CELL + GAP) + 16;

  return (
    <div className="grid gap-px overflow-hidden rounded-2xl border border-border bg-border lg:grid-cols-[280px_1fr]">
      <dl className="grid grid-cols-3 gap-px bg-border lg:grid-cols-1">
        {stats.map((s) => (
          <div key={s.label} className="bg-bg p-6">
            <dt className="font-mono text-[10.5px] uppercase tracking-[0.14em] text-ink-faint">{s.label}</dt>
            <dd className="mt-2 font-display text-4xl leading-none text-ink">{s.value}</dd>
          </div>
        ))}
      </dl>
      <div className="bg-bg p-6">
        <div className="flex items-baseline justify-between gap-4">
          <p className="font-display text-2xl text-ink">Last 12 months</p>
          <a
            href={profileUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="font-mono text-[11px] uppercase tracking-[0.14em] text-accent-strong hover:underline"
          >
            Profile ↗
          </a>
        </div>
        <div className="mt-5 overflow-x-auto">
          <svg
            width={width}
            height={height}
            role="img"
            aria-label={`${data.totalContributions} GitHub contributions in the last 12 months`}
          >
            {monthLabels.map((m, i) =>
              m ? (
                <text key={i} x={i * (CELL + GAP)} y={10} fontSize="10" className="font-mono" fill="var(--color-ink-faint)">
                  {m}
                </text>
              ) : null,
            )}
            {data.weeks.map((week, wi) =>
              week.map((day) => {
                const dow = new Date(`${day.date}T00:00:00Z`).getUTCDay();
                return (
                  <rect
                    key={day.date}
                    x={wi * (CELL + GAP)}
                    y={16 + dow * (CELL + GAP)}
                    width={CELL}
                    height={CELL}
                    rx="2.5"
                    fill={LEVEL[day.level] ?? LEVEL[0]}
                  >
                    <title>{`${day.count} on ${day.date}`}</title>
                  </rect>
                );
              }),
            )}
          </svg>
        </div>
        <div className="mt-4 flex items-center justify-end gap-1.5 font-mono text-[10.5px] text-ink-faint" aria-hidden="true">
          Less
          {LEVEL.map((c) => (
            <span key={c} className="h-[11px] w-[11px] rounded-[2.5px]" style={{ background: c }} />
          ))}
          More
        </div>
      </div>
    </div>
  );
}
