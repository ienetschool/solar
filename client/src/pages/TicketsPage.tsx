import { useState } from "react";
import { TicketList } from "@/components/TicketList";
import { CreateTicketDialog } from "@/components/CreateTicketDialog";

export default function TicketsPage() {
  const [createDialogOpen, setCreateDialogOpen] = useState(false);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold mb-2">Support Tickets</h1>
        <p className="text-muted-foreground">
          Manage and track your support requests
        </p>
      </div>

      <TicketList onCreateTicket={() => setCreateDialogOpen(true)} />
      <CreateTicketDialog
        open={createDialogOpen}
        onOpenChange={setCreateDialogOpen}
      />
    </div>
  );
}
