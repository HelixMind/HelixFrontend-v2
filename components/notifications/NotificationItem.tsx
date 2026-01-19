"use client";

import { Trash2, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

export type Notification = {
  id: number;
  title: string;
  message: string;
  time: string;
  read: boolean;
};

type Props = {
  data: Notification;
  onRead: (id: number) => void;
  onDelete: (id: number) => void;
};

export default function NotificationItem({ data, onRead, onDelete }: Props) {
  return (
    <div className="p-4 hover:bg-card transition-colors">
      <div className="flex justify-between items-start gap-3">
        <div>
          <p className={`font-medium ${!data.read ? "text-primary" : ""}`}>
            {data.title}
          </p>
          <p className="text-sm text-muted-foreground">
            {data.message}
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            {data.time}
          </p>
        </div>

        <div className="flex gap-1">
          {!data.read && (
            <Button
              size="icon"
              variant="ghost"
              onClick={() => onRead(data.id)}
            >
              <Check className="w-4 h-4" />
            </Button>
          )}

          <Button
            size="icon"
            variant="ghost"
            onClick={() => onDelete(data.id)}
          >
            <Trash2 className="w-4 h-4 text-destructive" />
          </Button>
        </div>
      </div>

      <Separator className="mt-4" />
    </div>
  );
}
