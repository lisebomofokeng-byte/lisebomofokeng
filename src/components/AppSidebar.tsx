import { Link, useRouterState } from "@tanstack/react-router";
import {
  CalendarPlus,
  CalendarCheck,
  Scissors,
  CalendarRange,
  Users,
  UserCog,
  Bell,
  Sparkles,
  LayoutDashboard,
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
  SidebarFooter,
} from "@/components/ui/sidebar";

const clientItems = [
  { title: "Overview", url: "/", icon: LayoutDashboard },
  { title: "Book Appointment", url: "/book", icon: CalendarPlus },
  { title: "My Appointments", url: "/my-appointments", icon: CalendarCheck },
  { title: "Services & Pricing", url: "/services", icon: Scissors },
] as const;

const adminItems = [
  { title: "Calendar Grid", url: "/admin/calendar", icon: CalendarRange },
  { title: "Client Database", url: "/admin/clients", icon: Users },
  { title: "Stylist Schedules", url: "/admin/stylists", icon: UserCog },
  { title: "Notifications", url: "/admin/notifications", icon: Bell },
] as const;

export function AppSidebar() {
  const currentPath = useRouterState({ select: (r) => r.location.pathname });
  const isActive = (path: string) =>
    path === "/" ? currentPath === "/" : currentPath.startsWith(path);

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="border-b">
        <div className="flex items-center gap-2 px-2 py-3">
          <div
            className="flex h-9 w-9 items-center justify-center rounded-lg text-primary-foreground shadow-[var(--shadow-elegant)]"
            style={{ background: "var(--gradient-gold)" }}
          >
            <Sparkles className="h-5 w-5" />
          </div>
          <div className="flex flex-col leading-tight group-data-[collapsible=icon]:hidden">
            <span className="text-sm font-semibold tracking-wide">AURA</span>
            <span className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">Salon Booking</span>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Client</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {clientItems.map((item) => (
                <SidebarMenuItem key={item.url}>
                  <SidebarMenuButton asChild isActive={isActive(item.url)} tooltip={item.title}>
                    <Link to={item.url}>
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarGroup>
          <SidebarGroupLabel>Admin / Stylist</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {adminItems.map((item) => (
                <SidebarMenuItem key={item.url}>
                  <SidebarMenuButton asChild isActive={isActive(item.url)} tooltip={item.title}>
                    <Link to={item.url}>
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="border-t">
        <p className="px-2 py-2 text-[10px] leading-snug text-muted-foreground group-data-[collapsible=icon]:hidden">
          Estimated durations and stylist matching are optimized by AI. Please review final details before confirming.
        </p>
      </SidebarFooter>
    </Sidebar>
  );
}