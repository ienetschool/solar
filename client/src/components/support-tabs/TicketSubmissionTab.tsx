import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { CheckCircle, Ticket as TicketIcon, AlertCircle } from "lucide-react";
import { Link } from "wouter";

export function TicketSubmissionTab() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    priority: "medium",
    email: "",
    name: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user && (!formData.email || !formData.name)) {
      toast({
        title: "Required fields",
        description: "Please provide your name and email to submit a ticket",
        variant: "destructive",
      });
      return;
    }

    if (!formData.title || !formData.description || !formData.category) {
      toast({
        title: "Required fields",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      // For demonstration, we'll show success
      // In production, this would make an API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setSubmitted(true);
      toast({
        title: "Ticket submitted",
        description: user 
          ? "Your support ticket has been created successfully"
          : "Your ticket has been submitted. Check your email for confirmation.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to submit ticket. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="flex flex-col h-[500px] justify-center items-center gap-6 px-8">
        <CheckCircle className="h-16 w-16 text-green-500" />
        <div className="text-center space-y-2">
          <h3 className="text-xl font-semibold">Ticket Submitted Successfully!</h3>
          {user ? (
            <p className="text-muted-foreground">
              Your ticket has been created. You can track it in your dashboard.
            </p>
          ) : (
            <div className="space-y-3">
              <p className="text-muted-foreground">
                We've sent a confirmation to <strong>{formData.email}</strong>
              </p>
              <div className="bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg p-4 text-sm">
                <div className="flex gap-2 items-start">
                  <AlertCircle className="h-5 w-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
                  <div className="space-y-2">
                    <p className="font-medium text-blue-900 dark:text-blue-100">
                      Create an account to track your ticket
                    </p>
                    <p className="text-blue-700 dark:text-blue-300">
                      Use the email <strong>{formData.email}</strong> when creating your account to access this ticket and all future support requests.
                    </p>
                    <Link href="/login">
                      <a>
                        <Button variant="outline" size="sm" className="mt-2">
                          Create Account / Login
                        </Button>
                      </a>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
        <Button onClick={() => setSubmitted(false)} variant="outline">
          Submit Another Ticket
        </Button>
      </div>
    );
  }

  return (
    <ScrollArea className="h-[500px] pr-4">
      <form onSubmit={handleSubmit} className="space-y-4">
        {!user && (
          <div className="bg-amber-50 dark:bg-amber-950 border border-amber-200 dark:border-amber-800 rounded-lg p-4 mb-4">
            <div className="flex gap-2 items-start">
              <TicketIcon className="h-5 w-5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
              <div className="text-sm space-y-1">
                <p className="font-medium text-amber-900 dark:text-amber-100">
                  Guest Ticket Submission
                </p>
                <p className="text-amber-700 dark:text-amber-300">
                  Submit a ticket without logging in. You can create an account later using your email to track all your tickets.
                </p>
              </div>
            </div>
          </div>
        )}

        {!user && (
          <>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="guest-ticket-name">Your Name *</Label>
                <Input
                  id="guest-ticket-name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="John Doe"
                  required
                  data-testid="input-ticket-name"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="guest-ticket-email">Your Email *</Label>
                <Input
                  id="guest-ticket-email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="john@example.com"
                  required
                  data-testid="input-ticket-email"
                />
              </div>
            </div>
          </>
        )}

        <div className="space-y-2">
          <Label htmlFor="ticket-title">Subject *</Label>
          <Input
            id="ticket-title"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            placeholder="Brief description of your issue"
            required
            data-testid="input-ticket-title"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="ticket-category">Category *</Label>
            <Select
              value={formData.category}
              onValueChange={(value) => setFormData({ ...formData, category: value })}
            >
              <SelectTrigger id="ticket-category" data-testid="select-ticket-category">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="installation">Installation</SelectItem>
                <SelectItem value="maintenance">Maintenance</SelectItem>
                <SelectItem value="billing">Billing</SelectItem>
                <SelectItem value="technical">Technical Support</SelectItem>
                <SelectItem value="general">General Inquiry</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="ticket-priority">Priority</Label>
            <Select
              value={formData.priority}
              onValueChange={(value) => setFormData({ ...formData, priority: value })}
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
        </div>

        <div className="space-y-2">
          <Label htmlFor="ticket-description">Description *</Label>
          <Textarea
            id="ticket-description"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder="Please provide detailed information about your request..."
            rows={6}
            required
            data-testid="textarea-ticket-description"
          />
        </div>

        {user && (
          <div className="bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg p-3 text-sm text-blue-700 dark:text-blue-300">
            Your ticket will be linked to your account ({user.email})
          </div>
        )}

        <Button type="submit" className="w-full" disabled={loading} data-testid="button-submit-ticket">
          {loading ? "Submitting..." : "Submit Ticket"}
        </Button>
      </form>
    </ScrollArea>
  );
}
