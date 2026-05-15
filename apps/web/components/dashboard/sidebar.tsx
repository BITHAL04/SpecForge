"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronLeft, LayoutDashboard, Plus, Settings, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { useUIStore } from "@/lib/stores/ui-store";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { UserMenu } from "@/components/dashboard/user-menu";
import { ActivityPanel } from "@/components/dashboard/activity-panel";

const nav = [
  { href: "/dashboard", icon: LayoutDashboard, label: "Projects" },
  { href: "/projects/new", icon: Plus, label: "New project" },
  { href: "/settings", icon: Settings, label: "Settings" },
];

export function Sidebar() {
  const pathname = usePathname();
  const { sidebarCollapsed, toggleSidebar } = useUIStore();

  return (
    <aside
      className={cn(
        "relative flex h-full flex-col border-r border-white/[0.08] bg-background transition-all duration-200",
        sidebarCollapsed ? "w-[56px]" : "w-[240px]",
      )}
    >
      <div
        className={cn(
          "flex h-12 items-center border-b border-white/[0.08] px-2",
          sidebarCollapsed ? "justify-center" : "justify-between",
        )}
      >
        {!sidebarCollapsed && (
          <Link href="/dashboard" className="flex items-center gap-2 px-2 font-medium text-sm">
            <Sparkles className="h-4 w-4 text-[#5E6AD2]" />
            SpecForge
          </Link>
        )}
        <Button variant="ghost" size="icon" className="h-7 w-7 shrink-0" onClick={toggleSidebar}>
          <ChevronLeft className={cn("h-3.5 w-3.5 text-muted-foreground transition-transform", sidebarCollapsed && "rotate-180")} />
        </Button>
      </div>

      <ScrollArea className="flex-1 px-2 py-2">
        <nav className="space-y-0.5">
          {nav.map(({ href, icon: Icon, label }) => {
            const active =
              pathname === href || (href !== "/dashboard" && pathname.startsWith(href));
            const link = (
              <Link
                key={href}
                href={href}
                className={cn(
                  "flex items-center gap-2.5 rounded-md px-2 py-1.5 text-[13px] transition-colors",
                  active
                    ? "bg-white/[0.08] text-foreground font-medium"
                    : "text-muted-foreground hover:bg-white/[0.04] hover:text-foreground",
                  sidebarCollapsed && "justify-center px-0",
                )}
              >
                <Icon className="h-4 w-4 shrink-0" />
                {!sidebarCollapsed && label}
              </Link>
            );

            if (sidebarCollapsed) {
              return (
                <Tooltip key={href}>
                  <TooltipTrigger asChild>{link}</TooltipTrigger>
                  <TooltipContent side="right">{label}</TooltipContent>
                </Tooltip>
              );
            }
            return link;
          })}
        </nav>

        {!sidebarCollapsed && (
          <>
            <Separator className="my-3 bg-white/[0.08]" />
            <ActivityPanel compact />
          </>
        )}
      </ScrollArea>

      <div className="border-t border-white/[0.08] p-2">
        <UserMenu collapsed={sidebarCollapsed} />
      </div>
    </aside>
  );
}
