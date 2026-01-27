"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import {
  LayoutDashboard,
  Zap,
  Shuffle,
  Microscope,
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
import Logo from "./ui/Logo";

export function Sidebar() {
  const pathname = usePathname();
  const [expanded, setExpanded] = useState(false);
  const [showLabels, setShowLabels] = useState(false);

  useEffect(() => {
    let timer: NodeJS.Timeout;

    if (expanded) {
      timer = setTimeout(() => {
        setShowLabels(true);
      }, 100);
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
    { href: "/amr-analysis-engine", icon: Microscope, label: "AMR Analysis Engine" },
    { href: "/settings", icon: Settings, label: "Settings" },
  ];

  return (
    <>
      {expanded && (
        <div
          className="fixed inset-0 bg-black/40 z-40 backdrop-blur-xs"
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
          <button
            onClick={() => setExpanded(!expanded)}
            className="w-full rounded-full flex items-center justify-between gap-6 text-primary"
          >
            {showLabels && <Logo />}

            {expanded ? (
              <PanelRightOpen className="cursor-pointer" />
            ) : (
              <PanelLeftOpen className="cursor-pointer" />
            )}
          </button>
        </div>

        <div className="h-full flex flex-col justify-between">
          <nav
            className={cn(
              "border-t border-t-accent flex flex-col items-center justify-center gap-6 w-full px-4 pt-6 duration-150 ease-out transition-all",
              expanded && "pl-4 items-start justify-center",
              expanded ? "w-64" : "w-16",
            )}
          >
            {navItems.map((item) => {
              const Icon = item.icon;

              // ✅ FIX HERE
              const isActive =
                pathname === item.href || pathname.startsWith(item.href + "/");

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

          <Link
            href={"/settings"}
            className={cn("w-full flex justify-center items-center gap-4", expanded && "px-4 justify-start")}
          >
            <div className="shrink-0 w-10 h-10 rounded-full bg-secondary flex items-center justify-center text-base font-display font-bold">
              U
            </div>

            {showLabels && (
              <div>
                <h3 className="flex items-center gap-2 text-lg font-semibold truncate transition-all ease-out duration-150">
                  <span className="text-sm truncate">John Doe</span>
                </h3>
                <p className="text-muted-foreground flex items-center gap-2 truncate">
                  <span className="text-xs truncate">johndoe@example.com</span>
                </p>
              </div>
            )}
          </Link>
        </div>
      </aside>
    </>
  );
}
