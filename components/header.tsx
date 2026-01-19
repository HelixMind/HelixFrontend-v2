"use client";

import { Search, Bell, User, Trash2, Check } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

// shadcn
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";

type Notification = {
  id: number;
  title: string;
  message: string;
  time: string;
  read: boolean;
};

export function Header({ title }: { title: string }) {
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: 1,
      title: "Upload Complete",
      message: "FASTA file upload completed successfully.",
      time: "2 mins ago",
      read: false,
    },
    {
      id: 2,
      title: "Scan Finished",
      message: "Mutation scan completed.",
      time: "1 hour ago",
      read: true,
    },
  ]);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAsRead = (id: number) => {
    setNotifications((prev) =>
      prev.map((n) =>
        n.id === id ? { ...n, read: true } : n
      )
    );
  };

  const deleteNotification = (id: number) => {
    setNotifications((prev) =>
      prev.filter((n) => n.id !== id)
    );
  };

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
        <Popover>
          <PopoverTrigger asChild>
            <button className="relative p-2 hover:bg-card rounded-lg transition-colors">
              <Bell className="w-5 h-5 text-muted-foreground hover:text-foreground" />

              {unreadCount > 0 && (
                <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full" />
              )}
            </button>
          </PopoverTrigger>

          <PopoverContent align="end" className="w-96 p-0">
            <div className="p-4 border-b border-border flex items-center justify-between">
              <h3 className="font-semibold">Notifications</h3>
              {unreadCount > 0 && (
                <Badge variant="secondary">{unreadCount} new</Badge>
              )}
            </div>

            <ScrollArea className="h-80">
              {notifications.length === 0 ? (
                <p className="p-6 text-center text-sm text-muted-foreground">
                  No notifications yet
                </p>
              ) : (
                notifications.map((n) => (
                  <div key={n.id} className="p-4 hover:bg-card transition-colors">
                    <div className="flex justify-between items-start gap-3">
                      <div>
                        <p className={`font-medium ${!n.read ? "text-primary" : ""}`}>
                          {n.title}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {n.message}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {n.time}
                        </p>
                      </div>

                      <div className="flex gap-1">
                        {!n.read && (
                          <Button
                            size="icon"
                            variant="ghost"
                            onClick={() => markAsRead(n.id)}
                          >
                            <Check className="w-4 h-4" />
                          </Button>
                        )}

                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => deleteNotification(n.id)}
                        >
                          <Trash2 className="w-4 h-4 text-destructive" />
                        </Button>
                      </div>
                    </div>
                    <Separator className="mt-4" />
                  </div>
                ))
              )}
            </ScrollArea>

            <div className="p-3 border-t border-border text-center">
              <Link
                href="/notifications"
                className="text-sm text-primary hover:underline"
              >
                View all notifications →
              </Link>
            </div>
          </PopoverContent>
        </Popover>

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
