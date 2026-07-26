import { useMemo, useRef, useState, useEffect } from "react";
import { Send, Sparkles, X } from "lucide-react";
import { useActiveVenue } from "@/hooks/use-active-venue";
import { useSimulatedVenueData } from "@/hooks/use-simulated-venue-data";
import type { LiveVenueData } from "@/lib/simulate";
import type { Venue } from "@/lib/venues";

type Msg = { role: "user" | "ai"; text: string };

const SUGGESTIONS = [
  "Where is the nearest washroom?",
  "Which gate is least crowded?",
  "Where should I park?",
  "How do I reach Gate 3?",
  "Show emergency exits",
  "Where is the medical booth?",
  "What is today's weather?",
  "Which food court has the shortest queue?",
];

function answer(q: string, venue: Venue | null, data: LiveVenueData | null): string {
  if (!venue || !data) return "Select a venue first, then I can help with directions and crowd info.";
  const s = q.toLowerCase();
  if (/washroom|toilet|restroom/.test(s))
    return `Nearest washroom is 60m from your location, past the ${data.zones[5].name}. Approx. 2 min walk.`;
  if (/least.*crowd|best gate|which gate|shortest gate/.test(s)) {
    const best = [...data.gates].filter((g) => g.open).sort((a, b) => a.queue - b.queue)[0];
    return `${best.name} has the shortest queue right now — ${best.queue} people, about ${best.waitMin} min wait.`;
  }
  if (/park/.test(s)) {
    const p = data.zones.find((z) => z.name === "Parking")!;
    return `Parking is at ${p.occupancy}% capacity. ${p.occupancy < 80 ? "Head to the West lot — spaces available." : "Main lot is nearly full — try the overflow lot near West Gate."}`;
  }
  if (/gate\s*3|reach gate|directions/.test(s))
    return `Head to East Gate (~180m). Follow the orange wayfinding markers. Estimated 3 min walk.`;
  if (/emergency|exit/.test(s)) return `Nearest emergency exit: ${venue.nearestExit}. Follow green signage.`;
  if (/medic|first aid|hospital/.test(s)) return `Nearest medical: ${venue.nearestMedical}.`;
  if (/weather|rain|temperature/.test(s))
    return `${data.weather.condition}, ${data.weather.temp}°C (feels ${data.weather.feels}°). ${data.weather.rainChance}% rain chance. AQI ${data.weather.aqi}.`;
  if (/food|queue|eat|hungry/.test(s)) {
    const f = data.zones.find((z) => z.name === "Food Court")!;
    return `Food Court is at ${f.occupancy}%, queue ~${f.queue}. Try the north counters — usually faster during peak.`;
  }
  return `I can help with gates, parking, food courts, medical, exits, weather and directions in ${venue.name}. Try a suggestion below.`;
}

export function FloatingAI() {
  const { venue } = useActiveVenue();
  const data = useSimulatedVenueData(venue);
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Msg[]>([
    { role: "ai", text: "Hi! I'm your CrowdCompass assistant. Ask about gates, parking, food or safety." },
  ]);
  const [input, setInput] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, open]);

  function ask(q: string) {
    if (!q.trim()) return;
    setMessages((m) => [...m, { role: "user", text: q }, { role: "ai", text: answer(q, venue, data) }]);
    setInput("");
  }

  const suggestions = useMemo(() => SUGGESTIONS.slice(0, 4), []);

  return (
    <>
      <button
        onClick={() => setOpen((o) => !o)}
        aria-label="AI Assistant"
        className="fixed bottom-24 right-5 z-40 grid h-14 w-14 place-items-center rounded-full gradient-brand text-primary-foreground shadow-xl shadow-brand-orange/40 transition hover:scale-105"
      >
        {open ? <X className="h-6 w-6" /> : <Sparkles className="h-6 w-6" />}
      </button>

      {open && (
        <div className="glass fixed bottom-44 right-5 z-40 flex h-[26rem] w-[22rem] max-w-[calc(100vw-2.5rem)] flex-col rounded-3xl">
          <div className="flex items-center gap-2 border-b border-border p-4">
            <div className="grid h-8 w-8 place-items-center rounded-lg gradient-brand text-primary-foreground">
              <Sparkles className="h-4 w-4" />
            </div>
            <div>
              <div className="text-sm font-semibold">CrowdCompass AI</div>
              <div className="text-xs text-muted-foreground">
                {venue ? venue.name : "No venue selected"}
              </div>
            </div>
          </div>
          <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto p-4 text-sm">
            {messages.map((m, i) => (
              <div
                key={i}
                className={`max-w-[85%] rounded-2xl px-3 py-2 ${
                  m.role === "user"
                    ? "ml-auto gradient-brand text-primary-foreground"
                    : "bg-card/70 text-foreground"
                }`}
              >
                {m.text}
              </div>
            ))}
          </div>
          <div className="flex flex-wrap gap-1.5 border-t border-border p-3">
            {suggestions.map((s) => (
              <button
                key={s}
                onClick={() => ask(s)}
                className="rounded-full border border-border bg-card/60 px-2.5 py-1 text-[11px] hover:bg-accent"
              >
                {s}
              </button>
            ))}
          </div>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              ask(input);
            }}
            className="flex items-center gap-2 border-t border-border p-3"
          >
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about gates, food, exits…"
              className="flex-1 rounded-xl bg-input px-3 py-2 text-sm outline-none placeholder:text-muted-foreground focus:ring-2 focus:ring-ring"
            />
            <button
              type="submit"
              className="grid h-9 w-9 place-items-center rounded-xl gradient-brand text-primary-foreground"
              aria-label="Send"
            >
              <Send className="h-4 w-4" />
            </button>
          </form>
        </div>
      )}
    </>
  );
}
