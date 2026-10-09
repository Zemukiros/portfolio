/**
 * Case-study visuals for QueryGuard, in the site's schematic language:
 * field-green line-work on paper panels, the safety layers grouped, the scorer
 * glowing, mono labels for code and data. Every label maps to the queryguard repo
 * (generate.py, guardrails.py, executor.py, validation/, confidence.py).
 */

const MONO = "var(--font-mono)";
const DISPLAY = "var(--font-display)";
const BODY = "var(--font-body)";

function Arrow({ id, color = "#2f6a3b" }: { id: string; color?: string }) {
  return (
    <marker id={id} viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
      <path d="M0 0L10 5L0 10z" fill={color} />
    </marker>
  );
}

function Box({
  x,
  y,
  w,
  h,
  title,
  lines,
  stat,
  featured = false,
}: {
  x: number;
  y: number;
  w: number;
  h: number;
  title: string;
  lines: string[];
  stat?: string;
  featured?: boolean;
}) {
  return (
    <g>
      <rect
        x={x}
        y={y}
        width={w}
        height={h}
        rx="16"
        fill={featured ? "#e7e3d6" : "#efece2"}
        stroke={featured ? "#2f6a3b" : "#c4bfae"}
        strokeWidth={featured ? 2 : 1.5}
        filter={featured ? "url(#qgGlow)" : undefined}
      />
      <text x={x + 16} y={y + 28} fill="#18211a" fontSize="16" fontFamily={DISPLAY}>
        {title}
      </text>
      {lines.map((l, i) => (
        <text key={l} x={x + 16} y={y + 50 + i * 17} fill="#485148" fontSize="11.5" fontFamily={BODY}>
          {l}
        </text>
      ))}
      {stat && (
        <text x={x + 16} y={y + h - 14} fill="#285d33" fontSize="10.5" fontWeight="600" fontFamily={MONO}>
          {stat}
        </text>
      )}
    </g>
  );
}

/* ------------------------------------------------------------ pipeline */

