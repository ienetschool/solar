import { TicketList } from "../TicketList";

export default function TicketListExample() {
  return (
    <div className="p-6">
      <TicketList onCreateTicket={() => console.log("Create ticket clicked")} />
    </div>
  );
}
