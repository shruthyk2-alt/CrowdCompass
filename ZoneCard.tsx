import { ArrowDown, ArrowUp, Minus, Users } from "lucide-react";
import { RISK_BG, RISK_LABEL, type ZoneData } from "@/lib/simulate";
import { formatNumber } from "@/lib/format";

export function ZoneCard({ z }: { z: ZoneData }) {
  const TrendIcon = z.trend === "up" ? ArrowUp : z.trend === "down" ? ArrowDown : Minus;
  return (
    <div className="glass rounded-2xl p-4">
      <div className="flex items-start justify-between">
        <div>
          <div className="text-xs text-muted-foreground">{z.name}</div>
          <div className="mt-0.5 font-display text-xl font-bold">{formatNumber(z.current)}</div>
          <div className="text-[11px] text-muted-foreground">of {formatNumber(z.max)}</div>
        </div>
        <span className={`rounded-full border px-2 py-0.5 text-[10px] font-medium ${RISK_BG[z.risk]}`}>
          {RISK_LABEL[z.risk]}
        </span>
      </div>
      <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-muted">
        <div
          className="h-full rounded-full gradient-brand transition-[width] duration-700"
          style={{ width: `${z.occupancy}%` }}
        />
      </div>
      <div className="mt-2 flex items-center justify-between text-[11px] text-muted-foreground">
        <span className="inline-flex items-center gap-1">
          <Users className="h-3 w-3" /> Queue {z.queue}
        </span>
        <span className="inline-flex items-center gap-1">
          <TrendIcon className="h-3 w-3" /> {z.occupancy}%
        </span>
      </div>
    </div>
  );
}
