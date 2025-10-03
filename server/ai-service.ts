interface FAQItem {
  question: string;
  answer: string;
  keywords: string[];
  category: string;
  context?: string[];
}

interface ChatContext {
  currentPage?: string;
  userType?: string;
  previousMessages?: Array<{ role: string; content: string }>;
}

class IntelligentChatbot {
  private faqDatabase: FAQItem[] = [
    {
      question: "What is the cost of residential solar installation?",
      answer: "Our residential solar installations start at $15,000. The final cost depends on your energy needs, roof size, and system specifications. We offer federal tax credits up to 30% and various financing options to make solar affordable. I'd recommend scheduling a free consultation for a personalized quote based on your specific situation.",
      keywords: ["cost", "price", "residential", "home", "expensive", "how much", "pricing"],
      category: "pricing",
      context: ["home", "services"]
    },
    {
      question: "What is the cost of commercial solar solutions?",
      answer: "Commercial solar solutions feature custom pricing based on your business needs, facility size, and energy consumption. Our team provides comprehensive ROI analysis and financial modeling to show your potential savings. Tax incentives and rebate consultation are included. Contact us for a detailed commercial assessment.",
      keywords: ["commercial", "business", "cost", "price", "company", "enterprise"],
      category: "pricing",
      context: ["services", "about"]
    },
    {
      question: "What solar services do you offer?",
      answer: "We offer comprehensive solar solutions including: Residential solar installation (starting at $15,000), Commercial solar systems (custom pricing), Energy storage solutions (starting at $8,500), and Maintenance plans (from $299/year). Each service includes professional installation, monitoring systems, and comprehensive warranties.",
      keywords: ["services", "offer", "what do you", "provide", "available"],
      category: "services",
      context: ["home", "services"]
    },
    {
      question: "How long does installation take?",
      answer: "The typical timeline is 4-8 weeks from consultation to activation. This includes: Initial consultation and site assessment (1-2 days), System design and permits (1-2 weeks), Installation (2-5 days), Inspection and grid connection (1-2 weeks). We manage the entire process to ensure a smooth experience.",
      keywords: ["installation", "timeline", "how long", "duration", "time", "when"],
      category: "installation",
      context: ["services", "faq"]
    },
    {
      question: "What warranties do you provide?",
      answer: "We provide comprehensive warranty coverage: Solar panels come with a 25-year warranty, Battery storage systems have a 10-year warranty, and Installation workmanship is guaranteed for 10 years. All warranties are backed by our 15+ years of industry experience.",
      keywords: ["warranty", "guarantee", "coverage", "protection", "defect"],
      category: "warranty",
      context: ["services", "faq"]
    },
    {
      question: "Do you offer financing options?",
      answer: "Yes! We offer various financing options to make solar accessible: Federal tax credits up to 30%, Flexible payment plans, Low-interest solar loans, and Lease-to-own programs. Our team will help you find the best financing solution for your budget.",
      keywords: ["financing", "payment", "loan", "credit", "finance", "afford"],
      category: "financing",
      context: ["home", "services"]
    },
    {
      question: "How much can I save with solar?",
      answer: "Most homeowners save 20-50% on their electricity bills. Savings depend on your current energy usage, local electricity rates, and system size. With our energy savings calculator and federal tax credits (up to 30%), many customers see ROI within 6-8 years. We provide detailed savings projections during your free consultation.",
      keywords: ["savings", "save", "roi", "return", "benefit", "worth"],
      category: "savings",
      context: ["home", "services", "about"]
    },
    {
      question: "What is your experience and track record?",
      answer: "SolarTech has 15+ years of experience in the solar industry with 5,000+ successful installations and 50MW total capacity installed. We're a trusted leader in both residential and commercial solar solutions, committed to quality and customer satisfaction.",
      keywords: ["experience", "track record", "history", "reliable", "trust", "company"],
      category: "company",
      context: ["about", "home"]
    },
    {
      question: "Do you provide maintenance services?",
      answer: "Yes! We offer comprehensive maintenance plans starting at $299/year. This includes: Regular system inspections, Performance monitoring, Cleaning services, Priority support, and Extended warranty options. Proper maintenance ensures optimal performance and longevity.",
      keywords: ["maintenance", "service", "repair", "cleaning", "upkeep"],
      category: "maintenance",
      context: ["services", "faq"]
    },
    {
      question: "What about energy storage solutions?",
      answer: "Our energy storage solutions start at $8,500 and include: High-capacity battery systems, Backup power during outages, Peak demand management, Integration with solar panels, and 10-year warranty. Energy storage maximizes your solar investment and provides energy independence.",
      keywords: ["battery", "storage", "backup", "power", "energy storage"],
      category: "storage",
      context: ["services", "home"]
    },
    {
      question: "How do I get started?",
      answer: "Getting started is easy! You can: 1) Schedule a free consultation using our contact form, 2) Call us at (555) 123-4567, 3) Submit a ticket through our support system, or 4) Request a personalized quote online. Our team will assess your needs and provide a custom solution.",
      keywords: ["start", "begin", "how to", "get started", "first step", "contact"],
      category: "getting-started",
      context: ["home", "contact"]
    },
    {
      question: "Can I monitor my solar system?",
      answer: "Yes! All our installations include real-time monitoring systems. You can track energy production, consumption, savings, and system performance through our user-friendly dashboard. This helps you maximize efficiency and identify any issues quickly.",
      keywords: ["monitor", "tracking", "dashboard", "app", "performance", "production"],
      category: "monitoring",
      context: ["services", "faq"]
    },
    {
      question: "What happens during a consultation?",
      answer: "During your free consultation, we: Assess your energy needs and usage patterns, Evaluate your property and roof condition, Design a custom solar solution, Provide detailed cost and savings projections, Explain financing and tax incentive options, and Answer all your questions. There's no obligation!",
      keywords: ["consultation", "assessment", "evaluation", "meeting", "visit"],
      category: "consultation",
      context: ["contact", "services"]
    },
    {
      question: "Do you handle permits and paperwork?",
      answer: "Absolutely! We manage all permits, paperwork, and regulatory requirements. This includes: Local building permits, Utility interconnection agreements, Federal and state incentive applications, and HOA approvals if needed. We make the process hassle-free for you.",
      keywords: ["permit", "paperwork", "documentation", "regulations", "compliance"],
      category: "installation",
      context: ["services", "faq"]
    },
    {
      question: "What if I need support after installation?",
      answer: "We provide comprehensive post-installation support: 24/7 monitoring and alerts, Dedicated customer support team, Regular maintenance check-ups, Priority service for issues, and Lifetime technical assistance. Your satisfaction is our priority!",
      keywords: ["support", "help", "assistance", "after", "post", "problem"],
      category: "support",
      context: ["contact", "faq"]
    }
  ];

