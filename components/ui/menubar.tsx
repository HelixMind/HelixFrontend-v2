"use client";

import { Search, User } from "lucide-react";
import Link from "next/link";
import NotificationBell from "@/components/notifications/NotificationBell";

export function Header({ title }: { title: string }) {
  return (
    <header className="fixed top-0 left-16 right-0 h-16 bg-background/80 backdrop-blur-lg border-b border-border flex items-center justify-between px-8 z-40">
      <h1 className="text-2xl font-bold text-foreground">{title}</h1>

      <div className="flex items-center gap-6">
        {/* Search */}
        <div className="relative hidden md:block">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search sequences..."
            className="bg-card border border-border rounded-lg pl-10 pr-4 py-2 text-sm focus:outline-none focus:border-primary w-64"
          />
        </div>

        {/* Notifications */}
        <NotificationBell />

        {/* Profile */}
        <Link
          href="/settings"
          className="p-2 hover:bg-card rounded-lg transition-colors"
        >
          <User className="w-5 h-5 text-muted-foreground hover:text-foreground" />
        </Link>
      </div>
    </header>
  );
}
