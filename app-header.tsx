import { Link, useNavigate } from "@tanstack/react-router";
import { LogOut, MapPin, User } from "lucide-react";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { useAuth } from "@/hooks/use-auth";
import { useActiveVenue } from "@/hooks/use-active-venue";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function AppHeader() {
  const { user, signOut } = useAuth();
  const { venue, clear } = useActiveVenue();
  const navigate = useNavigate();

  const initials =
    user?.fullName
      .split(" ")
      .map((s) => s[0])
      .slice(0, 2)
      .join("")
      .toUpperCase() ?? "?";

  return (
    <header className="sticky top-0 z-30 flex h-14 items-center gap-3 border-b border-border bg-background/70 px-3 backdrop-blur-xl sm:px-5">
      <SidebarTrigger />
      {venue && (
        <button
          onClick={() => navigate({ to: "/venues" })}
          className="hidden items-center gap-2 rounded-xl border border-border bg-card/60 px-3 py-1.5 text-xs text-muted-foreground hover:bg-accent sm:flex"
        >
          <MapPin className="h-3.5 w-3.5 text-brand-orange" />
          <span className="text-foreground">{venue.name}</span>
          <span className="opacity-60">· change</span>
        </button>
      )}
      <div className="ml-auto flex items-center gap-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center gap-2 rounded-xl border border-border bg-card/60 px-2 py-1.5 text-sm hover:bg-accent">
              <span className="grid h-7 w-7 place-items-center rounded-lg gradient-brand text-xs font-bold text-primary-foreground">
                {initials}
              </span>
              <span className="hidden sm:inline">{user?.fullName ?? "Guest"}</span>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>
              <div className="font-medium">{user?.fullName}</div>
              <div className="text-xs text-muted-foreground">{user?.email}</div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link to="/coming-soon">
                <User className="mr-2 h-4 w-4" /> Profile
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => {
                clear();
                signOut();
                navigate({ to: "/auth" });
              }}
            >
              <LogOut className="mr-2 h-4 w-4" /> Sign out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
