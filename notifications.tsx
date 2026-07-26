import { createFileRoute } from "@tanstack/react-router";
import { AlertTriangle, Bell, CheckCircle2, Info } from "lucide-react";
import { DEMO_NOTIFICATIONS } from "@/lib/phase2-data";

export const Route = createFileRoute("/_authenticated/notifications")({
  component: NotificationsPage,
  head: () => ({
    meta: [
      { title: "Notifications · CrowdCompass" },
      { name: "description", content: "Live alerts on crowd density, weather advisories and safety incidents." },
      { property: "og:title", content: "Notifications · CrowdCompass" },
      { property: "og:description", content: "Real-time venue alerts across every zone you follow." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
});

function NotificationsPage() {
  return (
    <div className="mx-auto max-w-3xl space-y-4">
      <header className="flex items-center gap-2">
        <div className="grid h-9 w-9 place-items-center rounded-xl gradient-brand text-primary-foreground">
          <Bell className="h-4 w-4" />
        </div>
        <div>
          <h1 className="font-display text-2xl font-bold">Notifications</h1>
          <p className="text-sm text-muted-foreground">Live safety and operations feed.</p>
        </div>
      </header>

      <ul className="space-y-2">
        {DEMO_NOTIFICATIONS.map((n) => {
          const Icon = n.kind === "alert" ? AlertTriangle : n.kind === "success" ? CheckCircle2 : Info;
          const tone =
            n.kind === "alert" ? "border-critical/30 bg-critical/10 text-critical" :
            n.kind === "success" ? "border-safe/30 bg-safe/10 text-safe" :
            "border-moderate/30 bg-moderate/10 text-moderate";
          return (
            <li key={n.id} className="glass flex items-start gap-3 rounded-2xl p-4">
              <div className={`grid h-9 w-9 shrink-0 place-items-center rounded-xl border ${tone}`}>
                <Icon className="h-4 w-4" />
              </div>
              <div className="flex-1">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="font-semibold">{n.title}</h3>
                  <span className="text-[11px] text-muted-foreground">{n.time}</span>
                </div>
                <p className="mt-1 text-sm text-muted-foreground">{n.body}</p>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
