"use client";

import { useEffect, useState } from "react";

/** Live clock in a fixed time zone. Renders a stable placeholder until mounted (no hydration mismatch). */
export default function LocalTime({ timeZone, label }: { timeZone: string; label: string }) {
  const [now, setNow] = useState<string | null>(null);

  useEffect(() => {
    const fmt = new Intl.DateTimeFormat("en-US", {
      timeZone,
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
    const tick = () => setNow(fmt.format(new Date()));
    tick();
    const id = setInterval(tick, 15_000);
    return () => clearInterval(id);
  }, [timeZone]);

  return (
    <span className="font-mono text-sm tabular-nums text-ink">
      <time aria-live="off">{now ?? "--:--"}</time> <span className="text-ink-faint">{label}</span>
    </span>
  );
}
