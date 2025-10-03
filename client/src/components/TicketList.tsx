import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Plus, Search, Filter } from "lucide-react";
import { Input } from "@/components/ui/input";

interface Ticket {
  id: string;
  title: string;
  status: "open" | "pending" | "resolved" | "closed";
  priority: "low" | "medium" | "high" | "urgent";
  assignee?: string;
  created: Date;
  updated: Date;
}

export function TicketList({ onCreateTicket }: { onCreateTicket?: () => void }) {
  const [searchQuery, setSearchQuery] = useState("");

  // todo: remove mock functionality
  const tickets: Ticket[] = [
    {
      id: "TKT-001",
      title: "Unable to login to account",
      status: "open",
      priority: "high",
      assignee: "John Doe",
      created: new Date(Date.now() - 86400000),
      updated: new Date(Date.now() - 3600000),
    },
    {
      id: "TKT-002",
      title: "Feature request: Dark mode",
      status: "pending",
      priority: "medium",
      created: new Date(Date.now() - 172800000),
      updated: new Date(Date.now() - 7200000),
    },
    {
      id: "TKT-003",
      title: "Payment processing issue",
      status: "open",
      priority: "urgent",
      assignee: "Jane Smith",
      created: new Date(Date.now() - 259200000),
      updated: new Date(Date.now() - 14400000),
    },
  ];

  const getStatusColor = (status: string) => {
    const colors = {
      open: "bg-chart-1 text-white",
      pending: "bg-chart-3 text-white",
      resolved: "bg-chart-2 text-white",
      closed: "bg-muted text-muted-foreground",
    };
    return colors[status as keyof typeof colors] || "bg-muted";
  };

  const getPriorityColor = (priority: string) => {
    const colors = {
      low: "border-chart-2",
      medium: "border-chart-3",
      high: "border-chart-4",
      urgent: "border-destructive",
    };
    return colors[priority as keyof typeof colors] || "";
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search tickets..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
            data-testid="input-search-tickets"
          />
        </div>
        <Button variant="outline" size="icon" data-testid="button-filter">
          <Filter className="h-4 w-4" />
        </Button>
        <Button onClick={onCreateTicket} data-testid="button-create-ticket">
          <Plus className="h-4 w-4 mr-2" />
          New Ticket
        </Button>
      </div>

      <div className="space-y-3">
        {tickets.map((ticket) => (
          <Card
            key={ticket.id}
            className={`p-4 hover-elevate cursor-pointer border-l-4 ${getPriorityColor(
              ticket.priority
            )}`}
            data-testid={`card-ticket-${ticket.id}`}
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-2">
                  <p className="font-mono text-sm text-muted-foreground">{ticket.id}</p>
                  <Badge className={getStatusColor(ticket.status)}>
                    {ticket.status}
                  </Badge>
                  <Badge variant="outline" className="capitalize">
                    {ticket.priority}
                  </Badge>
                </div>
                <h3 className="font-semibold mb-2">{ticket.title}</h3>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <span>
                    Updated {ticket.updated.toLocaleDateString()}
                  </span>
                  {ticket.assignee && (
                    <div className="flex items-center gap-2">
                      <Avatar className="h-5 w-5">
                        <AvatarFallback className="text-xs">
                          {ticket.assignee.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <span>{ticket.assignee}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
