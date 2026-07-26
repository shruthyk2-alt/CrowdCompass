import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { MapPin, Compass, Utensils, ShieldPlus, Car, DoorOpen, Music, Trophy } from "lucide-react";
import { useActiveVenue } from "@/hooks/use-active-venue";
import { useSimulatedVenueData } from "@/hooks/use-simulated-venue-data";
import { RISK_BG } from "@/lib/simulate";

export const Route = createFileRoute("/_authenticated/map")({
  component: VenueMap,
  head: () => ({
    meta: [
      { title: "Venue Map · CrowdCompass" },
      { name: "description", content: "Interactive venue map with live crowd density, gates, medical and exits." },
      { property: "og:title", content: "Venue Map · CrowdCompass" },
      { property: "og:description", content: "See gates, zones and exits with live density overlays." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
});

type Point = { name: string; x: number; y: number; kind: "gate" | "stage" | "food" | "medical" | "exit" | "parking" | "vip" };

const POINTS: Point[] = [
  { name: "North Gate", x: 50, y: 12, kind: "gate" },
  { name: "South Gate", x: 50, y: 88, kind: "gate" },
  { name: "East Gate", x: 88, y: 50, kind: "gate" },
  { name: "West Gate", x: 12, y: 50, kind: "gate" },
  { name: "Main Stage", x: 50, y: 42, kind: "stage" },
  { name: "Food Court", x: 30, y: 65, kind: "food" },
  { name: "Medical", x: 70, y: 30, kind: "medical" },
  { name: "Emergency Exit", x: 72, y: 72, kind: "exit" },
  { name: "Parking", x: 20, y: 30, kind: "parking" },
  { name: "VIP Area", x: 65, y: 55, kind: "vip" },
];

function VenueMap() {
  const { venue } = useActiveVenue();
  const data = useSimulatedVenueData(venue);
  const [active, setActive] = useState<string | null>(null);

  const zonePctByName = useMemo(() => {
    const m = new Map<string, number>();
    data?.zones.forEach((z) => m.set(z.name, z.occupancy));
    return m;
  }, [data]);

  if (!venue || !data) {
    return (
      <div className="glass mx-auto max-w-lg rounded-3xl p-8 text-center">
        <MapPin className="mx-auto h-8 w-8 text-brand-orange" />
        <h1 className="mt-3 font-display text-xl font-semibold">Select a venue first</h1>
        <p className="mt-1 text-sm text-muted-foreground">Head to Venues to activate a location.</p>
      </div>
    );
  }

  const iconFor = (k: Point["kind"]) => {
    switch (k) {
      case "gate": return DoorOpen;
      case "stage": return venue.id === "chinnaswamy" ? Trophy : Music;
      case "food": return Utensils;
      case "medical": return ShieldPlus;
      case "exit": return DoorOpen;
      case "parking": return Car;
      case "vip": return Compass;
    }
  };

  const densityFor = (name: string): "safe" | "moderate" | "crowded" | "critical" => {
    const p = zonePctByName.get(name) ?? 40;
    if (p < 45) return "safe";
    if (p < 70) return "moderate";
    if (p < 88) return "crowded";
    return "critical";
  };

  const activePoint = POINTS.find((p) => p.name === active) ?? null;

  return (
    <div className="mx-auto max-w-6xl space-y-4">
      <header className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-bold">Venue Map</h1>
          <p className="text-sm text-muted-foreground">
            {venue.name} · Live density overlay refreshes every 5s
          </p>
        </div>
        <div className="flex flex-wrap gap-2 text-xs">
          {(["safe", "moderate", "crowded", "critical"] as const).map((r) => (
            <span key={r} className={`rounded-full border px-2.5 py-1 capitalize ${RISK_BG[r]}`}>
              {r}
            </span>
          ))}
        </div>
      </header>

      <div className="grid gap-4 lg:grid-cols-[1fr_20rem]">
        <div className="glass relative overflow-hidden rounded-3xl p-3">
          <svg viewBox="0 0 100 100" className="h-[28rem] w-full sm:h-[32rem]">
            <defs>
              <radialGradient id="ground" cx="50%" cy="50%" r="60%">
                <stop offset="0%" stopColor="hsl(28 96% 55% / 0.15)" />
                <stop offset="100%" stopColor="transparent" />
              </radialGradient>
              <pattern id="grid" width="5" height="5" patternUnits="userSpaceOnUse">
                <path d="M 5 0 L 0 0 0 5" fill="none" stroke="hsl(220 25% 22% / 0.5)" strokeWidth="0.15" />
              </pattern>
            </defs>
            <rect width="100" height="100" fill="url(#grid)" />
            <circle cx="50" cy="50" r="42" fill="url(#ground)" />
            <ellipse cx="50" cy="50" rx="30" ry="22" fill="hsl(220 30% 12%)" stroke="hsl(28 96% 55% / 0.35)" strokeWidth="0.4" strokeDasharray="1 1" />
            <text x="50" y="52" textAnchor="middle" fontSize="3" fill="hsl(28 96% 65%)" opacity="0.7">
              {venue.id === "chinnaswamy" ? "PITCH" : venue.id === "sunburn" ? "ARENA" : "QUADRANGLE"}
            </text>

            {POINTS.map((p) => {
              const risk = p.kind === "gate" || p.kind === "stage" || p.kind === "food" || p.kind === "parking" || p.kind === "vip"
                ? densityFor(p.name === "Medical" || p.name === "Emergency Exit" ? "Main Stage" : p.name)
                : "safe";
              const color =
                risk === "critical" ? "hsl(0 84% 60%)" :
                risk === "crowded" ? "hsl(15 90% 58%)" :
                risk === "moderate" ? "hsl(38 92% 55%)" :
                "hsl(150 65% 45%)";
              const isActive = active === p.name;
              return (
                <g key={p.name} onClick={() => setActive(p.name)} className="cursor-pointer">
                  <circle cx={p.x} cy={p.y} r={isActive ? 4.2 : 3} fill={color} opacity="0.25">
                    <animate attributeName="r" values={`${isActive ? 4.2 : 3};${isActive ? 6 : 4.8};${isActive ? 4.2 : 3}`} dur="2.4s" repeatCount="indefinite" />
                  </circle>
                  <circle cx={p.x} cy={p.y} r={isActive ? 2.2 : 1.6} fill={color} stroke="white" strokeWidth="0.25" />
                  <text x={p.x} y={p.y - 3.6} textAnchor="middle" fontSize="2.2" fill="hsl(210 20% 92%)" opacity={isActive ? 1 : 0.75}>
                    {p.name}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>

        <aside className="glass space-y-3 rounded-3xl p-4">
          <div className="text-xs uppercase tracking-wider text-muted-foreground">Location detail</div>
          {activePoint ? (
            (() => {
              const Icon = iconFor(activePoint.kind);
              const pct = zonePctByName.get(activePoint.name);
              const risk = densityFor(activePoint.name);
              return (
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <div className="grid h-9 w-9 place-items-center rounded-xl gradient-brand text-primary-foreground">
                      <Icon className="h-4 w-4" />
                    </div>
                    <div>
                      <div className="font-semibold">{activePoint.name}</div>
                      <div className="text-xs capitalize text-muted-foreground">{activePoint.kind}</div>
                    </div>
                  </div>
                  {pct !== undefined && (
                    <div>
                      <div className="mb-1 flex items-center justify-between text-xs text-muted-foreground">
                        <span>Occupancy</span>
                        <span className="font-medium text-foreground">{pct}%</span>
                      </div>
                      <div className="h-1.5 overflow-hidden rounded-full bg-muted">
                        <div
                          className="h-full gradient-brand"
                          style={{ width: `${Math.min(100, pct)}%` }}
                        />
                      </div>
                    </div>
                  )}
                  <span className={`inline-flex rounded-full border px-2.5 py-1 text-xs capitalize ${RISK_BG[risk]}`}>
                    {risk}
                  </span>
                  <div className="rounded-2xl border border-border bg-card/40 p-3 text-xs text-muted-foreground">
                    Recommended route: follow the wayfinding markers from the closest open gate. Avoid West Gate during peak.
                  </div>
                </div>
              );
            })()
          ) : (
            <p className="text-sm text-muted-foreground">Tap any pin to see live density, wait times and directions.</p>
          )}

          <div className="pt-3 text-xs uppercase tracking-wider text-muted-foreground">Gates</div>
          <ul className="space-y-1.5 text-sm">
            {data.gates.map((g) => (
              <li key={g.name} className="flex items-center justify-between rounded-lg bg-card/40 px-2.5 py-1.5">
                <span className={g.open ? "" : "text-muted-foreground line-through"}>{g.name}</span>
                <span className="text-xs text-muted-foreground">{g.queue} · {g.waitMin}m</span>
              </li>
            ))}
          </ul>
        </aside>
      </div>
    </div>
  );
}