  private greetings = [
    "Hello! I'm your SolarTech AI assistant. How can I help you today?",
    "Hi there! I'm here to answer your questions about solar energy. What would you like to know?",
    "Welcome to SolarTech! I can help you with information about our solar services. What's on your mind?"
  ];

  private contextualGreetings: { [key: string]: string } = {
    "home": "Welcome to SolarTech! I see you're on our home page. I can help you learn about our solar solutions and services. What interests you?",
    "services": "I see you're exploring our services! I can provide details about residential installation, commercial solutions, energy storage, or maintenance. What would you like to know?",
    "about": "Thanks for wanting to learn more about us! I can share information about our 15+ years of experience, our track record, or our mission. What interests you?",
    "contact": "I'm here to help you get in touch! Would you like to schedule a consultation, get a quote, or ask questions about our services?",
    "faq": "I see you're looking for answers! I have detailed information about our services, pricing, installation process, and more. What question can I help with?"
  };

  private fallbackResponses = [
    "That's a great question! For detailed information specific to your situation, I'd recommend: 1) Scheduling a free consultation with our team, 2) Calling us at (555) 123-4567, or 3) Submitting a support ticket. Our experts can provide personalized guidance.",
    "I want to make sure you get accurate information. Could you rephrase your question or ask about: our services, pricing, installation process, warranties, or financing options? I'm also happy to connect you with a specialist.",
    "While I may not have that exact information, I can help you with: solar costs, installation timelines, energy savings, financing options, or warranty details. Or I can help you contact our team directly for personalized assistance."
  ];

  public getGreeting(context?: ChatContext): string {
    if (context?.currentPage && this.contextualGreetings[context.currentPage]) {
      return this.contextualGreetings[context.currentPage];
    }
    return this.greetings[Math.floor(Math.random() * this.greetings.length)];
  }

  public findBestMatch(userMessage: string, context?: ChatContext): string {
    const lowerMessage = userMessage.toLowerCase();
    
    const scores = this.faqDatabase.map(faq => {
      let score = 0;
      
      faq.keywords.forEach(keyword => {
        if (lowerMessage.includes(keyword.toLowerCase())) {
          score += 10;
        }
      });
      
      if (context?.currentPage && faq.context?.includes(context.currentPage)) {
        score += 5;
      }
      
      const questionWords = faq.question.toLowerCase().split(' ');
      const messageWords = lowerMessage.split(' ');
      questionWords.forEach(word => {
        if (messageWords.includes(word) && word.length > 3) {
          score += 2;
        }
      });
      
      return { faq, score };
    });

    scores.sort((a, b) => b.score - a.score);
    
    if (scores[0].score > 8) {
      return scores[0].faq.answer;
    }

    if (this.isGreeting(lowerMessage)) {
      return this.getGreeting(context);
    }

    if (this.isThankYou(lowerMessage)) {
      return "You're welcome! Is there anything else I can help you with about our solar services?";
    }

    return this.fallbackResponses[Math.floor(Math.random() * this.fallbackResponses.length)];
  }

  private isGreeting(message: string): boolean {
    const greetingPatterns = ['hello', 'hi', 'hey', 'good morning', 'good afternoon', 'good evening'];
    return greetingPatterns.some(pattern => message.includes(pattern));
  }

  private isThankYou(message: string): boolean {
    const thankYouPatterns = ['thank', 'thanks', 'appreciate'];
    return thankYouPatterns.some(pattern => message.includes(pattern));
  }

  public getFAQsByCategory(category?: string): FAQItem[] {
    if (category) {
      return this.faqDatabase.filter(faq => faq.category === category);
    }
    return this.faqDatabase;
  }

  public getFAQsByContext(context: string): FAQItem[] {
    return this.faqDatabase.filter(faq => faq.context?.includes(context));
  }

  public getCategories(): string[] {
    return Array.from(new Set(this.faqDatabase.map(faq => faq.category)));
  }
}

export const intelligentChatbot = new IntelligentChatbot();
