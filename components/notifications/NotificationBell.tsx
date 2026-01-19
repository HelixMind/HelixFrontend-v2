"use client";

import { Bell } from "lucide-react";
import { useState } from "react";
import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";

import NotificationItem, { Notification } from "./NotificationItem";

export default function NotificationBell() {
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
              <NotificationItem
                key={n.id}
                data={n}
                onRead={markAsRead}
                onDelete={deleteNotification}
              />
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
  );
}
