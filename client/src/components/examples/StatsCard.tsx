import { StatsCard } from "../StatsCard";
import { Ticket } from "lucide-react";

export default function StatsCardExample() {
  return (
    <div className="p-6">
      <StatsCard
        title="Total Tickets"
        value="1,234"
        description="Active support tickets"
        icon={Ticket}
        trend={{ value: 12, isPositive: true }}
      />
    </div>
  );
}
