import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Bot, MessageSquare, Ticket, HelpCircle, Phone } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AISupportTab } from "./support-tabs/AISupportTab";
import { NavigationHelpTab } from "./support-tabs/NavigationHelpTab";
import { LiveChatTab } from "./support-tabs/LiveChatTab";
import { TicketSubmissionTab } from "./support-tabs/TicketSubmissionTab";
import { CallbackRequestTab } from "./support-tabs/CallbackRequestTab";

interface QuickSupportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function QuickSupportDialog({ open, onOpenChange }: QuickSupportDialogProps) {
  const [agentsAvailable, setAgentsAvailable] = useState(false);
  const [checkingAgents, setCheckingAgents] = useState(true);

  useEffect(() => {
    if (open) {
      checkAgentAvailability();
    }
  }, [open]);

  const checkAgentAvailability = async () => {
    setCheckingAgents(true);
    try {
      const response = await fetch("/api/agents/online");
      if (response.ok) {
        const data = await response.json();
        setAgentsAvailable(data.available);
      }
    } catch (error) {
      setAgentsAvailable(false);
    } finally {
      setCheckingAgents(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="text-2xl">Quick Support</DialogTitle>
          <DialogDescription>
            Get instant help with AI assistance, live chat, or submit a support request
          </DialogDescription>
        </DialogHeader>

        {!checkingAgents && !agentsAvailable && (
          <Alert className="mb-4">
            <Phone className="h-4 w-4" />
            <AlertDescription>
              Our agents are currently offline. Request a callback or submit a ticket, and we'll get back to you soon!
            </AlertDescription>
          </Alert>
        )}

        <Tabs defaultValue="ai" className="flex-1 flex flex-col overflow-hidden">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="ai" className="gap-2" data-testid="tab-ai-support">
              <Bot className="h-4 w-4" />
              AI Support
            </TabsTrigger>
            <TabsTrigger value="navigation" className="gap-2" data-testid="tab-navigation">
              <HelpCircle className="h-4 w-4" />
              Help
            </TabsTrigger>
            <TabsTrigger value="chat" className="gap-2" data-testid="tab-live-chat" disabled={!agentsAvailable}>
              <MessageSquare className="h-4 w-4" />
              Live Chat
              {!agentsAvailable && <span className="text-xs">(Offline)</span>}
            </TabsTrigger>
            <TabsTrigger value="callback" className="gap-2" data-testid="tab-callback">
              <Phone className="h-4 w-4" />
              Callback
            </TabsTrigger>
            <TabsTrigger value="ticket" className="gap-2" data-testid="tab-ticket">
              <Ticket className="h-4 w-4" />
              Ticket
            </TabsTrigger>
          </TabsList>

          <div className="flex-1 overflow-hidden mt-4">
            <TabsContent value="ai" className="h-full m-0">
              <AISupportTab />
            </TabsContent>
            <TabsContent value="navigation" className="h-full m-0">
              <NavigationHelpTab />
            </TabsContent>
            <TabsContent value="chat" className="h-full m-0">
              {agentsAvailable ? (
                <LiveChatTab />
              ) : (
                <div className="h-full flex items-center justify-center">
                  <p className="text-muted-foreground">Live chat is currently unavailable</p>
                </div>
              )}
            </TabsContent>
            <TabsContent value="callback" className="h-full m-0">
              <CallbackRequestTab />
            </TabsContent>
            <TabsContent value="ticket" className="h-full m-0">
              <TicketSubmissionTab />
            </TabsContent>
          </div>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
