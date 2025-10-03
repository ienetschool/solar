import { ChatInterface } from "@/components/ChatInterface";
import { Card } from "@/components/ui/card";

export default function ChatPage() {
  return (
    <div className="h-full">
      <Card className="h-full border-0 shadow-none">
        <ChatInterface />
      </Card>
    </div>
  );
}
