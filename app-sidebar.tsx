import { Link, useRouterState } from "@tanstack/react-router";
import {
  LayoutDashboard,
  MapPin,
  Ticket,
  CalendarPlus,
  UserSearch,
  Bell,
  BarChart3,
  UserCircle,
  Compass,
  Map,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

const NAV = [
  { title: "Dashboard", url: "/dashboard", icon: LayoutDashboard, ready: true },
  { title: "Venues", url: "/venues", icon: MapPin, ready: true },
  { title: "Venue Map", url: "/map", icon: Map, ready: true },
  { title: "Events", url: "/events", icon: CalendarPlus, ready: true },
  { title: "My Tickets", url: "/tickets", icon: Ticket, ready: true },
  { title: "Missing Person", url: "/missing", icon: UserSearch, ready: true },
  { title: "Notifications", url: "/notifications", icon: Bell, ready: true },
  { title: "Analytics", url: "/analytics", icon: BarChart3, ready: true },
  { title: "Profile", url: "/profile", icon: UserCircle, ready: true },
] as const;

export function AppSidebar() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <div className="flex items-center gap-2 px-2 py-1">
          <div className="grid h-8 w-8 place-items-center rounded-lg gradient-brand text-primary-foreground">
            <Compass className="h-4 w-4" />
          </div>
          <span className="font-display text-base font-semibold">CrowdCompass</span>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigate</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {NAV.map((item) => {
                const active = pathname === item.url || pathname.startsWith(`${item.url}/`);
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild isActive={active}>
                      <Link to={item.url} className="flex items-center gap-2">
                        <item.icon className="h-4 w-4" />
                        <span>{item.title}</span>
                        {!item.ready && (
                          <span className="ml-auto rounded-md bg-muted px-1.5 py-0.5 text-[10px] uppercase tracking-wide text-muted-foreground">
                            Soon
                          </span>
                        )}
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
