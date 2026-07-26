import type { GateData } from "@/lib/simulate";

export function GateAnalytics({ gates }: { gates: GateData[] }) {
  return (
    <div className="glass overflow-hidden rounded-2xl">
      <div className="border-b border-border p-4">
        <h3 className="font-display text-lg font-semibold">Gate analytics</h3>
        <p className="text-xs text-muted-foreground">Live entry/exit throughput and queues</p>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-muted/30 text-xs uppercase tracking-wide text-muted-foreground">
            <tr>
              <th className="p-3 text-left">Gate</th>
              <th className="p-3 text-left">Status</th>
              <th className="p-3 text-right">Queue</th>
              <th className="p-3 text-right">Wait</th>
              <th className="p-3 text-right">Entry / min</th>
              <th className="p-3 text-right">Exit / min</th>
            </tr>
          </thead>
          <tbody>
            {gates.map((g) => (
              <tr key={g.name} className="border-t border-border">
                <td className="p-3 font-medium">{g.name}</td>
                <td className="p-3">
                  <span
                    className={`rounded-full border px-2 py-0.5 text-[10px] font-medium ${
                      g.open
                        ? "border-safe/40 bg-safe/15 text-safe"
                        : "border-critical/40 bg-critical/15 text-critical"
                    }`}
                  >
                    {g.open ? "Open" : "Closed"}
                  </span>
                </td>
                <td className="p-3 text-right">{g.queue}</td>
                <td className="p-3 text-right">{g.waitMin} min</td>
                <td className="p-3 text-right">{g.entrySpeed}</td>
                <td className="p-3 text-right">{g.exitSpeed}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
