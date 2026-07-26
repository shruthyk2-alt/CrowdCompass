import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Clock, MapPin, Users } from "lucide-react";
import { useActiveVenue } from "@/hooks/use-active-venue";
import { useSimulatedVenueData } from "@/hooks/use-simulated-venue-data";
import { StatusRing } from "@/components/dashboard/StatusRing";
import { ZoneCard } from "@/components/dashboard/ZoneCard";
import { GateAnalytics } from "@/components/dashboard/GateAnalytics";
import { WeatherCard } from "@/components/dashboard/WeatherCard";
import { VenueSpecificPanel } from "@/components/dashboard/VenueSpecificPanel";
import { RISK_BG, RISK_LABEL } from "@/lib/simulate";
import { formatNumber } from "@/lib/format";

export const Route = createFileRoute("/_authenticated/dashboard")({
  component: Dashboard,
  head: () => ({
    meta: [
      { title: "Dashboard · CrowdCompass" },
      { name: "description", content: "Live crowd density, gates, weather and event operations." },
    ],
  }),
});

function useClock() {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);
  return now;
}

function Dashboard() {
  const { venue } = useActiveVenue();
  const data = useSimulatedVenueData(venue);
  const navigate = useNavigate();
  const now = useClock();

  useEffect(() => {
    if (venue === null) {
      // If ActiveVenue has hydrated to no venue, prompt selection.
      const t = setTimeout(() => navigate({ to: "/venues" }), 100);
      return () => clearTimeout(t);
    }
  }, [venue, navigate]);

  if (!venue || !data) {
    return (
      <div className="grid min-h-[60vh] place-items-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-brand-orange border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      {/* Header card */}
      <div className="glass rounded-3xl p-5 sm:p-6">
        <div className="flex flex-wrap items-start justify-between gap-6">
          <div className="min-w-0">
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <MapPin className="h-3.5 w-3.5" /> {venue.location}
            </div>
            <h1 className="mt-1 font-display text-2xl font-bold sm:text-3xl">{venue.name}</h1>
            <p className="mt-1 text-sm text-muted-foreground">{venue.event}</p>
            <div className="mt-3 flex flex-wrap items-center gap-2 text-xs">
              <span className="inline-flex items-center gap-1 rounded-full border border-border bg-card/60 px-2.5 py-1">
                <Clock className="h-3 w-3" />
                {now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" })}
              </span>
              <span className="inline-flex items-center gap-1 rounded-full border border-border bg-card/60 px-2.5 py-1">
                <Users className="h-3 w-3" /> {formatNumber(data.visitors)} / {formatNumber(data.capacity)}
              </span>
              <span className={`rounded-full border px-2.5 py-1 font-medium ${RISK_BG[data.risk]}`}>
                {RISK_LABEL[data.risk]}
              </span>
            </div>
          </div>
          <StatusRing value={data.occupancy} risk={data.risk} />
        </div>
      </div>

      {/* Row 2 */}
      <div className="grid gap-5 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <VenueSpecificPanel s={data.specific} />
        </div>
        <WeatherCard w={data.weather} />
      </div>

      {/* Crowd density */}
      <section>
        <div className="mb-3 flex items-end justify-between">
          <div>
            <h2 className="font-display text-xl font-semibold">Crowd density by zone</h2>
            <p className="text-xs text-muted-foreground">Live · updates every 5s</p>
          </div>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {data.zones.map((z) => (
            <ZoneCard key={z.name} z={z} />
          ))}
        </div>
      </section>

      {/* Gates */}
      <GateAnalytics gates={data.gates} />
    </div>
  );
}
