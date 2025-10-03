import { Bell, Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";

interface Notification {
  id: string;
  title: string;
  message: string;
  type: "ticket" | "chat" | "system";
  read: boolean;
  timestamp: Date;
}

export function NotificationCenter() {
  // todo: remove mock functionality
  const notifications: Notification[] = [
    {
      id: "1",
      title: "New ticket assigned",
      message: "TKT-001 has been assigned to you",
      type: "ticket",
      read: false,
      timestamp: new Date(Date.now() - 3600000),
    },
    {
      id: "2",
      title: "Chat message received",
      message: "You have a new message from John Doe",
      type: "chat",
      read: false,
      timestamp: new Date(Date.now() - 7200000),
    },
    {
      id: "3",
      title: "System maintenance",
      message: "Scheduled maintenance on Sunday at 2 AM",
      type: "system",
      read: true,
      timestamp: new Date(Date.now() - 86400000),
    },
  ];

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative" data-testid="button-notifications">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs">
              {unreadCount}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-96 p-0" align="end">
        <div className="p-4 border-b flex items-center justify-between">
          <h3 className="font-semibold">Notifications</h3>
          <Button variant="ghost" size="sm" data-testid="button-mark-all-read">
            <Check className="h-4 w-4 mr-2" />
            Mark all read
          </Button>
        </div>
        <ScrollArea className="h-96">
          {notifications.length === 0 ? (
            <div className="p-8 text-center">
              <p className="text-muted-foreground">No notifications</p>
            </div>
          ) : (
            <div className="divide-y">
              {notifications.map((notification) => (
                <Card
                  key={notification.id}
                  className={`p-4 rounded-none border-0 border-b hover-elevate ${
                    !notification.read ? "bg-accent/50" : ""
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <p className="font-medium text-sm">{notification.title}</p>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6 -mt-1"
                          data-testid={`button-dismiss-${notification.id}`}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">
                        {notification.message}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {notification.timestamp.toLocaleString()}
                      </p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </ScrollArea>
      </PopoverContent>
    </Popover>
  );
}
