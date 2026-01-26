"use client";

import { Sidebar } from "@/components/sidebar";
import { Header } from "@/components/header";
import { usePathname } from "next/navigation";
import Link from "next/link";
import clsx from "clsx";

export default function AMRLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const getTitle = () => {
    if (pathname.includes("gene-database")) return "Gene Database";
    if (pathname.includes("resistance-predictor"))
      return "Resistance Predictor";
    return "AMR Analytics";
  };

  const navItems = [
    {
      name: "Resistance Predictor",
      href: "/amr-analysis-engine/resistance-predictor",
    },
    { name: "Gene Database", href: "/amr-analysis-engine/gene-database" },
  ];

  return (
    <div className="flex flex-1">
      <Sidebar />

      <div className="flex-1 pt-16">
        <Header title="AMR Analysis Engine" />

        {/* Top Navigation / Tabs */}
        <div className="pl-25 px-8 border-b border-border flex gap-6">
          {navItems.map((item) => {
            const isActive = pathname.startsWith(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={clsx(
                  "py-4 text-sm font-medium relative transition-colors",
                  isActive
                    ? "text-primary"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                {item.name}
                {isActive && (
                  <span className="absolute left-0 -bottom-px h-[2px] w-full bg-primary rounded-full" />
                )}
              </Link>
            );
          })}
        </div>

        {/* Page Content */}
        <div className="w-full">{children}</div>
      </div>
    </div>
  );
}
