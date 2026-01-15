"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { LayoutDashboard, Zap, Shuffle, Database, Settings, Beaker } from "lucide-react"
import { cn } from "@/lib/utils"

export function Sidebar() {
  const pathname = usePathname()

  const navItems = [
    { href: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
    { href: "/dna-scanner", icon: Zap, label: "DNA Scanner" },
    { href: "/mutation-simulator", icon: Shuffle, label: "Mutation Simulator" },
    { href: "/microbe-growth-lab", icon: Beaker, label: "Microbe Lab" },
    { href: "/amr-database", icon: Database, label: "AMR Database" },
    { href: "/settings", icon: Settings, label: "Settings" },
  ]

  return (
    <aside className="fixed left-0 top-0 h-screen w-16 bg-sidebar border-r border-sidebar-border flex flex-col items-center gap-8 py-8 z-50">
      <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center font-bold text-primary-foreground">
        ℌ
      </div>

      <nav className="flex flex-col gap-6">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href

          return (
            <Link
              key={item.href}
              href={item.href}
              title={item.label}
              className={cn(
                "w-10 h-10 rounded-lg flex items-center justify-center transition-all duration-200",
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "text-sidebar-foreground hover:bg-sidebar-accent/40",
              )}
            >
              <Icon className="w-5 h-5" />
            </Link>
          )
        })}
      </nav>
    </aside>
  )
}
