import { useState } from "react";
import { Ambulance, Flame, MapPin, Phone, ShieldAlert, Siren, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useActiveVenue } from "@/hooks/use-active-venue";

export function FloatingSOS() {
  const { venue } = useActiveVenue();
  const [sending, setSending] = useState<string | null>(null);
  const [open, setOpen] = useState(false);

  function send(kind: string) {
    setSending(kind);
    setTimeout(() => {
      setSending(null);
      setOpen(false);
      toast.success(`${kind} alert dispatched`, {
        description: venue ? `Sharing location: ${venue.name}` : "Location shared with responders.",
      });
    }, 900);
  }

  const actions = [
    { key: "Medical", icon: Ambulance, className: "bg-critical/20 border-critical/40 text-critical" },
    { key: "Police", icon: ShieldAlert, className: "bg-chart-5/20 border-chart-5/40 text-chart-5" },
    { key: "Fire & Rescue", icon: Flame, className: "bg-crowded/20 border-crowded/40 text-crowded" },
    { key: "Venue Security", icon: Siren, className: "bg-moderate/20 border-moderate/40 text-moderate" },
  ];

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button
          aria-label="Emergency SOS"
          className="fixed bottom-5 right-5 z-40 grid h-14 w-14 place-items-center rounded-full bg-critical text-critical-foreground shadow-xl shadow-critical/40 ring-4 ring-critical/20 transition hover:scale-105"
        >
          <span className="absolute inset-0 -z-10 animate-ping rounded-full bg-critical/40" />
          <span className="text-xs font-bold tracking-wider">SOS</span>
        </button>
      </DialogTrigger>
      <DialogContent className="glass max-w-md rounded-3xl border-border">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-critical">
            <Siren className="h-5 w-5" /> Emergency SOS
          </DialogTitle>
        </DialogHeader>
        <p className="text-sm text-muted-foreground">
          Tap a service. Your live location will be shared with responders.
        </p>
        <div className="grid grid-cols-2 gap-3">
          {actions.map((a) => (
            <button
              key={a.key}
              disabled={sending !== null}
              onClick={() => send(a.key)}
              className={`flex flex-col items-center gap-2 rounded-2xl border p-4 text-sm font-medium transition hover:scale-[1.02] disabled:opacity-60 ${a.className}`}
            >
              {sending === a.key ? <Loader2 className="h-6 w-6 animate-spin" /> : <a.icon className="h-6 w-6" />}
              {a.key}
            </button>
          ))}
        </div>
        <button
          onClick={() => send("Location share")}
          className="mt-2 flex w-full items-center justify-center gap-2 rounded-2xl border border-border bg-card/60 py-3 text-sm hover:bg-accent"
        >
          <MapPin className="h-4 w-4 text-brand-orange" /> Share current venue location
        </button>
        {venue && (
          <div className="mt-4 space-y-2 rounded-2xl border border-border bg-card/40 p-4 text-xs">
            <div>
              <span className="text-muted-foreground">Nearest medical: </span>
              <span className="font-medium">{venue.nearestMedical}</span>
            </div>
            <div>
              <span className="text-muted-foreground">Nearest exit: </span>
              <span className="font-medium">{venue.nearestExit}</span>
            </div>
            <div className="mt-2 grid gap-1">
              {venue.emergencyContacts.map((c) => (
                <a
                  key={c.number}
                  href={`tel:${c.number.replace(/\s/g, "")}`}
                  className="flex items-center justify-between rounded-lg px-2 py-1 hover:bg-accent"
                >
                  <span className="text-muted-foreground">{c.label}</span>
                  <span className="inline-flex items-center gap-1 font-medium">
                    <Phone className="h-3 w-3" /> {c.number}
                  </span>
                </a>
              ))}
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
