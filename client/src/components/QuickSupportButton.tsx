import { Button } from "@/components/ui/button";
import { HelpCircle } from "lucide-react";
import { useState } from "react";
import { QuickSupportDialog } from "./QuickSupportDialog";

export function QuickSupportButton() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button
        size="lg"
        className="fixed bottom-6 right-6 z-50 h-14 w-14 rounded-full shadow-lg hover:shadow-xl hover-elevate"
        onClick={() => setOpen(true)}
        data-testid="button-quick-support"
      >
        <HelpCircle className="h-6 w-6" />
      </Button>

      <QuickSupportDialog open={open} onOpenChange={setOpen} />
    </>
  );
}
