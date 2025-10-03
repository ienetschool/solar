import { useState } from "react";
import { CreateTicketDialog } from "../CreateTicketDialog";
import { Button } from "@/components/ui/button";

export default function CreateTicketDialogExample() {
  const [open, setOpen] = useState(false);

  return (
    <div className="p-6">
      <Button onClick={() => setOpen(true)}>Open Dialog</Button>
      <CreateTicketDialog open={open} onOpenChange={setOpen} />
    </div>
  );
}
