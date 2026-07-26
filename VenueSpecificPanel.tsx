import { Music, Trophy, GraduationCap } from "lucide-react";
import type { VenueSpecific } from "@/lib/simulate";

export function VenueSpecificPanel({ s }: { s: VenueSpecific }) {
  if (s.kind === "cricket") {
    return (
      <div className="glass rounded-2xl p-5">
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Trophy className="h-3.5 w-3.5 text-brand-orange" /> Live match
        </div>
        <div className="mt-2 flex items-baseline gap-3">
          <span className="font-display text-3xl font-bold">{s.score}</span>
          <span className="text-sm text-muted-foreground">({s.overs} ov)</span>
        </div>
        <div className="mt-1 text-sm">{s.status}</div>
        <div className="mt-3 grid grid-cols-3 gap-2 text-center text-xs">
          <Chip label="Wickets" value={s.wickets.toString()} />
          <Chip label="Overs" value={s.overs} />
          <Chip label="Runs" value={s.score.split("/")[0]} />
        </div>
      </div>
    );
  }
  if (s.kind === "festival") {
    return (
      <div className="glass rounded-2xl p-5">
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Music className="h-3.5 w-3.5 text-brand-orange" /> Now playing
        </div>
        <div className="mt-2 font-display text-2xl font-bold text-gradient-brand">{s.currentArtist}</div>
        <div className="mt-1 text-sm text-muted-foreground">
          Next: {s.nextArtist} at {s.nextAt}
        </div>
        <div className="mt-4 space-y-1.5">
          {s.schedule.map((row) => (
            <div key={row.time} className="flex items-center justify-between rounded-lg border border-border bg-card/40 px-3 py-1.5 text-sm">
              <span className="text-muted-foreground">{row.time}</span>
              <span className="font-medium">{row.artist}</span>
            </div>
          ))}
        </div>
      </div>
    );
  }
  return (
    <div className="glass rounded-2xl p-5">
      <div className="flex items-center gap-2 text-xs text-muted-foreground">
        <GraduationCap className="h-3.5 w-3.5 text-brand-orange" /> Today at Tech Fest
      </div>
      <ul className="mt-2 grid gap-1 text-sm">
        {s.todaysEvents.map((e) => (
          <li key={e} className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full gradient-brand" />
            {e}
          </li>
        ))}
      </ul>
      <div className="mt-4 grid grid-cols-2 gap-2 text-xs">
        <Chip label="Seminar Hall" value={`${s.seminarOccupancy}%`} />
        <Chip label="Hackathon" value={s.hackathonCrowd.toString()} />
        <Chip label="Registration Q" value={s.regQueue.toString()} />
        <Chip label="Cafeteria" value={`${s.cafeteria}%`} />
      </div>
      <div className="mt-4">
        <div className="mb-2 text-xs uppercase tracking-wide text-muted-foreground">Workshops</div>
        <div className="space-y-1.5">
          {s.workshops.map((w) => (
            <div key={w.time} className="flex items-center justify-between rounded-lg border border-border bg-card/40 px-3 py-1.5 text-sm">
              <span className="text-muted-foreground">{w.time}</span>
              <span className="font-medium">{w.title}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function Chip({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-border bg-card/40 p-2 text-center">
      <div className="text-[10px] uppercase tracking-wide text-muted-foreground">{label}</div>
      <div className="mt-0.5 font-semibold">{value}</div>
    </div>
  );
}
