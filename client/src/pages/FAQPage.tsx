import { FAQSection } from "@/components/FAQSection";

export default function FAQPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold mb-2">Frequently Asked Questions</h1>
        <p className="text-muted-foreground">
          Find answers to common questions about our support system
        </p>
      </div>

      <FAQSection />
    </div>
  );
}
