"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import {
  LayoutDashboard,
  Zap,
  Shuffle,
  Database,
  Settings,
  Beaker,
  PanelLeftOpen,
  PanelRightOpen,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export function Sidebar() {
  const pathname = usePathname();
  const [expanded, setExpanded] = useState(false);
  const [showLabels, setShowLabels] = useState(false);

  useEffect(() => {
    let timer: NodeJS.Timeout;

    if (expanded) {
      timer = setTimeout(() => {
        setShowLabels(true);
      }, 50); // must match duration-300
    } else {
      setShowLabels(false);
    }

    return () => clearTimeout(timer);
  }, [expanded]);

  const navItems = [
    { href: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
    { href: "/dna-scanner", icon: Zap, label: "DNA Scanner" },
    { href: "/mutation-simulator", icon: Shuffle, label: "Mutation Simulator" },
    { href: "/microbe-growth-lab", icon: Beaker, label: "Microbe Lab" },
    { href: "/amr-database", icon: Database, label: "AMR Database" },
    { href: "/settings", icon: Settings, label: "Settings" },
  ];

  return (
    <>
      {/* Overlay */}
      {expanded && (
        <div
          className="fixed inset-0 bg-black/40 z-40 backdrop-blur-sm"
          onClick={() => setExpanded(false)}
        />
      )}

      <aside
        className={cn(
          "fixed left-0 top-0 h-screen bg-sidebar border-r border-sidebar-border flex flex-col py-8 z-50 transition-all duration-300",
          expanded ? "w-64" : "w-16",
          "items-center gap-8"
        )}
      >
        <div
          className={cn(
            "h-8 px-5 flex items-center justify-center font-bold text-primary-foreground transition-all duration-300",
            expanded ? "w-full justify-start gap-2" : ""
          )}
        >
          {/* Toggle button */}
          <button
            onClick={() => setExpanded(!expanded)}
            className="w-full rounded-full flex items-center justify-between gap-6 text-primary"
          >
            {showLabels && (
              <div className="flex items-center gap-2.5">
                <img src="/logo_white.png" alt="" className="w-6 h-6" />
                <span className="truncate">HelixMind</span>
              </div>
            )}

            {expanded ? (
              <PanelLeftOpen className="cursor-pointer" />
            ) : (
              <PanelRightOpen className="cursor-pointer" />
            )}
          </button>
        </div>

        <nav
          className={cn(
            "border-t border-t-accent flex flex-col items-center justify-center gap-6 w-full px-4 pt-6 duration-150 ease-out transition-all",
            expanded && "pl-4 items-start justify-center"
          )}
        >
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;

            return expanded ? (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "truncate! w-full flex items-center gap-4 rounded-lg px-4 py-2 transition-all duration-200",
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : "text-sidebar-foreground hover:bg-sidebar-accent/40"
                )}
              >
                <Icon className="w-5 h-5" />
                {showLabels && <span className="truncate">{item.label}</span>}
              </Link>
            ) : (
              <Tooltip key={item.href}>
                <TooltipTrigger>
                  <Link
                    href={item.href}
                    title={item.label}
                    className={cn(
                      "w-10 h-10 rounded-lg flex items-center justify-center truncate transition-all duration-200",
                      isActive
                        ? "bg-primary text-primary-foreground"
                        : "text-sidebar-foreground hover:bg-sidebar-accent/40"
                    )}
                  >
                    <Icon className="w-5 h-5" />
                  </Link>
                </TooltipTrigger>
                <TooltipContent side="right">
                  <p className="truncate">{item.label}</p>
                </TooltipContent>
              </Tooltip>
            );
          })}
        </nav>
      </aside>
    </>
  );
}