export function QueryGuardPipelineDiagram() {
  const detectors = [
    {
      x: 20,
      title: "Sanity checks",
      lines: ["Result shape vs the", "schema profile, plus the", "revenue_status rule"],
      stat: "alone: 17% of mutations",
    },
    {
      x: 250,
      title: "Blind back-translation",
      lines: ["SQL → question (Haiku);", "it never sees the original.", "A judge compares the two."],
      stat: "alone: 65% of mutations",
    },
    {
      x: 480,
      title: "Second-query agreement",
      lines: ["An independent second", "query runs; its results", "must match the first."],
      stat: "alone: 91% of mutations",
    },
  ];
  return (
    <svg
      viewBox="0 0 960 462"
      role="img"
      aria-label="QueryGuard pipeline. A question goes to the generator, Claude Sonnet, which returns typed SQL, a clarification when the question is ambiguous, or a refusal when the schema cannot answer it. SQL then passes two independent safety layers: a guardrail that parses sqlparse tokens and allows one SELECT with no DML anywhere, adding a LIMIT, and rejects anything else with the rule named; then a read-only executor that runs as the SELECT-only queryguard_ro role inside a READ ONLY transaction that is always rolled back, with a statement timeout. The result goes to three detectors: sanity checks on the result shape, blind back-translation of the SQL into a question judged against the original, and agreement with an independent second query. Their signals feed a calibrated logistic confidence model, and the answer returns rows, the SQL, every verdict and the probability that it is correct."
      className="h-auto w-full"
    >
      <defs>
        <Arrow id="qgArrow" />
        <Arrow id="qgArrowDim" color="#5a6258" />
        <filter id="qgGlow" x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="10" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* row 1: question → generate → safety layers */}
      <line x1="140" y1="72" x2="186" y2="72" stroke="#2f6a3b" strokeWidth="2" markerEnd="url(#qgArrow)" />
      <line x1="380" y1="72" x2="456" y2="72" stroke="#2f6a3b" strokeWidth="2" markerEnd="url(#qgArrow)" />
      <line x1="660" y1="72" x2="696" y2="72" stroke="#2f6a3b" strokeWidth="2" markerEnd="url(#qgArrow)" />

      <rect x="20" y="40" width="120" height="64" rx="16" fill="#efece2" stroke="#c4bfae" strokeWidth="1.5" />
      <text x="80" y="70" textAnchor="middle" fill="#18211a" fontSize="16" fontFamily={DISPLAY}>Question</text>
      <text x="80" y="88" textAnchor="middle" fill="#5a6258" fontSize="10.5" fontFamily={MONO}>plain English</text>

      <Box x={190} y={24} w={190} h={96} title="Generate" lines={["Claude Sonnet → typed SQL,", "a clarification, or a refusal"]} />
      <text x="198" y="142" fill="#5a6258" fontSize="10.5" fontFamily={MONO}>↳ ambiguous: ask which reading</text>
      <text x="198" y="160" fill="#5a6258" fontSize="10.5" fontFamily={MONO}>↳ not in schema: cannot answer</text>

      <rect x="436" y="6" width="504" height="176" rx="20" fill="none" stroke="#2f6a3b" strokeWidth="1.4" strokeDasharray="6 6" />
      <text x="924" y="172" textAnchor="end" fill="#285d33" fontSize="10.5" fontWeight="600" fontFamily={MONO}>
        two independent safety layers
      </text>
      <Box
        x={460}
        y={24}
        w={200}
        h={96}
        title="① Guardrail"
        lines={["sqlparse tokens: one SELECT,", "no DML anywhere, LIMIT added"]}
      />
      <Box
        x={700}
        y={24}
        w={220}
        h={96}
        title="② Read-only executor"
        lines={["queryguard_ro: SELECT only", "READ ONLY txn, rolled back"]}
      />
      <text x="468" y="142" fill="#5a6258" fontSize="10.5" fontFamily={MONO}>↳ rejected: blocked, rule named</text>

      {/* fan-out bus to the detectors */}
      <polyline points="810,120 810,214" fill="none" stroke="#2f6a3b" strokeWidth="2" />
      <line x1="125" y1="214" x2="810" y2="214" stroke="#2f6a3b" strokeWidth="2" />
      {detectors.map((d) => (
        <line key={d.x} x1={d.x + 105} y1="214" x2={d.x + 105} y2="246" stroke="#2f6a3b" strokeWidth="2" markerEnd="url(#qgArrow)" />
      ))}
      <text x="826" y="198" fill="#5a6258" fontSize="10.5" fontFamily={MONO}>rows</text>

      {/* row 2: detectors */}
      {detectors.map((d) => (
        <Box key={d.x} x={d.x} y={250} w={210} h={124} title={d.title} lines={d.lines} stat={d.stat} />
      ))}

      {/* collect bus into the scorer */}
      {detectors.map((d) => (
        <line key={d.x} x1={d.x + 105} y1="374" x2={d.x + 105} y2="402" stroke="#5a6258" strokeWidth="1.6" strokeDasharray="5 6" />
      ))}
      <polyline
        points="125,402 700,402 700,312 716,312"
        fill="none"
        stroke="#5a6258"
        strokeWidth="1.6"
        strokeDasharray="5 6"
        markerEnd="url(#qgArrowDim)"
      />
      <text x="300" y="424" fill="#5a6258" fontSize="10.5" fontFamily={MONO}>signals: alignment · agreement · sanity flags</text>

      <Box
        x={720}
        y={250}
        w={220}
        h={124}
        featured
        title="Calibrated confidence"
        lines={["Logistic model, fitted with", "grouped cross-validation"]}
        stat="flags 99.0% of wrong SQL"
      />

      <line x1="830" y1="374" x2="830" y2="408" stroke="#2f6a3b" strokeWidth="2" markerEnd="url(#qgArrow)" />
      <rect x="705" y="412" width="250" height="40" rx="20" fill="#efece2" stroke="#dcd8ca" />
      <text x="830" y="436" textAnchor="middle" fill="#285d33" fontSize="10.5" fontFamily={MONO}>
        rows + SQL + verdicts + P(correct)
      </text>
    </svg>
  );
}
