import { useState, useEffect, useRef } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useMutation, useQuery } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Send, Paperclip, X, Bot, User as UserIcon, Phone, Ticket, MessageSquare, Upload } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { nanoid } from "nanoid";

interface Message {
  id: string;
  role: "user" | "assistant" | "agent";
  content: string;
  timestamp: Date;
  files?: string[];
}

interface QuickSupportPopupProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentPage?: string;
}

export function QuickSupportPopup({ open, onOpenChange, currentPage }: QuickSupportPopupProps) {
  const [activeTab, setActiveTab] = useState("chat");
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "assistant",
      content: "Hello! I'm your AI assistant. How can I help you today? I can answer questions about our services, help you request a callback, or connect you with a live agent.",
      timestamp: new Date(),
    },
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [sessionId] = useState(() => nanoid());
  const [isConnectedToAgent, setIsConnectedToAgent] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  const { user } = useAuth();

  // Callback form state
  const [callbackForm, setCallbackForm] = useState({
    name: "",
    email: "",
    phone: "",
    preferredTime: "",
    reason: "",
  });

  // Ticket form state
  const [ticketForm, setTicketForm] = useState({
    title: "",
    description: "",
    category: "general",
    priority: "medium",
  });

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Chat mutation
  const chatMutation = useMutation({
    mutationFn: async (message: string) => {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: messages.map(m => ({ role: m.role === "assistant" ? "assistant" : "user", content: m.content })),
          context: { currentPage },
        }),
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to send message');
      }
      
      return await response.json();
    },
    onSuccess: (data: { message: string }) => {
      setMessages(prev => [
        ...prev,
        {
          id: nanoid(),
          role: "assistant",
          content: data.message,
          timestamp: new Date(),
        },
      ]);
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to send message. Please try again.",
        variant: "destructive",
      });
    },
  });

  // Callback request mutation
  const callbackMutation = useMutation({
    mutationFn: async (data: typeof callbackForm) => {
      const formData = new FormData();
      Object.entries(data).forEach(([key, value]) => {
        formData.append(key, value);
      });
      
      // Add uploaded files
      uploadedFiles.forEach((file) => {
        formData.append('files', file);
      });

      const response = await fetch("/api/callbacks", {
        method: "POST",
        body: formData,
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to submit callback request');
      }
      
      return await response.json();
    },
    onSuccess: (data: any) => {
      toast({
        title: "Callback Request Submitted",
        description: `Your reference number is ${data.id.slice(0, 8).toUpperCase()}. We'll contact you soon!`,
      });
      setCallbackForm({ name: "", email: "", phone: "", preferredTime: "", reason: "" });
      setUploadedFiles([]);
      queryClient.invalidateQueries({ queryKey: ["/api/notifications"] });
      onOpenChange(false);
    },
    onError: (error: Error) => {
      toast({
        title: "Submission Failed",
        description: error.message || "Failed to submit callback request. Please try again.",
        variant: "destructive",
      });
    },
  });

  // Ticket creation mutation
  const ticketMutation = useMutation({
    mutationFn: async (data: typeof ticketForm) => {
      const formData = new FormData();
      Object.entries(data).forEach(([key, value]) => {
        formData.append(key, value);
      });
      
      // Add uploaded files
      uploadedFiles.forEach((file) => {
        formData.append('files', file);
      });

      const response = await fetch("/api/tickets", {
        method: "POST",
        body: formData,
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to create ticket');
      }
      
      return await response.json();
    },
    onSuccess: (data: any) => {
      toast({
        title: "Ticket Created",
        description: `Your ticket #${data.id.slice(0, 8).toUpperCase()} has been created successfully.`,
      });
      setTicketForm({ title: "", description: "", category: "general", priority: "medium" });
      setUploadedFiles([]);
      queryClient.invalidateQueries({ queryKey: ["/api/tickets"] });
      queryClient.invalidateQueries({ queryKey: ["/api/notifications"] });
      onOpenChange(false);
    },
    onError: (error: Error) => {
      toast({
        title: "Creation Failed",
        description: error.message || "Failed to create ticket. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleSendMessage = () => {
    if (!inputMessage.trim()) return;

    const userMessage: Message = {
      id: nanoid(),
      role: "user",
      content: inputMessage,
      timestamp: new Date(),
      files: uploadedFiles.length > 0 ? uploadedFiles.map(f => f.name) : undefined,
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage("");
    setUploadedFiles([]);

    // Check if user is requesting agent
    if (inputMessage.toLowerCase().includes("agent") || inputMessage.toLowerCase().includes("human")) {
      setMessages(prev => [
        ...prev,
        {
          id: nanoid(),
          role: "assistant",
          content: "I'll connect you with a live agent. Please wait a moment...",
          timestamp: new Date(),
        },
      ]);
      // Simulate agent connection
      setTimeout(() => {
        setIsConnectedToAgent(true);
        setMessages(prev => [
          ...prev,
          {
            id: nanoid(),
            role: "agent",
            content: "Hello! I'm a live agent. How can I help you today?",
            timestamp: new Date(),
          },
        ]);
      }, 2000);
    } else {
      chatMutation.mutate(inputMessage);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setUploadedFiles(prev => [...prev, ...newFiles]);
    }
  };

  const handleRemoveFile = (index: number) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleCallbackSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    callbackMutation.mutate(callbackForm);
  };

  const handleTicketSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast({
        title: "Login Required",
        description: "Please log in to create a ticket.",
        variant: "destructive",
      });
      return;
    }
    ticketMutation.mutate(ticketForm);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl h-[600px] flex flex-col p-0 gap-0">
        <DialogHeader className="px-6 py-4 border-b">
          <DialogTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5 text-primary" />
            Quick Support
          </DialogTitle>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col overflow-hidden">
          <TabsList className="mx-6 mt-4 grid w-[calc(100%-3rem)] grid-cols-3" data-testid="tabs-support">
            <TabsTrigger value="chat" data-testid="tab-chat">
              <Bot className="h-4 w-4 mr-2" />
              AI Chat
            </TabsTrigger>
            <TabsTrigger value="callback" data-testid="tab-callback">
              <Phone className="h-4 w-4 mr-2" />
              Callback
            </TabsTrigger>
            <TabsTrigger value="ticket" data-testid="tab-ticket">
              <Ticket className="h-4 w-4 mr-2" />
              Submit Ticket
            </TabsTrigger>
          </TabsList>

          {/* AI Chat Tab */}
          <TabsContent value="chat" className="flex-1 flex flex-col overflow-hidden mx-6 mb-4 mt-4">
            <div className="flex-1 overflow-y-auto space-y-4 mb-4 pr-2" data-testid="chat-messages">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex gap-3 ${message.role === "user" ? "justify-end" : "justify-start"}`}
                  data-testid={`message-${message.role}`}
                >
                  {message.role !== "user" && (
                    <div className={`h-8 w-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                      message.role === "agent" ? "bg-green-500" : "bg-primary"
                    }`}>
                      {message.role === "agent" ? (
                        <UserIcon className="h-4 w-4 text-white" />
                      ) : (
                        <Bot className="h-4 w-4 text-white" />
                      )}
                    </div>
                  )}
                  <div
                    className={`max-w-[70%] rounded-lg px-4 py-2 ${
                      message.role === "user"
                        ? "bg-primary text-primary-foreground"
                        : message.role === "agent"
                        ? "bg-green-100 dark:bg-green-900 text-foreground"
                        : "bg-muted text-foreground"
                    }`}
                  >
                    <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                    {message.files && message.files.length > 0 && (
                      <div className="mt-2 text-xs opacity-80">
                        📎 {message.files.join(", ")}
                      </div>
                    )}
                  </div>
                  {message.role === "user" && (
                    <div className="h-8 w-8 rounded-full bg-secondary flex items-center justify-center flex-shrink-0">
                      <UserIcon className="h-4 w-4" />
                    </div>
                  )}
                </div>
              ))}
              {chatMutation.isPending && (
                <div className="flex gap-3 justify-start">
                  <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
                    <Bot className="h-4 w-4 text-white" />
                  </div>
                  <div className="bg-muted rounded-lg px-4 py-2">
                    <div className="flex gap-1">
                      <div className="h-2 w-2 bg-foreground/40 rounded-full animate-bounce" style={{ animationDelay: "0ms" }}></div>
                      <div className="h-2 w-2 bg-foreground/40 rounded-full animate-bounce" style={{ animationDelay: "150ms" }}></div>
                      <div className="h-2 w-2 bg-foreground/40 rounded-full animate-bounce" style={{ animationDelay: "300ms" }}></div>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* File Attachments Preview */}
            {uploadedFiles.length > 0 && (
              <div className="mb-2 flex flex-wrap gap-2" data-testid="uploaded-files">
                {uploadedFiles.map((file, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-2 bg-muted px-3 py-1 rounded-md text-sm"
                  >
                    <Paperclip className="h-3 w-3" />
                    <span className="max-w-[150px] truncate">{file.name}</span>
                    <button
                      onClick={() => handleRemoveFile(index)}
                      className="hover:text-destructive"
                      data-testid={`remove-file-${index}`}
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Chat Input */}
            <div className="flex gap-2">
              <input
                ref={fileInputRef}
                type="file"
                multiple
                className="hidden"
                onChange={handleFileSelect}
              />
              <Button
                variant="outline"
                size="icon"
                onClick={() => fileInputRef.current?.click()}
                data-testid="button-attach-file"
              >
                <Paperclip className="h-4 w-4" />
              </Button>
              <Input
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleSendMessage()}
                placeholder={isConnectedToAgent ? "Message agent..." : "Type your message..."}
                className="flex-1"
                data-testid="input-chat-message"
              />
              <Button
                onClick={handleSendMessage}
                disabled={!inputMessage.trim() || chatMutation.isPending}
                data-testid="button-send-message"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </TabsContent>

          {/* Callback Request Tab */}
          <TabsContent value="callback" className="flex-1 overflow-y-auto mx-6 mb-6 mt-4">
            <form onSubmit={handleCallbackSubmit} className="space-y-4" data-testid="form-callback">
              <div>
                <Label htmlFor="callback-name">Name *</Label>
                <Input
                  id="callback-name"
                  value={callbackForm.name}
                  onChange={(e) => setCallbackForm({ ...callbackForm, name: e.target.value })}
                  required
                  data-testid="input-callback-name"
                />
              </div>
              <div>
                <Label htmlFor="callback-email">Email *</Label>
                <Input
                  id="callback-email"
                  type="email"
                  value={callbackForm.email}
                  onChange={(e) => setCallbackForm({ ...callbackForm, email: e.target.value })}
                  required
                  data-testid="input-callback-email"
                />
              </div>
              <div>
                <Label htmlFor="callback-phone">Phone Number *</Label>
                <Input
                  id="callback-phone"
                  type="tel"
                  value={callbackForm.phone}
                  onChange={(e) => setCallbackForm({ ...callbackForm, phone: e.target.value })}
                  required
                  data-testid="input-callback-phone"
                />
              </div>
              <div>
                <Label htmlFor="callback-time">Preferred Time *</Label>
                <Input
                  id="callback-time"
                  value={callbackForm.preferredTime}
                  onChange={(e) => setCallbackForm({ ...callbackForm, preferredTime: e.target.value })}
                  placeholder="e.g., Tomorrow 2-4 PM"
                  required
                  data-testid="input-callback-time"
                />
              </div>
              <div>
                <Label htmlFor="callback-reason">Reason for Callback *</Label>
                <Textarea
                  id="callback-reason"
                  value={callbackForm.reason}
                  onChange={(e) => setCallbackForm({ ...callbackForm, reason: e.target.value })}
                  rows={4}
                  required
                  data-testid="input-callback-reason"
                />
              </div>
              <Button
                type="submit"
                className="w-full"
                disabled={callbackMutation.isPending}
                data-testid="button-submit-callback"
              >
                {callbackMutation.isPending ? "Submitting..." : "Request Callback"}
              </Button>
            </form>
          </TabsContent>

          {/* Ticket Submission Tab */}
          <TabsContent value="ticket" className="flex-1 overflow-y-auto mx-6 mb-6 mt-4">
            <form onSubmit={handleTicketSubmit} className="space-y-4" data-testid="form-ticket">
              <div>
                <Label htmlFor="ticket-title">Title *</Label>
                <Input
                  id="ticket-title"
                  value={ticketForm.title}
                  onChange={(e) => setTicketForm({ ...ticketForm, title: e.target.value })}
                  required
                  data-testid="input-ticket-title"
                />
              </div>
              <div>
                <Label htmlFor="ticket-description">Description *</Label>
                <Textarea
                  id="ticket-description"
                  value={ticketForm.description}
                  onChange={(e) => setTicketForm({ ...ticketForm, description: e.target.value })}
                  rows={4}
                  required
                  data-testid="input-ticket-description"
                />
              </div>
              <div>
                <Label htmlFor="ticket-category">Category</Label>
                <Select
                  value={ticketForm.category}
                  onValueChange={(value) => setTicketForm({ ...ticketForm, category: value })}
                >
                  <SelectTrigger id="ticket-category" data-testid="select-ticket-category">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="general">General Inquiry</SelectItem>
                    <SelectItem value="technical">Technical Support</SelectItem>
                    <SelectItem value="billing">Billing</SelectItem>
                    <SelectItem value="installation">Installation</SelectItem>
                    <SelectItem value="maintenance">Maintenance</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="ticket-priority">Priority</Label>
                <Select
                  value={ticketForm.priority}
                  onValueChange={(value) => setTicketForm({ ...ticketForm, priority: value })}
                >
                  <SelectTrigger id="ticket-priority" data-testid="select-ticket-priority">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="urgent">Urgent</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button
                type="submit"
                className="w-full"
                disabled={ticketMutation.isPending || !user}
                data-testid="button-submit-ticket"
              >
                {ticketMutation.isPending ? "Creating..." : !user ? "Login to Create Ticket" : "Create Ticket"}
              </Button>
            </form>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
