import { useAuth } from "@/contexts/AuthContext";
import { StatsCard } from "@/components/StatsCard";
import { TicketList } from "@/components/TicketList";
import { Ticket, MessageSquare, Users, TrendingUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function Dashboard() {
  const { user } = useAuth();

  // todo: remove mock functionality
  const userStats = [
    {
      title: "My Tickets",
      value: "8",
      description: "Active tickets",
      icon: Ticket,
      trend: { value: 2, isPositive: false },
    },
    {
      title: "Chat Sessions",
      value: "12",
      description: "This month",
      icon: MessageSquare,
      trend: { value: 15, isPositive: true },
    },
  ];

  const agentStats = [
    {
      title: "Assigned Tickets",
      value: "23",
      description: "Pending resolution",
      icon: Ticket,
      trend: { value: 8, isPositive: false },
    },
    {
      title: "Active Chats",
      value: "5",
      description: "In progress",
      icon: MessageSquare,
    },
    {
      title: "Resolved Today",
      value: "18",
      description: "Completed tickets",
      icon: TrendingUp,
      trend: { value: 12, isPositive: true },
    },
  ];

  const adminStats = [
    {
      title: "Total Tickets",
      value: "1,234",
      description: "All time",
      icon: Ticket,
      trend: { value: 12, isPositive: true },
    },
    {
      title: "Active Users",
      value: "456",
      description: "Registered users",
      icon: Users,
      trend: { value: 8, isPositive: true },
    },
    {
      title: "Resolution Rate",
      value: "94%",
      description: "Last 30 days",
      icon: TrendingUp,
      trend: { value: 3, isPositive: true },
    },
    {
      title: "Avg Response Time",
      value: "2.3h",
      description: "First response",
      icon: MessageSquare,
      trend: { value: 15, isPositive: true },
    },
  ];

  const stats =
    user?.role === "admin"
      ? adminStats
      : user?.role === "agent"
      ? agentStats
      : userStats;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold mb-2">
          Welcome back, {user?.name}
        </h1>
        <p className="text-muted-foreground">
          Here's what's happening with your support tickets today.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <StatsCard key={stat.title} {...stat} />
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Tickets</CardTitle>
        </CardHeader>
        <CardContent>
          <TicketList onCreateTicket={() => console.log("Create ticket")} />
        </CardContent>
      </Card>
    </div>
  );
}
