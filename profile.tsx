import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { UserCircle, LogOut, Ticket as TicketIcon, MapPin, Shield } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { useTickets } from "@/hooks/use-phase2-store";
import { useActiveVenue } from "@/hooks/use-active-venue";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/profile")({
  component: ProfilePage,
  head: () => ({
    meta: [
      { title: "Profile · CrowdCompass" },
      { name: "description", content: "Manage your CrowdCompass profile, preferences and privacy settings." },
      { property: "og:title", content: "Profile · CrowdCompass" },
      { property: "og:description", content: "Your account and preferences inside CrowdCompass." },
      { property: "og:type", content: "profile" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
});

function ProfilePage() {
  const { user, updateUser, signOut } = useAuth();
  const { tickets } = useTickets();
  const { venue } = useActiveVenue();
  const navigate = useNavigate();
  const [form, setForm] = useState({ fullName: "", email: "", phone: "" });

  useEffect(() => {
    if (user) setForm({ fullName: user.fullName, email: user.email, phone: user.phone });
  }, [user]);

  if (!user) return null;

  function save(e: React.FormEvent) {
    e.preventDefault();
    updateUser(form);
    toast.success("Profile updated");
  }

  return (
    <div className="mx-auto max-w-4xl space-y-5">
      <header className="glass flex flex-wrap items-center gap-4 rounded-3xl p-5">
        <div className="grid h-16 w-16 place-items-center rounded-2xl gradient-brand text-primary-foreground">
          <UserCircle className="h-9 w-9" />
        </div>
        <div className="flex-1">
          <div className="font-display text-xl font-bold">{user.fullName}</div>
          <div className="text-sm text-muted-foreground">{user.email}</div>
        </div>
        <button
          onClick={() => { signOut(); navigate({ to: "/auth" }); }}
          className="inline-flex items-center gap-2 rounded-xl border border-border bg-card/60 px-3 py-2 text-sm hover:bg-accent"
        >
          <LogOut className="h-4 w-4" /> Sign out
        </button>
      </header>

      <section className="grid gap-3 sm:grid-cols-3">
        <Stat icon={TicketIcon} label="Tickets" value={tickets.length} />
        <Stat icon={MapPin} label="Active venue" value={venue ? venue.name : "None"} />
        <Stat icon={Shield} label="Account" value="Verified" />
      </section>

      <form onSubmit={save} className="glass space-y-3 rounded-3xl p-5">
        <h2 className="font-display text-lg font-semibold">Personal info</h2>
        <Field label="Full name">
          <input value={form.fullName} onChange={(e) => setForm({ ...form, fullName: e.target.value })} className="input" />
        </Field>
        <div className="grid gap-3 sm:grid-cols-2">
          <Field label="Email">
            <input value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="input" />
          </Field>
          <Field label="Phone">
            <input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="input" />
          </Field>
        </div>
        <button className="rounded-xl gradient-brand px-4 py-2 text-sm font-semibold text-primary-foreground">
          Save changes
        </button>
      </form>

      <section className="glass space-y-2 rounded-3xl p-5">
        <h2 className="font-display text-lg font-semibold">Preferences</h2>
        <Toggle label="Live crowd alerts" defaultOn />
        <Toggle label="Weather advisories" defaultOn />
        <Toggle label="Event recommendations" defaultOn />
        <Toggle label="Marketing emails" />
      </section>
    </div>
  );
}

function Stat({ icon: Icon, label, value }: { icon: React.ComponentType<{ className?: string }>; label: string; value: React.ReactNode }) {
  return (
    <div className="glass rounded-2xl p-4">
      <div className="flex items-center gap-3">
        <div className="grid h-9 w-9 place-items-center rounded-xl gradient-brand text-primary-foreground">
          <Icon className="h-4 w-4" />
        </div>
        <div>
          <div className="text-xs text-muted-foreground">{label}</div>
          <div className="font-display text-lg font-semibold">{value}</div>
        </div>
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

function Toggle({ label, defaultOn }: { label: string; defaultOn?: boolean }) {
  const [on, setOn] = useState(!!defaultOn);
  return (
    <button
      type="button"
      onClick={() => setOn((o) => !o)}
      className="flex w-full items-center justify-between rounded-xl border border-border bg-card/50 px-3 py-2.5 text-sm hover:bg-accent"
    >
      <span>{label}</span>
      <span className={`inline-flex h-5 w-9 items-center rounded-full p-0.5 transition ${on ? "gradient-brand" : "bg-muted"}`}>
        <span className={`h-4 w-4 rounded-full bg-white transition ${on ? "translate-x-4" : ""}`} />
      </span>
    </button>
  );
}
