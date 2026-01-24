"use client";

import { Search, User, Settings, LogOut } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import NotificationBell from "@/components/notifications/NotificationBell";

// shadcn
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/contexts/AuthContext";

export function Header({ title }: { title: string }) {
  const {signOut} = useAuth();
  const router = useRouter();

  const handleSignOut = async function() {
    await signOut();
    router.push("/signin");
  }

  return (
    <header className="fixed top-0 left-16 right-0 h-16 bg-background/80 backdrop-blur-lg border-b border-border flex items-center justify-between px-8 z-40">
      <h1 className="text-lg lg:text-2xl font-bold text-foreground">{title}</h1>

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

        {/* Profile dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="p-2 hover:bg-card rounded-lg transition-colors">
              <User className="w-5 h-5 text-muted-foreground hover:text-foreground" />
            </button>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuItem asChild>
              <Link
                href="/settings"
                className="flex items-center gap-2 cursor-pointer"
              >
                <Settings className="w-4 h-4" />
                Settings
              </Link>
            </DropdownMenuItem>

            <DropdownMenuSeparator />

            <DropdownMenuItem
              onClick={handleSignOut}
              className="flex items-center gap-2 text-red-500 cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
              Sign out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
