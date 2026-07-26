import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Calendar, Clock, Ticket as TicketIcon, Search, IndianRupee } from "lucide-react";
import { EVENTS } from "@/lib/phase2-data";
import { VENUES } from "@/lib/venues";
import { useTickets } from "@/hooks/use-phase2-store";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/events")({
  component: EventsPage,
  head: () => ({
    meta: [
      { title: "Events · CrowdCompass" },
      { name: "description", content: "Discover upcoming events across venues and book seats in seconds." },
      { property: "og:title", content: "Events · CrowdCompass" },
      { property: "og:description", content: "Sports, music and tech events with live seat availability." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
});

const CATEGORIES = ["All", "Sports", "Music", "Tech", "Culture"] as const;

function EventsPage() {
  const [q, setQ] = useState("");
  const [cat, setCat] = useState<(typeof CATEGORIES)[number]>("All");
  const [booking, setBooking] = useState<string | null>(null);
  const { book } = useTickets();

  const filtered = useMemo(() => {
    return EVENTS.filter(
      (e) => (cat === "All" || e.category === cat) && e.title.toLowerCase().includes(q.toLowerCase()),
    );
  }, [q, cat]);

  const featured = EVENTS.filter((e) => e.featured);

  function handleBook(eventId: string) {
    const evt = EVENTS.find((e) => e.id === eventId);
    if (!evt) return;
    setBooking(eventId);
    setTimeout(() => {
      const tickets = book(evt, 1);
      setBooking(null);
      toast.success("Ticket booked", {
        description: `${evt.title} · Seat ${tickets[0].seat}`,
      });
    }, 700);
  }

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <header>
        <h1 className="font-display text-2xl font-bold">Events</h1>
        <p className="text-sm text-muted-foreground">Curated for the venues you follow.</p>
      </header>

      {featured.length > 0 && (
        <section className="grid gap-4 md:grid-cols-3">
          {featured.map((e) => {
            const v = VENUES.find((x) => x.id === e.venueId);
            return (
              <article key={e.id} className="glass group relative overflow-hidden rounded-3xl">
                <div className="aspect-[16/10] overflow-hidden">
                  <img
                    src={e.image}
                    alt={e.title}
                    loading="lazy"
                    className="h-full w-full object-cover transition group-hover:scale-105"
                  />
                </div>
                <div className="absolute left-3 top-3 rounded-full gradient-brand px-2.5 py-1 text-[11px] font-semibold text-primary-foreground">
                  Featured
                </div>
                <div className="space-y-2 p-4">
                  <div className="text-xs text-muted-foreground">{v?.name}</div>
                  <h3 className="font-display text-lg font-semibold leading-tight">{e.title}</h3>
                  <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                    <span className="inline-flex items-center gap-1"><Calendar className="h-3 w-3" />{e.date}</span>
                    <span className="inline-flex items-center gap-1"><Clock className="h-3 w-3" />{e.time}</span>
                    <span className="inline-flex items-center gap-1">{e.price === 0 ? "Free" : <><IndianRupee className="h-3 w-3" />{e.price}</>}</span>
                  </div>
                  <button
                    onClick={() => handleBook(e.id)}
                    disabled={booking === e.id}
                    className="w-full rounded-xl gradient-brand py-2 text-sm font-semibold text-primary-foreground disabled:opacity-60"
                  >
                    {booking === e.id ? "Booking…" : "Book seat"}
                  </button>
                </div>
              </article>
            );
          })}
        </section>
      )}

      <div className="glass flex flex-wrap items-center gap-2 rounded-2xl p-3">
        <div className="flex flex-1 items-center gap-2 rounded-xl bg-input px-3 py-2">
          <Search className="h-4 w-4 text-muted-foreground" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search events"
            className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
          />
        </div>
        <div className="flex flex-wrap gap-1.5">
          {CATEGORIES.map((c) => (
            <button
              key={c}
              onClick={() => setCat(c)}
              className={`rounded-full border px-3 py-1 text-xs ${
                cat === c ? "border-transparent gradient-brand text-primary-foreground" : "border-border bg-card/50 text-muted-foreground hover:text-foreground"
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((e) => {
          const v = VENUES.find((x) => x.id === e.venueId);
          const soldPct = 100 - Math.round((e.seatsLeft / e.totalSeats) * 100);
          return (
            <article key={e.id} className="glass overflow-hidden rounded-3xl">
              <div className="aspect-video overflow-hidden">
                <img src={e.image} alt={e.title} loading="lazy" className="h-full w-full object-cover" />
              </div>
              <div className="space-y-2 p-4">
                <div className="flex items-center justify-between text-xs">
                  <span className="rounded-full bg-muted px-2 py-0.5 text-muted-foreground">{e.category}</span>
                  <span className="text-muted-foreground">{v?.name}</span>
                </div>
                <h3 className="font-display text-base font-semibold leading-snug">{e.title}</h3>
                <div className="flex items-center gap-3 text-xs text-muted-foreground">
                  <span className="inline-flex items-center gap-1"><Calendar className="h-3 w-3" />{e.date}</span>
                  <span className="inline-flex items-center gap-1"><Clock className="h-3 w-3" />{e.time}</span>
                </div>
                <div>
                  <div className="mb-1 flex items-center justify-between text-[11px] text-muted-foreground">
                    <span>{e.seatsLeft.toLocaleString()} seats left</span>
                    <span>{soldPct}% sold</span>
                  </div>
                  <div className="h-1 overflow-hidden rounded-full bg-muted">
                    <div className="h-full gradient-brand" style={{ width: `${soldPct}%` }} />
                  </div>
                </div>
                <div className="flex items-center justify-between pt-1">
                  <div className="text-sm font-semibold">
                    {e.price === 0 ? "Free" : <span className="inline-flex items-center"><IndianRupee className="h-3.5 w-3.5" />{e.price}</span>}
                  </div>
                  <button
                    onClick={() => handleBook(e.id)}
                    disabled={booking === e.id}
                    className="inline-flex items-center gap-1.5 rounded-xl gradient-brand px-3 py-1.5 text-xs font-semibold text-primary-foreground disabled:opacity-60"
                  >
                    <TicketIcon className="h-3.5 w-3.5" />
                    {booking === e.id ? "Booking…" : "Book"}
                  </button>
                </div>
              </div>
            </article>
          );
        })}
      </section>

      <div className="pt-2 text-center text-sm text-muted-foreground">
        Booked something? See it in <Link to="/tickets" className="text-brand-orange underline-offset-2 hover:underline">My Tickets</Link>.
      </div>
    </div>
  );
}
