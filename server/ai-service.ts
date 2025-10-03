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
      question: "What are the benefits of switching to solar energy for my home or business?",
      answer: "Lower energy bills, environmental sustainability, and energy independence are the key benefits of switching to solar energy.",
      keywords: ["benefits", "advantages", "why solar", "switch"],
      category: "general",
      context: ["home", "services"]
    },
    {
      question: "How does solar energy work, and is it suitable for my property?",
      answer: "Solar panels convert sunlight into electricity. Suitability depends on available sunlight and roof space. We can do a free assessment to determine if your property is suitable.",
      keywords: ["how", "work", "suitable", "property", "sunlight", "roof"],
      category: "general",
      context: ["home", "faq"]
    },
    {
      question: "What factors should I consider when deciding to go solar?",
      answer: "Energy usage, financial incentives, and installation costs are the main factors to consider when deciding to go solar.",
      keywords: ["factors", "consider", "decide", "think about"],
      category: "general",
      context: ["home", "faq"]
    },
    {
      question: "How long does it take to install a solar energy system?",
      answer: "Typically a few days to a couple of weeks, depending on the size and complexity of the system.",
      keywords: ["installation", "time", "how long", "duration"],
      category: "installation",
      context: ["services", "faq"]
    },
    {
      question: "What financing options are available?",
      answer: "Clients can obtain financing from their preferred financial institution - we will provide some documentation. Clients can also discuss options directly with us at our office.",
      keywords: ["financing", "payment", "loan", "afford", "options"],
      category: "financing",
      context: ["home", "services"]
    },
    {
      question: "How can I determine the right size of the solar system for my needs?",
      answer: "Client may set up an inspection by contacting our office. An inspection involves our technician coming to the premises to evaluate various factors and come up with an estimated size and propose a system design.",
      keywords: ["size", "determine", "right size", "how big", "inspection"],
      category: "sizing",
      context: ["services", "contact"]
    },
    {
      question: "What maintenance is required for solar panels, and how often?",
      answer: "Minimal maintenance is required. Typically cleaning panels annually and checking for debris or shading is sufficient.",
      keywords: ["maintenance", "cleaning", "upkeep", "service"],
      category: "maintenance",
      context: ["services", "faq"]
    },
    {
      question: "What warranties are offered on solar panels and installation?",
      answer: "Typically we offer anywhere between 4 to 25 years warranties, depending on the product.",
      keywords: ["warranty", "guarantee", "coverage"],
      category: "warranty",
      context: ["services", "faq"]
    },
    {
      question: "Are there any incentives or rebates available for installing solar panels?",
      answer: "The Guyana, Power & Light offers rebates (compensation) for any excess energy produced by solar systems attached to the national grid.",
      keywords: ["incentives", "rebates", "GPL", "GEI", "compensation"],
      category: "incentives",
      context: ["home", "faq"]
    },
    {
      question: "How does solar energy impact the environment compared to traditional energy sources?",
      answer: "Solar energy produces no greenhouse gas emissions during operation, unlike fossil fuels.",
      keywords: ["environment", "green", "eco", "emissions", "fossil fuels"],
      category: "environmental",
      context: ["home", "about"]
    },
    {
      question: "What is the cost for a backup system?",
      answer: "System costs can best be determined after our technicians assess your energy needs. This is often done by an in-person inspection.",
      keywords: ["cost", "backup", "battery", "price"],
      category: "pricing",
      context: ["services", "contact"]
    },
    {
      question: "Is delivery available to my location?",
      answer: "Yes, we can deliver to any location within Guyana.",
      keywords: ["delivery", "location", "shipping", "deliver"],
      category: "delivery",
      context: ["services", "contact"]
    },
    {
      question: "Can I expand my system later?",
      answer: "Yes, you can. We can design and install additions to your existing system.",
      keywords: ["expand", "addition", "upgrade", "increase"],
      category: "expansion",
      context: ["services", "faq"]
    },
    {
      question: "Can you maintain a solar system that was either supplied or installed or both by another company?",
      answer: "Yes, we can! We offer maintenance services for systems installed by other companies.",
      keywords: ["maintain", "other company", "third party", "existing system"],
      category: "maintenance",
      context: ["services", "contact"]
    },
    {
      question: "What packages do you have available?",
      answer: "We often update our packages to give our customers the best prices. Please contact our office for package information.",
      keywords: ["packages", "deals", "offers", "plans"],
      category: "packages",
      context: ["services", "contact"]
    },
    {
      question: "How much will it cost to install the solar equipment?",
      answer: "Installation costs vary depending on the size of the system and the manpower required.",
      keywords: ["installation cost", "install price", "labor cost"],
      category: "pricing",
      context: ["services", "contact"]
    },
    {
      question: "What documentation is required to receive rebates from GEI/GPL?",
      answer: "None needed; we handle all documentation for you!",
      keywords: ["documentation", "rebates", "GEI", "GPL", "paperwork"],
      category: "incentives",
      context: ["services", "faq"]
    },
    {
      question: "How does GEI/GPL decide on compensation for surplus energy supplied to the national grid?",
      answer: "They install a meter, and we handle the necessary documentation.",
      keywords: ["compensation", "surplus", "grid", "GEI", "GPL", "meter"],
      category: "incentives",
      context: ["services", "faq"]
    },
    {
      question: "Do you offer installation warranty?",
      answer: "Yes! We offer installation warranty.",
      keywords: ["installation warranty", "workmanship", "guarantee"],
      category: "warranty",
      context: ["services", "faq"]
    },
    {
      question: "What services do you offer?",
      answer: "We offer comprehensive solar solutions including design, supply, installation, and maintenance of solar systems. We provide best-in-class solar panels and battery storage with up to 30 years equipment guarantee. Delivery is available across Guyana.",
      keywords: ["services", "what do you offer", "provide", "solutions"],
      category: "services",
      context: ["home", "services"]
    },
    {
      question: "Tell me about the Solar Survey",
      answer: "Our professional staff will visit your home or business and do a free assessment of your building and energy demands and design a system to match your needs.",
      keywords: ["survey", "assessment", "evaluation", "free visit"],
      category: "consultation",
      context: ["services", "contact"]
    },
    {
      question: "How does the installation process work?",
      answer: "After assessing your needs and getting the best equipment, our staff will install the system as designed and in the time that is given to our customers.",
      keywords: ["installation process", "how install", "procedure"],
      category: "installation",
      context: ["services", "faq"]
    },
    {
      question: "Do you provide maintenance after installation?",
      answer: "Yes, after completion of the system, we will continue monitoring your system to ensure that it is running smoothly.",
      keywords: ["after installation", "post install", "monitoring", "ongoing"],
      category: "maintenance",
      context: ["services", "faq"]
    },
    {
      question: "How do I get started or contact you?",
      answer: "Getting started is easy! You can: 1) Schedule a free consultation using our contact form, 2) Submit a quote request, or 3) Request a personalized assessment online. Our team will assess your needs and provide a custom solution.",
      keywords: ["start", "begin", "contact", "get started", "reach you"],
      category: "getting-started",
      context: ["home", "contact"]
    }
  ];

  private greetings = [
    "Hello! I'm your Green Power Solutions AI assistant. How can I help you today?",
    "Welcome to Green Power Solutions! I'm here to answer your solar energy questions.",
    "Hi there! I'm the Green Power Solutions AI assistant. What would you like to know about solar energy?",
    "Greetings! I'm here to help you learn about our solar solutions. What can I assist you with?",
  ];

  private getRandomGreeting(): string {
    return this.greetings[Math.floor(Math.random() * this.greetings.length)];
  }

  private calculateRelevance(query: string, faq: FAQItem, context?: string): number {
    const queryLower = query.toLowerCase();
    let relevanceScore = 0;

    if (context && faq.context?.includes(context)) {
      relevanceScore += 20;
    }

    const questionWords = faq.question.toLowerCase().split(' ');
    const queryWords = queryLower.split(' ');

    for (const queryWord of queryWords) {
      if (queryWord.length < 3) continue;

      if (faq.question.toLowerCase().includes(queryWord)) {
        relevanceScore += 15;
      }

      for (const keyword of faq.keywords) {
        if (keyword.includes(queryWord) || queryWord.includes(keyword)) {
          relevanceScore += 10;
        }
      }

      for (const questionWord of questionWords) {
        if (questionWord.includes(queryWord) || queryWord.includes(questionWord)) {
          relevanceScore += 5;
        }
      }
    }

    const exactKeywordMatch = faq.keywords.some(keyword => 
      queryLower.includes(keyword) || keyword.includes(queryLower)
    );
    if (exactKeywordMatch) {
      relevanceScore += 25;
    }

    return relevanceScore;
  }

  findBestMatch(userQuery: string, context?: string): string {
    const queryLower = userQuery.toLowerCase();

    const greetingPatterns = [
      /^(hi|hello|hey|greetings|good (morning|afternoon|evening))/i,
      /^(what's up|how are you|howdy)/i,
    ];

    if (greetingPatterns.some(pattern => pattern.test(queryLower))) {
      return this.getRandomGreeting();
    }

    let contextValue = context;
    if (!contextValue) {
      if (queryLower.includes('home') || queryLower.includes('residential')) {
        contextValue = 'home';
      } else if (queryLower.includes('service')) {
        contextValue = 'services';
      } else if (queryLower.includes('contact') || queryLower.includes('reach')) {
        contextValue = 'contact';
      } else if (queryLower.includes('about') || queryLower.includes('company')) {
        contextValue = 'about';
      } else if (queryLower.includes('faq') || queryLower.includes('question')) {
        contextValue = 'faq';
      }
    }

    const scoredFAQs = this.faqDatabase.map(faq => ({
      faq,
      score: this.calculateRelevance(userQuery, faq, contextValue),
    }));

    scoredFAQs.sort((a, b) => b.score - a.score);

    if (scoredFAQs[0].score > 10) {
      return scoredFAQs[0].faq.answer;
    }

    return "I'd be happy to help you with that! For specific information about our solar solutions in Guyana, please contact our office. You can also schedule a free consultation, and our team will assess your needs and provide a custom solution. What else would you like to know about solar energy?";
  }

  getContextSuggestion(pageOrRef: string): {
    suggestion?: string;
    service?: string;
    message?: string;
  } {
    const suggestions: Record<string, { suggestion?: string; service?: string; message?: string }> = {
      '/': {
        suggestion: "I see you're interested in our solar solutions!",
        service: "general",
        message: "I'm interested in learning more about solar energy solutions for my property."
      },
      '/services': {
        suggestion: "Looking to explore our solar services?",
        service: "installation",
        message: "I'd like to know more about your solar installation services and packages."
      },
      '/about': {
        suggestion: "Want to learn more about Green Power Solutions?",
        service: "general",
        message: "I'd like to learn more about Green Power Solutions and your experience in Guyana."
      },
      '/contact': {
        suggestion: "Ready to start your solar journey?",
        service: "consultation",
        message: "I'm interested in scheduling a free solar assessment for my property."
      },
      '/faq': {
        suggestion: "Have a question not answered in our FAQ?",
        service: "general",
        message: "I have some questions about solar energy systems."
      }
    };

    return suggestions[pageOrRef] || {
      suggestion: "How can we help you go solar?",
      service: "general",
      message: "I'm interested in your solar energy solutions."
    };
  }

  getFAQsByContext(context: string): FAQItem[] {
    return this.faqDatabase.filter(faq => faq.context?.includes(context));
  }

  getFAQsByCategory(category?: string): FAQItem[] {
    if (!category) {
      return this.faqDatabase;
    }
    return this.faqDatabase.filter(faq => faq.category === category);
  }

  getCategories(): string[] {
    const categories = new Set(this.faqDatabase.map(faq => faq.category));
    return Array.from(categories);
  }
}

export const intelligentChatbot = new IntelligentChatbot();
