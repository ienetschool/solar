import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { ChevronDown, ChevronUp, HelpCircle } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface FAQItem {
  question: string;
  answer: string;
  category: string;
}

export function FAQWidget() {
  const [location] = useLocation();
  const [faqs, setFaqs] = useState<FAQItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchContextFAQs();
  }, [location]);

  const fetchContextFAQs = async () => {
    setLoading(true);
    try {
      const pathname = location.split('?')[0];
      let context = "home";
      
      if (pathname === "/" || pathname === "/home") context = "home";
      else if (pathname === "/services") context = "services";
      else if (pathname === "/about") context = "about";
      else if (pathname === "/contact") context = "contact";
      else if (pathname === "/faq") context = "faq";

      const response = await fetch(`/api/faq?context=${context}`);
      if (response.ok) {
        const data = await response.json();
        setFaqs(data.slice(0, 5));
      }
    } catch (error) {
      console.error("Failed to fetch FAQs:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading || faqs.length === 0) return null;

  return (
    <Card className="p-6 mt-12">
      <div className="flex items-center gap-3 mb-6">
        <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
          <HelpCircle className="h-5 w-5 text-primary" />
        </div>
        <div>
          <h3 className="text-xl font-semibold">Frequently Asked Questions</h3>
          <p className="text-sm text-muted-foreground">
            Common questions related to this page
          </p>
        </div>
      </div>

      <Accordion type="single" collapsible className="w-full">
        {faqs.map((faq, index) => (
          <AccordionItem key={index} value={`item-${index}`}>
            <AccordionTrigger className="text-left" data-testid={`faq-question-${index}`}>
              <div className="flex items-start gap-2">
                <span>{faq.question}</span>
                <Badge variant="outline" className="ml-auto flex-shrink-0">
                  {faq.category}
                </Badge>
              </div>
            </AccordionTrigger>
            <AccordionContent className="text-muted-foreground" data-testid={`faq-answer-${index}`}>
              {faq.answer}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </Card>
  );
}
