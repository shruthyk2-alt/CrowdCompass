import { createFileRoute, Link } from "@tanstack/react-router";
import { Calendar, Clock, MapPin, Ticket as TicketIcon, Trash2, CheckCircle2 } from "lucide-react";
import { EVENTS } from "@/lib/phase2-data";
import { VENUES } from "@/lib/venues";
import { useTickets } from "@/hooks/use-phase2-store";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/tickets")({
  component: TicketsPage,
  head: () => ({
    meta: [
      { title: "My Tickets · CrowdCompass" },
      { name: "description", content: "Your digital tickets with QR passes for fast, contactless entry." },
      { property: "og:title", content: "My Tickets · CrowdCompass" },
      { property: "og:description", content: "Contactless QR entry for every event you book on CrowdCompass." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
});

function QR({ seed }: { seed: string }) {
  // Deterministic pseudo-QR from seed — 21x21 grid, decorative but stable
  const size = 21;
  const cells: boolean[] = [];
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) >>> 0;
  for (let i = 0; i < size * size; i++) {
    h = (h * 1103515245 + 12345) >>> 0;
    cells.push((h & 1) === 1);
  }
  const corner = (cx: number, cy: number) => {
    for (let y = 0; y < 7; y++) for (let x = 0; x < 7; x++) {
      const edge = x === 0 || y === 0 || x === 6 || y === 6;
      const inner = x >= 2 && x <= 4 && y >= 2 && y <= 4;
      cells[(cy + y) * size + (cx + x)] = edge || inner;
    }
  };
  corner(0, 0); corner(size - 7, 0); corner(0, size - 7);
  return (
    <svg viewBox={`0 0 ${size} ${size}`} className="h-32 w-32 rounded-lg bg-white p-1">
      {cells.map((on, i) => on ? (
        <rect key={i} x={i % size} y={Math.floor(i / size)} width={1} height={1} fill="black" />
      ) : null)}
    </svg>
  );
}

function TicketsPage() {
  const { tickets, remove, markUsed } = useTickets();

  if (tickets.length === 0) {
    return (
      <div className="mx-auto grid min-h-[60vh] max-w-md place-items-center">
        <div className="glass w-full rounded-3xl p-8 text-center">
          <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl gradient-brand text-primary-foreground">
            <TicketIcon className="h-7 w-7" />
          </div>
          <h1 className="mt-5 font-display text-2xl font-bold">No tickets yet</h1>
          <p className="mt-2 text-sm text-muted-foreground">Book a seat and it will appear here as a QR pass.</p>
          <Link to="/events" className="mt-6 inline-flex rounded-xl gradient-brand px-5 py-2.5 text-sm font-semibold text-primary-foreground">
            Browse events
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl space-y-4">
      <header>
        <h1 className="font-display text-2xl font-bold">My Tickets</h1>
        <p className="text-sm text-muted-foreground">Show the QR at gate for contactless entry.</p>
      </header>

      <div className="grid gap-4 md:grid-cols-2">
        {tickets.map((t) => {
          const evt = EVENTS.find((e) => e.id === t.eventId);
          const v = evt ? VENUES.find((x) => x.id === evt.venueId) : null;
          return (
            <article
              key={t.id}
              className="glass overflow-hidden rounded-3xl"
            >
              <div className="grid grid-cols-[1fr_auto] items-stretch">
                <div className="space-y-2 p-4">
                  <div className="flex items-center justify-between">
                    <span className={`rounded-full border px-2 py-0.5 text-[11px] ${
                      t.status === "valid" ? "border-safe/30 bg-safe/15 text-safe" : "border-border bg-muted text-muted-foreground line-through"
                    }`}>
                      {t.status === "valid" ? "Valid" : "Used"}
                    </span>
                    <span className="text-[11px] text-muted-foreground">{t.id.slice(0, 12)}</span>
                  </div>
                  <h3 className="font-display text-base font-semibold leading-tight">{evt?.title ?? "Event"}</h3>
                  <div className="space-y-1 text-xs text-muted-foreground">
                    {v && <div className="inline-flex items-center gap-1"><MapPin className="h-3 w-3" />{v.name}</div>}
                    {evt && (
                      <div className="flex gap-3">
                        <span className="inline-flex items-center gap-1"><Calendar className="h-3 w-3" />{evt.date}</span>
                        <span className="inline-flex items-center gap-1"><Clock className="h-3 w-3" />{evt.time}</span>
                      </div>
                    )}
                  </div>
                  <div className="pt-1 text-sm">
                    <span className="text-muted-foreground">Seat: </span>
                    <span className="font-mono font-semibold">{t.seat}</span>
                  </div>
                  <div className="flex gap-2 pt-2">
                    {t.status === "valid" && (
                      <button
                        onClick={() => { markUsed(t.id); toast.success("Ticket checked in"); }}
                        className="inline-flex items-center gap-1.5 rounded-lg border border-safe/40 bg-safe/10 px-2.5 py-1 text-xs text-safe hover:bg-safe/20"
                      >
                        <CheckCircle2 className="h-3.5 w-3.5" /> Check in
                      </button>
                    )}
                    <button
                      onClick={() => { remove(t.id); toast("Ticket removed"); }}
                      className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-card/60 px-2.5 py-1 text-xs text-muted-foreground hover:bg-accent"
                    >
                      <Trash2 className="h-3.5 w-3.5" /> Remove
                    </button>
                  </div>
                </div>
                <div className="flex flex-col items-center justify-center border-l border-dashed border-border bg-card/40 p-4">
                  <QR seed={t.qr} />
                  <div className="mt-2 font-mono text-[10px] text-muted-foreground">{t.qr.slice(0, 14)}</div>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}
