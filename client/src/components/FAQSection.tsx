import { useState } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { Card } from "@/components/ui/card";

interface FAQ {
  id: string;
  question: string;
  answer: string;
  category: string;
}

export function FAQSection() {
  const [searchQuery, setSearchQuery] = useState("");

  // todo: remove mock functionality
  const faqs: FAQ[] = [
    {
      id: "1",
      question: "How do I reset my password?",
      answer:
        "You can reset your password by clicking on the 'Forgot Password' link on the login page. Follow the instructions sent to your email to create a new password.",
      category: "Account",
    },
    {
      id: "2",
      question: "How do I create a support ticket?",
      answer:
        "Navigate to the Tickets section and click the 'New Ticket' button. Fill in the required information including title, description, priority, and category. You can also attach files if needed.",
      category: "Support",
    },
    {
      id: "3",
      question: "Can I chat with a human agent?",
      answer:
        "Yes! In the chat interface, click on 'Request Agent' to switch from AI assistance to a human support agent. Agents are available during business hours.",
      category: "Support",
    },
    {
      id: "4",
      question: "How do notifications work?",
      answer:
        "You'll receive notifications via email, WhatsApp, and in-app alerts for ticket updates, new messages, and system announcements. You can customize your notification preferences in Settings.",
      category: "Features",
    },
    {
      id: "5",
      question: "What file types can I upload?",
      answer:
        "You can upload images (PNG, JPG, GIF), documents (PDF, DOC, DOCX), and other common file types up to 10MB in size. Files are securely stored and only accessible to you and assigned support agents.",
      category: "Features",
    },
  ];

  const filteredFAQs = faqs.filter(
    (faq) =>
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const categories = Array.from(new Set(faqs.map((faq) => faq.category)));

  return (
    <div className="space-y-6">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search FAQs..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-9"
          data-testid="input-search-faq"
        />
      </div>

      {categories.map((category) => {
        const categoryFAQs = filteredFAQs.filter((faq) => faq.category === category);
        if (categoryFAQs.length === 0) return null;

        return (
          <Card key={category} className="p-6">
            <h3 className="font-semibold mb-4">{category}</h3>
            <Accordion type="single" collapsible className="space-y-2">
              {categoryFAQs.map((faq) => (
                <AccordionItem key={faq.id} value={faq.id}>
                  <AccordionTrigger className="text-left">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </Card>
        );
      })}

      {filteredFAQs.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No FAQs found matching your search.</p>
        </div>
      )}
    </div>
  );
}
