import { createFileRoute } from "@tanstack/react-router";
import { BarChart3, TrendingUp, Users, Timer } from "lucide-react";
import { useActiveVenue } from "@/hooks/use-active-venue";
import { useSimulatedVenueData } from "@/hooks/use-simulated-venue-data";

export const Route = createFileRoute("/_authenticated/analytics")({
  component: AnalyticsPage,
  head: () => ({
    meta: [
      { title: "Analytics · CrowdCompass" },
      { name: "description", content: "Historical trends for footfall, gate throughput and zone dwell times." },
      { property: "og:title", content: "Analytics · CrowdCompass" },
      { property: "og:description", content: "Data-driven insights on how your venues perform under load." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
});

function seriesFor(seed: number, len = 12) {
  return Array.from({ length: len }).map((_, i) => {
    const x = Math.sin(seed + i * 1.7) * 0.5 + 0.5;
    return Math.round(30 + x * 65);
  });
}

function AnalyticsPage() {
  const { venue } = useActiveVenue();
  const data = useSimulatedVenueData(venue);
  const footfall = seriesFor(venue ? venue.id.length * 7 : 3);
  const throughput = seriesFor(venue ? venue.id.length * 11 : 5);

  const kpis = [
    { label: "Peak footfall", value: data ? `${Math.round(data.visitors * 1.12).toLocaleString()}` : "—", icon: Users, change: "+8.4%" },
    { label: "Avg wait", value: data ? `${Math.round(data.gates.reduce((s, g) => s + g.waitMin, 0) / data.gates.length)} min` : "—", icon: Timer, change: "-2.1%" },
    { label: "Throughput", value: data ? `${data.gates.reduce((s, g) => s + g.entrySpeed, 0)}/min` : "—", icon: TrendingUp, change: "+3.6%" },
    { label: "Utilization", value: data ? `${data.occupancy}%` : "—", icon: BarChart3, change: "+1.2%" },
  ];

  return (
    <div className="mx-auto max-w-6xl space-y-5">
      <header>
        <h1 className="font-display text-2xl font-bold">Analytics</h1>
        <p className="text-sm text-muted-foreground">
          {venue ? `${venue.name} · last 12 hours` : "Select a venue to view historical trends"}
        </p>
      </header>

      <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {kpis.map((k) => (
          <div key={k.label} className="glass rounded-2xl p-4">
            <div className="flex items-center justify-between">
              <div className="grid h-9 w-9 place-items-center rounded-xl gradient-brand text-primary-foreground">
                <k.icon className="h-4 w-4" />
              </div>
              <span className="text-xs text-safe">{k.change}</span>
            </div>
            <div className="mt-3 font-display text-2xl font-bold">{k.value}</div>
            <div className="text-xs text-muted-foreground">{k.label}</div>
          </div>
        ))}
      </section>

      <section className="grid gap-4 lg:grid-cols-2">
        <ChartCard title="Footfall — hourly" data={footfall} suffix="k" />
        <ChartCard title="Gate throughput — per min" data={throughput} suffix="/m" />
      </section>

      {data && (
        <section className="glass rounded-2xl p-5">
          <h2 className="mb-3 font-display text-lg font-semibold">Zone dwell heatmap</h2>
          <div className="grid grid-cols-4 gap-2 sm:grid-cols-8">
            {data.zones.map((z) => (
              <div key={z.name} className="rounded-xl border border-border p-2 text-center text-xs">
                <div
                  className="mx-auto mb-1 h-10 w-10 rounded-lg"
                  style={{
                    background: `linear-gradient(180deg, hsl(28 96% 55% / ${Math.min(1, z.occupancy / 100)}), hsl(35 92% 50% / ${Math.min(1, z.occupancy / 100)}))`,
                  }}
                />
                <div className="truncate font-medium">{z.name}</div>
                <div className="text-muted-foreground">{z.occupancy}%</div>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

function ChartCard({ title, data, suffix }: { title: string; data: number[]; suffix?: string }) {
  const max = Math.max(...data);
  const min = Math.min(...data);
  const path = data
    .map((v, i) => {
      const x = (i / (data.length - 1)) * 100;
      const y = 100 - ((v - min) / Math.max(1, max - min)) * 90 - 5;
      return `${i === 0 ? "M" : "L"}${x},${y}`;
    })
    .join(" ");
  const area = `${path} L100,100 L0,100 Z`;
  return (
    <div className="glass rounded-2xl p-5">
      <div className="mb-3 flex items-end justify-between">
        <h3 className="font-display text-base font-semibold">{title}</h3>
        <span className="text-xs text-muted-foreground">peak {max}{suffix}</span>
      </div>
      <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="h-40 w-full">
        <defs>
          <linearGradient id={`g-${title}`} x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="hsl(28 96% 55%)" stopOpacity="0.5" />
            <stop offset="100%" stopColor="hsl(28 96% 55%)" stopOpacity="0" />
          </linearGradient>
        </defs>
        <path d={area} fill={`url(#g-${title})`} />
        <path d={path} fill="none" stroke="hsl(28 96% 60%)" strokeWidth="1.4" vectorEffect="non-scaling-stroke" />
      </svg>
      <div className="mt-1 flex justify-between text-[10px] text-muted-foreground">
        {data.map((_, i) => (i % 2 === 0 ? <span key={i}>{`${i}h`}</span> : <span key={i} />))}
      </div>
    </div>
  );
}
