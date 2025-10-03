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
import { useToast } from "@/hooks/use-toast";
import { Phone, CheckCircle } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";

export function CallbackRequestTab() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [referenceNumber, setReferenceNumber] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    preferredTime: "",
    reason: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.email || !formData.phone || !formData.preferredTime || !formData.reason) {
      toast({
        title: "Required fields",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      const res = await apiRequest("POST", "/api/callbacks", formData);
      const response = await res.json() as { id: string };
      
      setReferenceNumber(response.id);
      setSubmitted(true);
      toast({
        title: "Callback requested",
        description: `Reference: ${response.id.slice(0, 8).toUpperCase()}. We'll call you back at your preferred time.`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to submit callback request. Please try again.",
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
        <div className="text-center space-y-3">
          <h3 className="text-xl font-semibold">Callback Request Submitted!</h3>
          <div className="bg-primary/10 border border-primary/20 rounded-lg p-4 max-w-md">
            <p className="text-sm text-muted-foreground mb-1">Reference Number</p>
            <p className="text-2xl font-mono font-bold text-primary" data-testid="text-reference-number">
              {referenceNumber.slice(0, 8).toUpperCase()}
            </p>
          </div>
          <p className="text-muted-foreground">
            Thank you! We'll call you back at {formData.preferredTime}.
          </p>
          <p className="text-sm text-muted-foreground">
            A confirmation email has been sent to <strong>{formData.email}</strong> with your reference number.
          </p>
        </div>
        <Button
          onClick={() => {
            setSubmitted(false);
            setReferenceNumber("");
            setFormData({ name: "", email: "", phone: "", preferredTime: "", reason: "" });
          }}
          data-testid="button-request-another"
        >
          Request Another Callback
        </Button>
      </div>
    );
  }

  return (
    <div className="h-[500px] overflow-y-auto pr-4">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex items-center gap-3 mb-4">
          <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
            <Phone className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h3 className="font-semibold">Request a Callback</h3>
            <p className="text-sm text-muted-foreground">
              Our agents are currently offline. We'll call you back at your preferred time.
            </p>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="callback-name">Name *</Label>
          <Input
            id="callback-name"
            placeholder="Your full name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
            data-testid="input-callback-name"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="callback-email">Email *</Label>
          <Input
            id="callback-email"
            type="email"
            placeholder="your@email.com"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            required
            data-testid="input-callback-email"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="callback-phone">Phone Number *</Label>
          <Input
            id="callback-phone"
            type="tel"
            placeholder="(555) 123-4567"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            required
            data-testid="input-callback-phone"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="callback-time">Preferred Time *</Label>
          <Select
            value={formData.preferredTime}
            onValueChange={(value) => setFormData({ ...formData, preferredTime: value })}
            required
          >
            <SelectTrigger data-testid="select-callback-time">
              <SelectValue placeholder="Select preferred time" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Morning (9AM - 12PM)">Morning (9AM - 12PM)</SelectItem>
              <SelectItem value="Afternoon (12PM - 5PM)">Afternoon (12PM - 5PM)</SelectItem>
              <SelectItem value="Evening (5PM - 8PM)">Evening (5PM - 8PM)</SelectItem>
              <SelectItem value="Anytime">Anytime</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="callback-reason">Reason for Call *</Label>
          <Textarea
            id="callback-reason"
            placeholder="Please tell us why you'd like us to call you..."
            value={formData.reason}
            onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
            required
            rows={4}
            data-testid="textarea-callback-reason"
          />
        </div>

        <Button type="submit" className="w-full" disabled={loading} data-testid="button-submit-callback">
          {loading ? "Submitting..." : "Request Callback"}
        </Button>
      </form>
    </div>
  );
}
