import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { MapPin, Users, CalendarDays, CloudSun, ArrowRight } from "lucide-react";
import { VENUES } from "@/lib/venues";
import { useActiveVenue } from "@/hooks/use-active-venue";
import { formatNumber } from "@/lib/format";
import { buildLiveData } from "@/lib/simulate";
import { useAuth } from "@/hooks/use-auth";

export const Route = createFileRoute("/_authenticated/venues")({
  component: VenuesPage,
  head: () => ({
    meta: [
      { title: "Choose a venue · CrowdCompass" },
      { name: "description", content: "Pick the venue you're operating or attending." },
    ],
  }),
});

function VenuesPage() {
  const { user } = useAuth();
  const { setVenue } = useActiveVenue();
  const navigate = useNavigate();

  function pick(id: (typeof VENUES)[number]["id"]) {
    setVenue(id);
    navigate({ to: "/dashboard" });
  }

  return (
    <div className="mx-auto max-w-6xl">
      <div className="mb-8">
        <p className="text-sm text-muted-foreground">Welcome back, {user?.fullName.split(" ")[0]}</p>
        <h1 className="mt-1 font-display text-3xl font-bold sm:text-4xl">
          Choose your <span className="text-gradient-brand">venue</span>
        </h1>
        <p className="mt-2 max-w-lg text-sm text-muted-foreground">
          Selecting a venue configures your dashboard, map and AI assistant for that location.
        </p>
      </div>

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {VENUES.map((v) => {
          const live = buildLiveData(v);
          return (
            <button
              key={v.id}
              onClick={() => pick(v.id)}
              className="glass group overflow-hidden rounded-3xl text-left transition hover:-translate-y-0.5 hover:shadow-2xl hover:shadow-brand-orange/10"
            >
              <div className="relative h-40 w-full overflow-hidden">
                <img
                  src={v.image}
                  alt={v.name}
                  className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
                <span className="absolute right-3 top-3 rounded-full border border-border bg-background/60 px-2 py-0.5 text-[11px] backdrop-blur">
                  {live.occupancy}% full
                </span>
              </div>
              <div className="space-y-3 p-5">
                <div>
                  <h3 className="font-display text-lg font-semibold">{v.name}</h3>
                  <div className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
                    <MapPin className="h-3.5 w-3.5" /> {v.location}
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <Stat icon={Users} label="Capacity" value={formatNumber(v.capacity)} />
                  <Stat icon={CloudSun} label="Weather" value={`${live.weather.temp}°C`} />
                  <Stat icon={CalendarDays} label="Event" value={v.event} span />
                </div>
                <div className="flex items-center justify-between pt-2 text-sm">
                  <span className="text-muted-foreground">{formatNumber(live.visitors)} inside</span>
                  <span className="inline-flex items-center gap-1 font-semibold text-brand-orange">
                    Enter <ArrowRight className="h-4 w-4" />
                  </span>
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function Stat({
  icon: Icon,
  label,
  value,
  span,
}: {
  icon: typeof MapPin;
  label: string;
  value: string;
  span?: boolean;
}) {
  return (
    <div
      className={`rounded-xl border border-border bg-card/50 p-2.5 ${span ? "col-span-2" : ""}`}
    >
      <div className="flex items-center gap-1 text-[10px] uppercase tracking-wide text-muted-foreground">
        <Icon className="h-3 w-3" /> {label}
      </div>
      <div className="mt-0.5 truncate text-sm font-medium">{value}</div>
    </div>
  );
}
