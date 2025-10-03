import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Label } from "@/components/ui/label";
import { Send, MessageSquare, User } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

interface Message {
  id: string;
  content: string;
  sender: string;
  isAgent: boolean;
  timestamp: Date;
}

export function LiveChatTab() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [connected, setConnected] = useState(false);
  const [guestName, setGuestName] = useState("");
  const [guestEmail, setGuestEmail] = useState("");
  const [isGuestMode, setIsGuestMode] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const connectToChat = (username: string, userId: string) => {
    const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
    const wsUrl = `${protocol}//${window.location.host}/ws`;
    const ws = new WebSocket(wsUrl);

    ws.onopen = () => {
      setConnected(true);
      ws.send(JSON.stringify({ type: "join", userId, username, isAgent: false }));
      toast({
        title: "Connected",
        description: "You're now connected to live chat",
      });
    };

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type === "message") {
        const newMessage: Message = {
          id: Date.now().toString(),
          content: data.content,
          sender: data.sender,
          isAgent: data.isAgent,
          timestamp: new Date(data.timestamp),
        };
        setMessages((prev) => [...prev, newMessage]);
      } else if (data.type === "agent_joined") {
        toast({
          title: "Agent connected",
          description: `${data.agentName} has joined the chat`,
        });
      }
    };

    ws.onclose = () => {
      setConnected(false);
      toast({
        title: "Disconnected",
        description: "Chat connection closed",
      });
    };

    ws.onerror = () => {
      setConnected(false);
      toast({
        title: "Connection error",
        description: "Failed to connect to live chat",
        variant: "destructive",
      });
    };

    setSocket(ws);
  };

  const handleGuestConnect = () => {
    if (!guestName.trim() || !guestEmail.trim()) {
      toast({
        title: "Required fields",
        description: "Please provide your name and email",
        variant: "destructive",
      });
      return;
    }

    const guestId = `guest_${Date.now()}`;
    setIsGuestMode(true);
    connectToChat(guestName, guestId);
  };

  const handleSend = () => {
    if (!input.trim() || !socket || !connected) return;

    const userId = user?.id || `guest_${Date.now()}`;
    
    socket.send(
      JSON.stringify({
        type: "message",
        content: input,
        userId,
      })
    );

    const newMessage: Message = {
      id: Date.now().toString(),
      content: input,
      sender: user?.username || guestName,
      isAgent: false,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, newMessage]);
    setInput("");
  };

  useEffect(() => {
    if (user) {
      connectToChat(user.username, user.id);
    }

    return () => {
      socket?.close();
    };
  }, [user]);

  if (!user && !isGuestMode) {
    return (
      <div className="flex flex-col h-[500px] justify-center items-center gap-6 px-8">
        <div className="text-center space-y-2">
          <MessageSquare className="h-12 w-12 mx-auto text-primary" />
          <h3 className="text-lg font-semibold">Start Live Chat</h3>
          <p className="text-sm text-muted-foreground">
            Connect with our support team in real-time. No login required!
          </p>
        </div>

        <div className="w-full max-w-sm space-y-4">
          <div className="space-y-2">
            <Label htmlFor="guest-name">Your Name</Label>
            <Input
              id="guest-name"
              value={guestName}
              onChange={(e) => setGuestName(e.target.value)}
              placeholder="John Doe"
              data-testid="input-guest-name"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="guest-email">Your Email</Label>
            <Input
              id="guest-email"
              type="email"
              value={guestEmail}
              onChange={(e) => setGuestEmail(e.target.value)}
              placeholder="john@example.com"
              data-testid="input-guest-email"
            />
          </div>

          <Button 
            onClick={handleGuestConnect} 
            className="w-full"
            data-testid="button-start-guest-chat"
          >
            Start Chat
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[500px]">
      <div className="mb-3 p-3 bg-muted rounded-lg">
        <div className="flex items-center gap-2">
          <div className={`h-2 w-2 rounded-full ${connected ? "bg-green-500" : "bg-red-500"}`} />
          <span className="text-sm text-muted-foreground">
            {connected ? "Connected to live chat" : "Connecting..."}
          </span>
        </div>
      </div>

      <ScrollArea className="flex-1 pr-4">
        <div className="space-y-4">
          {messages.length === 0 && (
            <p className="text-center text-muted-foreground py-8">
              Send a message to start the conversation
            </p>
          )}
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex gap-3 ${
                message.sender === (user?.username || guestName) ? "justify-end" : "justify-start"
              }`}
            >
              {message.sender !== (user?.username || guestName) && (
                <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <MessageSquare className="h-4 w-4 text-primary" />
                </div>
              )}
              <div
                className={`rounded-lg px-4 py-2 max-w-[80%] ${
                  message.sender === (user?.username || guestName)
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted"
                }`}
                data-testid={`chat-message-${message.id}`}
              >
                <p className="text-sm font-medium mb-1">{message.sender}</p>
                {message.content}
              </div>
              {message.sender === (user?.username || guestName) && (
                <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
                  <User className="h-4 w-4 text-primary-foreground" />
                </div>
              )}
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>

      <div className="flex gap-2 mt-4">
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your message..."
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
          disabled={!connected}
          data-testid="input-live-chat"
        />
        <Button onClick={handleSend} disabled={!connected} data-testid="button-send-chat">
          <Send className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
