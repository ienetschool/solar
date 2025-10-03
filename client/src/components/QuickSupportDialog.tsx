import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Bot, MessageSquare, Ticket, HelpCircle } from "lucide-react";
import { AISupportTab } from "./support-tabs/AISupportTab";
import { NavigationHelpTab } from "./support-tabs/NavigationHelpTab";
import { LiveChatTab } from "./support-tabs/LiveChatTab";
import { TicketSubmissionTab } from "./support-tabs/TicketSubmissionTab";

interface QuickSupportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function QuickSupportDialog({ open, onOpenChange }: QuickSupportDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="text-2xl">Quick Support</DialogTitle>
          <DialogDescription>
            Get instant help with AI assistance, live chat, or submit a support ticket
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="ai" className="flex-1 flex flex-col overflow-hidden">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="ai" className="gap-2" data-testid="tab-ai-support">
              <Bot className="h-4 w-4" />
              AI Support
            </TabsTrigger>
            <TabsTrigger value="navigation" className="gap-2" data-testid="tab-navigation">
              <HelpCircle className="h-4 w-4" />
              Navigation
            </TabsTrigger>
            <TabsTrigger value="chat" className="gap-2" data-testid="tab-live-chat">
              <MessageSquare className="h-4 w-4" />
              Live Chat
            </TabsTrigger>
            <TabsTrigger value="ticket" className="gap-2" data-testid="tab-ticket">
              <Ticket className="h-4 w-4" />
              Submit Ticket
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
              <LiveChatTab />
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
