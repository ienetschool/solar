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
import { CheckCircle, Ticket as TicketIcon, AlertCircle, Upload, X, FileIcon } from "lucide-react";
import { Link } from "wouter";
import { apiRequest } from "@/lib/queryClient";

export function TicketSubmissionTab() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [referenceNumber, setReferenceNumber] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [uploadingFiles, setUploadingFiles] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    priority: "medium",
    email: "",
    name: "",
    phone: "",
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setFiles(prev => [...prev, ...newFiles]);
    }
  };

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  const uploadFiles = async (userId: string): Promise<string[]> => {
    if (files.length === 0) return [];

    const uploadedUrls: string[] = [];

    for (const file of files) {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('uploadedBy', userId);
      formData.append('relatedType', 'ticket');

      try {
        const response = await fetch('/api/files', {
          method: 'POST',
          body: formData,
        });

        if (!response.ok) {
          throw new Error('File upload failed');
        }

        const data = await response.json();
        uploadedUrls.push(data.url);
      } catch (error) {
        console.error('Error uploading file:', file.name, error);
        throw error;
      }
    }

    return uploadedUrls;
  };

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
    setUploadingFiles(true);

    try {
      // For guest users, we need a temporary user ID
      // In production, you'd create a guest user or handle this differently
      const userId = user?.id || 'guest-' + Date.now();
      
      // Upload files first
      const fileUrls = await uploadFiles(userId);
      setUploadingFiles(false);

      // Create the ticket with contact info for guest users
      const ticketData = {
        userId: userId,
        title: formData.title,
        description: formData.description,
        category: formData.category,
        priority: formData.priority,
        files: fileUrls,
        userEmail: user ? user.email : formData.email,
        userName: user ? user.name : formData.name,
        userPhone: user ? undefined : (formData.phone || undefined),
      };

      const res = await apiRequest("POST", "/api/tickets", ticketData);
      const ticket = await res.json() as { id: string };
      
      setReferenceNumber(ticket.id);
      setSubmitted(true);
      toast({
        title: "Ticket submitted",
        description: `Reference: ${ticket.id.slice(0, 8).toUpperCase()}. ${user ? 'Track it in your dashboard.' : 'Check your email for confirmation.'}`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to submit ticket. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
      setUploadingFiles(false);
    }
  };

  if (submitted) {
    return (
      <div className="flex flex-col h-[500px] justify-center items-center gap-6 px-8">
        <CheckCircle className="h-16 w-16 text-green-500" />
        <div className="text-center space-y-3">
          <h3 className="text-xl font-semibold">Ticket Submitted Successfully!</h3>
          <div className="bg-primary/10 border border-primary/20 rounded-lg p-4 max-w-md">
            <p className="text-sm text-muted-foreground mb-1">Reference Number</p>
            <p className="text-2xl font-mono font-bold text-primary" data-testid="text-ticket-reference">
              {referenceNumber.slice(0, 8).toUpperCase()}
            </p>
          </div>
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
                      <Button variant="outline" size="sm" className="mt-2" data-testid="button-create-account">
                        Create Account / Login
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
        <Button 
          onClick={() => {
            setSubmitted(false);
            setReferenceNumber("");
            setFiles([]);
            setFormData({ title: "", description: "", category: "", priority: "medium", email: "", name: "", phone: "" });
          }} 
          variant="outline"
          data-testid="button-submit-another"
        >
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

            <div className="space-y-2">
              <Label htmlFor="guest-ticket-phone">Phone Number (Optional)</Label>
              <Input
                id="guest-ticket-phone"
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="(555) 123-4567"
                data-testid="input-ticket-phone"
              />
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

        <div className="space-y-2">
          <Label htmlFor="ticket-files">Attachments (Optional)</Label>
          <div className="border-2 border-dashed border-border rounded-lg p-4 hover:border-primary/50 transition-colors">
            <Input
              id="ticket-files"
              type="file"
              multiple
              onChange={handleFileChange}
              className="hidden"
              accept="image/*,.pdf,.doc,.docx,.txt,.xls,.xlsx"
              data-testid="input-ticket-files"
            />
            <label 
              htmlFor="ticket-files" 
              className="flex flex-col items-center justify-center cursor-pointer"
            >
              <Upload className="h-8 w-8 text-muted-foreground mb-2" />
              <p className="text-sm text-muted-foreground">
                Click to upload files (images, PDFs, documents)
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Max 10MB per file
              </p>
            </label>
          </div>
          
          {files.length > 0 && (
            <div className="space-y-2 mt-3">
              {files.map((file, index) => (
                <div 
                  key={index} 
                  className="flex items-center justify-between p-2 bg-secondary rounded-lg"
                >
                  <div className="flex items-center gap-2">
                    <FileIcon className="h-4 w-4 text-primary" />
                    <span className="text-sm truncate max-w-[200px]">{file.name}</span>
                    <span className="text-xs text-muted-foreground">
                      ({(file.size / 1024).toFixed(1)}KB)
                    </span>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeFile(index)}
                    className="h-6 w-6 p-0"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>

        {user && (
          <div className="bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg p-3 text-sm text-blue-700 dark:text-blue-300">
            Your ticket will be linked to your account ({user.email})
          </div>
        )}

        <Button 
          type="submit" 
          className="w-full" 
          disabled={loading} 
          data-testid="button-submit-ticket"
        >
          {uploadingFiles ? "Uploading files..." : loading ? "Submitting..." : "Submit Ticket"}
        </Button>
      </form>
    </ScrollArea>
  );
}
