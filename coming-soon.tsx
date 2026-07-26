import { createFileRoute, Link } from "@tanstack/react-router";
import { Sparkles } from "lucide-react";

export const Route = createFileRoute("/_authenticated/coming-soon")({
  component: ComingSoon,
  head: () => ({
    meta: [
      { title: "Coming soon · CrowdCompass" },
      { name: "description", content: "This module lands in the next CrowdCompass update." },
    ],
  }),
});

function ComingSoon() {
  return (
    <div className="mx-auto grid min-h-[60vh] max-w-xl place-items-center">
      <div className="glass w-full rounded-3xl p-8 text-center">
        <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl gradient-brand text-primary-foreground">
          <Sparkles className="h-7 w-7" />
        </div>
        <h1 className="mt-5 font-display text-2xl font-bold">Landing in the next update</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Venue Map, Events, Tickets, Missing Person, Notifications, Analytics and Profile ship in
          Phase&nbsp;2. Your Phase&nbsp;1 modules (Dashboard, Venues, SOS and AI Assistant) are
          fully wired.
        </p>
        <Link
          to="/dashboard"
          className="mt-6 inline-flex items-center rounded-xl gradient-brand px-5 py-2.5 text-sm font-semibold text-primary-foreground"
        >
          Back to dashboard
        </Link>
      </div>
    </div>
  );
}
