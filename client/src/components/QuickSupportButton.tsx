import { Button } from "@/components/ui/button";
import { MessageSquare } from "lucide-react";
import { useState } from "react";
import { QuickSupportPopup } from "./QuickSupportPopup";
import { useLocation } from "wouter";

export function QuickSupportButton() {
  const [open, setOpen] = useState(false);
  const [location] = useLocation();

  return (
    <>
      <button
        style={{
          position: 'fixed',
          bottom: '24px',
          right: '24px',
          zIndex: 99999,
          width: '56px',
          height: '56px',
          borderRadius: '50%',
          backgroundColor: '#f97316',
          border: 'none',
          cursor: 'pointer',
          boxShadow: '0 10px 25px rgba(0,0,0,0.3)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
        onClick={() => setOpen(true)}
        data-testid="button-quick-support"
      >
        <MessageSquare style={{ width: '24px', height: '24px', color: 'white' }} />
      </button>

      <QuickSupportPopup open={open} onOpenChange={setOpen} currentPage={location} />
    </>
  );
}
