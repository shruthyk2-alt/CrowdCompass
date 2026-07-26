import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { UserSearch, CheckCircle2, Trash2, Phone, MapPin, Clock } from "lucide-react";
import { useMissing } from "@/hooks/use-phase2-store";
import { useActiveVenue } from "@/hooks/use-active-venue";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/missing")({
  component: MissingPage,
  head: () => ({
    meta: [
      { title: "Missing Person · CrowdCompass" },
      { name: "description", content: "File a missing person report and coordinate with venue security in real time." },
      { property: "og:title", content: "Missing Person · CrowdCompass" },
      { property: "og:description", content: "Fast, secure missing person reporting inside CrowdCompass venues." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
});

const ZONES = ["North Gate", "South Gate", "East Gate", "West Gate", "Main Stage", "Food Court", "Parking", "VIP Area"];

function MissingPage() {
  const { venue } = useActiveVenue();
  const { reports, submit, markFound, remove } = useMissing();
  const [form, setForm] = useState({
    name: "",
    age: "",
    gender: "Male" as "Male" | "Female" | "Other",
    lastSeenZone: ZONES[0],
    lastSeenAt: "",
    wearing: "",
    contact: "",
  });

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name || !form.age || !form.contact) {
      toast.error("Fill in name, age and contact number");
      return;
    }
    submit({
      name: form.name,
      age: Number(form.age),
      gender: form.gender,
      lastSeenZone: form.lastSeenZone,
      lastSeenAt: form.lastSeenAt || new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      wearing: form.wearing,
      contact: form.contact,
    });
    toast.success("Report filed", { description: "Security & AI dispatched to zones." });
    setForm({ ...form, name: "", age: "", wearing: "", contact: "", lastSeenAt: "" });
  }

  const searching = reports.filter((r) => r.status === "searching");

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <header>
        <h1 className="font-display text-2xl font-bold">Missing Person</h1>
        <p className="text-sm text-muted-foreground">
          {venue ? `Reporting at ${venue.name}` : "Select a venue for zone context"} · Reports stay on this device.
        </p>
      </header>

      <div className="grid gap-4 lg:grid-cols-[22rem_1fr]">
        <form onSubmit={handleSubmit} className="glass space-y-3 rounded-3xl p-5">
          <div className="flex items-center gap-2">
            <div className="grid h-9 w-9 place-items-center rounded-xl gradient-brand text-primary-foreground">
              <UserSearch className="h-4 w-4" />
            </div>
            <div>
              <div className="font-semibold">File a report</div>
              <div className="text-xs text-muted-foreground">Details help responders act faster.</div>
            </div>
          </div>

          <Field label="Full name">
            <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="input" />
          </Field>
          <div className="grid grid-cols-2 gap-2">
            <Field label="Age">
              <input value={form.age} onChange={(e) => setForm({ ...form, age: e.target.value })} inputMode="numeric" className="input" />
            </Field>
            <Field label="Gender">
              <select value={form.gender} onChange={(e) => setForm({ ...form, gender: e.target.value as typeof form.gender })} className="input">
                <option>Male</option><option>Female</option><option>Other</option>
              </select>
            </Field>
          </div>
          <Field label="Last seen zone">
            <select value={form.lastSeenZone} onChange={(e) => setForm({ ...form, lastSeenZone: e.target.value })} className="input">
              {ZONES.map((z) => <option key={z}>{z}</option>)}
            </select>
          </Field>
          <Field label="Last seen time (optional)">
            <input value={form.lastSeenAt} onChange={(e) => setForm({ ...form, lastSeenAt: e.target.value })} placeholder="e.g. 20:45" className="input" />
          </Field>
          <Field label="Wearing / description">
            <input value={form.wearing} onChange={(e) => setForm({ ...form, wearing: e.target.value })} placeholder="Blue jacket, black cap…" className="input" />
          </Field>
          <Field label="Your contact number">
            <input value={form.contact} onChange={(e) => setForm({ ...form, contact: e.target.value })} inputMode="tel" className="input" />
          </Field>

          <button type="submit" className="w-full rounded-xl gradient-brand py-2.5 text-sm font-semibold text-primary-foreground">
            File report
          </button>
        </form>

        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-lg font-semibold">Active reports</h2>
            <span className="rounded-full border border-critical/40 bg-critical/10 px-2.5 py-0.5 text-xs text-critical">
              {searching.length} searching
            </span>
          </div>
          {reports.length === 0 ? (
            <div className="glass rounded-2xl p-8 text-center text-sm text-muted-foreground">
              No reports yet. Filed reports appear here with live status.
            </div>
          ) : (
            <div className="grid gap-3 md:grid-cols-2">
              {reports.map((r) => (
                <article key={r.id} className="glass space-y-2 rounded-2xl p-4">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="font-semibold">{r.name} <span className="text-xs text-muted-foreground">· {r.age}, {r.gender}</span></div>
                      <div className="mt-1 flex flex-wrap gap-2 text-[11px] text-muted-foreground">
                        <span className="inline-flex items-center gap-1"><MapPin className="h-3 w-3" />{r.lastSeenZone}</span>
                        <span className="inline-flex items-center gap-1"><Clock className="h-3 w-3" />{r.lastSeenAt}</span>
                        <a href={`tel:${r.contact}`} className="inline-flex items-center gap-1 text-brand-orange"><Phone className="h-3 w-3" />{r.contact}</a>
                      </div>
                    </div>
                    <span className={`rounded-full border px-2 py-0.5 text-[11px] ${
                      r.status === "searching" ? "border-critical/40 bg-critical/10 text-critical" : "border-safe/40 bg-safe/10 text-safe"
                    }`}>
                      {r.status === "searching" ? "Searching" : "Found"}
                    </span>
                  </div>
                  {r.wearing && <p className="text-xs text-muted-foreground">{r.wearing}</p>}
                  <div className="flex gap-2 pt-1">
                    {r.status === "searching" && (
                      <button
                        onClick={() => { markFound(r.id); toast.success("Marked as found"); }}
                        className="inline-flex items-center gap-1.5 rounded-lg border border-safe/40 bg-safe/10 px-2.5 py-1 text-xs text-safe hover:bg-safe/20"
                      >
                        <CheckCircle2 className="h-3.5 w-3.5" /> Mark found
                      </button>
                    )}
                    <button
                      onClick={() => remove(r.id)}
                      className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-card/60 px-2.5 py-1 text-xs text-muted-foreground hover:bg-accent"
                    >
                      <Trash2 className="h-3.5 w-3.5" /> Remove
                    </button>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs text-muted-foreground">{label}</span>
      {children}
    </label>
  );
}
