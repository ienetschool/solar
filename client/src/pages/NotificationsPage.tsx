import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Bell, Mail, MessageSquare } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

export default function NotificationsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold mb-2">Notification Settings</h1>
        <p className="text-muted-foreground">
          Manage how you receive notifications and updates
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardContent className="p-6 space-y-4">
            <div className="flex items-center gap-3 mb-4">
              <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <Bell className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold">In-App Notifications</h3>
                <p className="text-sm text-muted-foreground">
                  Receive notifications within the app
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="ticket-updates">Ticket Updates</Label>
                <Switch id="ticket-updates" defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="new-messages">New Messages</Label>
                <Switch id="new-messages" defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="system-alerts">System Alerts</Label>
                <Switch id="system-alerts" defaultChecked />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 space-y-4">
            <div className="flex items-center gap-3 mb-4">
              <div className="h-10 w-10 rounded-lg bg-chart-1/10 flex items-center justify-center">
                <Mail className="h-5 w-5 text-chart-1" />
              </div>
              <div>
                <h3 className="font-semibold">Email Notifications</h3>
                <p className="text-sm text-muted-foreground">
                  Receive updates via email
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="email-ticket">Ticket Updates</Label>
                <Switch id="email-ticket" defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="email-digest">Daily Digest</Label>
                <Switch id="email-digest" />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="email-marketing">Marketing Updates</Label>
                <Switch id="email-marketing" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 space-y-4">
            <div className="flex items-center gap-3 mb-4">
              <div className="h-10 w-10 rounded-lg bg-chart-2/10 flex items-center justify-center">
                <MessageSquare className="h-5 w-5 text-chart-2" />
              </div>
              <div>
                <h3 className="font-semibold">WhatsApp Notifications</h3>
                <p className="text-sm text-muted-foreground">
                  Receive updates via WhatsApp
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="whatsapp-urgent">Urgent Tickets</Label>
                <Switch id="whatsapp-urgent" defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="whatsapp-assigned">Ticket Assigned</Label>
                <Switch id="whatsapp-assigned" />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="whatsapp-resolved">Ticket Resolved</Label>
                <Switch id="whatsapp-resolved" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
