import { Button } from "@/components/ui/button";
import { MessageSquare, Bot, Mail } from "lucide-react";
import { SiWhatsapp } from "react-icons/si";
import { useState } from "react";
import { AIChat } from "./AIChat";
import { LiveChatDialog } from "@/components/LiveChatDialog";

export function SupportButtons() {
  const [aiChatOpen, setAiChatOpen] = useState(false);
  const [liveChatOpen, setLiveChatOpen] = useState(false);

  const handleWhatsApp = () => {
    window.open("https://wa.me/15551234567?text=Hi, I need help with solar installation", "_blank");
  };

  const handleEmail = () => {
    window.location.href = "mailto:support@solartech.com?subject=Support Request";
  };

  return (
    <>
      <div className="flex flex-wrap gap-4 justify-center">
        <Button
          variant="outline"
          size="lg"
          className="gap-2"
          onClick={() => setLiveChatOpen(true)}
          data-testid="button-live-chat"
        >
          <MessageSquare className="h-5 w-5" />
          Live Chat
        </Button>

        <Button
          variant="outline"
          size="lg"
          className="gap-2"
          onClick={() => setAiChatOpen(true)}
          data-testid="button-ai-assistant"
        >
          <Bot className="h-5 w-5" />
          AI Assistant
        </Button>

        <Button
          variant="outline"
          size="lg"
          className="gap-2 bg-[#25D366] text-white hover:bg-[#1DA851] border-[#25D366]"
          onClick={handleWhatsApp}
          data-testid="button-whatsapp"
        >
          <SiWhatsapp className="h-5 w-5" />
          WhatsApp
        </Button>

        <Button
          variant="outline"
          size="lg"
          className="gap-2"
          onClick={handleEmail}
          data-testid="button-email-support"
        >
          <Mail className="h-5 w-5" />
          Email Support
        </Button>
      </div>

      {aiChatOpen && <AIChat />}
      <LiveChatDialog open={liveChatOpen} onOpenChange={setLiveChatOpen} />
    </>
  );
}
