import type { Risk } from "@/lib/simulate";

const COLOR: Record<Risk, string> = {
  safe: "var(--safe)",
  moderate: "var(--moderate)",
  crowded: "var(--crowded)",
  critical: "var(--critical)",
};

export function StatusRing({ value, risk, size = 120 }: { value: number; risk: Risk; size?: number }) {
  const r = size / 2 - 8;
  const c = 2 * Math.PI * r;
  const offset = c - (value / 100) * c;
  const color = COLOR[risk];
  return (
    <div className="relative grid place-items-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r} strokeWidth={8} stroke="var(--border)" fill="none" />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          strokeWidth={8}
          stroke={color}
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={offset}
          fill="none"
          className="transition-[stroke-dashoffset] duration-700"
        />
      </svg>
      <div className="absolute text-center">
        <div className="font-display text-2xl font-bold">{value}%</div>
        <div className="text-[10px] uppercase tracking-widest text-muted-foreground">Occupied</div>
      </div>
    </div>
  );
}
