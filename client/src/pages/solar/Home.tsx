import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  TrendingUp,
  Users,
  Award,
  ArrowRight,
  FileText,
  Lightbulb,
  Shield,
  MessageSquare,
  Phone,
  HelpCircle,
} from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { FAQWidget } from "@/components/FAQWidget";

export default function Home() {

  const whyChooseUs = [
    {
      icon: Award,
      title: "Efficiency & Expertise",
      description: "We offer end-to-end services, including design, supply, installation, and maintenance, backed by experienced professionals in renewable energy for seamless transitions to solar power.",
    },
    {
      icon: Lightbulb,
      title: "Customized Solutions",
      description: "Our solar solutions are customized to match individual energy needs and goals, prioritizing efficiency, savings, and environmental responsibility for a tailored renewable energy solution.",
    },
    {
      icon: Shield,
      title: "Proven Track Record",
      description: "Trusted leader in renewable energy, with a track record of successful projects and satisfied customers, providing reliability and confidence to businesses and households embarking on their solar journey.",
    },
  ];

  const services = [
    {
      icon: FileText,
      title: "Best-in-class solar panels and battery storage",
      description: "Premium equipment for optimal performance",
    },
    {
      icon: Shield,
      title: "Up to 30 Years equipment guarantee",
      description: "Long-term protection for your investment",
    },
    {
      icon: TrendingUp,
      title: "Delivery across Guyana",
      description: "We deliver to any location within Guyana",
    },
  ];

  const howWeWork = [
    {
      title: "Solar Survey",
      description: "Our professional staff will visit your home or business and do a free assessment of your building and energy demands and design a system to match your needs.",
      image: "https://images.unsplash.com/photo-1508514177221-188b1cf16e9d?w=400",
    },
    {
      title: "Solar Installation",
      description: "After assessing your needs and getting the best equipment, our staff will install the system as designed and in the time that is given to our customers.",
      image: "https://images.unsplash.com/photo-1509391366360-2e959784a276?w=400",
    },
    {
      title: "Maintenance",
      description: "After completion of the system, we will continue monitoring your system to ensure that it is running smoothly.",
      image: "https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?w=400",
    },
  ];

  const faqs = [
    {
      question: "What are the benefits of switching to solar energy for my home or business?",
      answer: "Lower energy bills, environmental sustainability, and energy independence.",
    },
    {
      question: "How does solar energy work, and is it suitable for my property?",
      answer: "Solar panels convert sunlight into electricity; suitability depends on available sunlight and roof space.",
    },
    {
      question: "What factors should I consider when deciding to go solar?",
      answer: "Energy usage, financial incentives, and installation costs.",
    },
    {
      question: "How long does it take to install a solar energy system?",
      answer: "Typically a few days to a couple of weeks, depending on the size and complexity.",
    },
    {
      question: "What financing options are available?",
      answer: "Clients can obtain financing from their preferred financial institution- we will provide some documentation. Clients can also discuss options directly with us at our office.",
    },
    {
      question: "How can I determine the right size of the solar system for my needs?",
      answer: "Client may set up an inspection by contacting our office. An inspection involves our technician coming to the premises to evaluate various factors and come up with an estimated size and propose a system design.",
    },
    {
      question: "What maintenance is required for solar panels, and how often?",
      answer: "Minimal maintenance, typically cleaning panels annually and checking for debris or shading.",
    },
    {
      question: "What warranties are offered on solar panels and installation?",
      answer: "Typically we offer anywhere between 4 to 25 years warranties, depending on the product.",
    },
    {
      question: "Are there any incentives or rebates available for installing solar panels?",
      answer: "The Guyana, Power & Light offers rebates (compensation) for any excess energy produced by solar systems attached to the national grid.",
    },
    {
      question: "How does solar energy impact the environment compared to traditional energy sources?",
      answer: "Solar energy produces no greenhouse gas emissions during operation, unlike fossil fuels.",
    },
    {
      question: "What is the cost for a backup system?",
      answer: "System costs can best be determined after our technicians assess your energy needs. This is often done by an in-person inspection.",
    },
    {
      question: "Is delivery available to my location?",
      answer: "Yes, we can deliver to any location within Guyana.",
    },
    {
      question: "Can I expand my system later?",
      answer: "Yes, you can. We can design and install additions to your existing system",
    },
    {
      question: "Can you maintain a solar system that was either supplied or installed or both by another company?",
      answer: "Yes, we can!",
    },
    {
      question: "What packages do you have available?",
      answer: "We often update our packages to give our customers the best prices. Please contact our office for package information.",
    },
    {
      question: "How much will it cost to install the solar equipment?",
      answer: "Installation costs vary depending on the size of the system and the manpower required.",
    },
    {
      question: "What documentation is required to receive rebates from GEI/GPL?",
      answer: "None needed; we handle all documentation for you!",
    },
    {
      question: "How does GEI/GPL decide on compensation for surplus energy supplied to the national grid?",
      answer: "They install a meter, and we handle the necessary documentation.",
    },
    {
      question: "Do you offer installation warranty?",
      answer: "Yes!",
    },
  ];

  return (
    <div className="min-h-screen">
      <section className="relative min-h-[85vh] flex items-center justify-center bg-gradient-to-br from-primary/20 via-background to-secondary/20">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1509391366360-2e959784a276?w=1920')] bg-cover bg-center opacity-10" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
          <Badge className="mb-6 bg-primary/10 text-primary border-primary/20" variant="outline">
            Empowering Tomorrow
          </Badge>
          <h1 className="font-serif font-bold text-5xl md:text-6xl lg:text-7xl mb-6">
            Your Solar Energy
            <br />
            <span className="text-primary">Solution Provider</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
            Elevate Your Energy: Premium Renewable Solutions for Homes & Businesses in Guyana
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="#quote">
              <Button size="lg" className="text-lg px-8" data-testid="button-get-quote">
                Get Free Quote
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </a>
            <Link href="/services">
              <Button size="lg" variant="outline" className="text-lg px-8 backdrop-blur bg-background/50" data-testid="button-learn-more">
                Learn More
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <section className="py-20 bg-card">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="font-serif font-bold text-4xl mb-4">Why choose us</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {whyChooseUs.map((item) => (
              <Card key={item.title} className="hover-elevate transition-transform">
                <CardContent className="p-8 text-center">
                  <div className="h-16 w-16 rounded-lg bg-primary/10 flex items-center justify-center mb-4 mx-auto">
                    <item.icon className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="font-semibold text-xl mb-3">{item.title}</h3>
                  <p className="text-sm text-muted-foreground">{item.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section id="quote" className="py-20 bg-gradient-to-br from-secondary/5 to-primary/5">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-serif font-bold text-4xl mb-4">Elevate Your Energy: Premium Renewable Solutions for Homes & Businesses</h2>
          <p className="text-xl text-muted-foreground mb-8">Get instant support with our Quick Support system</p>
          <Card className="max-w-3xl mx-auto">
            <CardContent className="p-8">
              <div className="grid md:grid-cols-3 gap-6">
                <div className="text-center space-y-3">
                  <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
                    <MessageSquare className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="font-semibold text-lg">AI Assistant</h3>
                  <p className="text-sm text-muted-foreground">Get instant answers to your questions</p>
                </div>
                <div className="text-center space-y-3">
                  <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
                    <Users className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="font-semibold text-lg">Live Agent</h3>
                  <p className="text-sm text-muted-foreground">Chat with our solar experts</p>
                </div>
                <div className="text-center space-y-3">
                  <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
                    <Phone className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="font-semibold text-lg">Request Callback</h3>
                  <p className="text-sm text-muted-foreground">We'll call you at your preferred time</p>
                </div>
              </div>
              <p className="text-sm text-muted-foreground mt-8 mb-6">
                Click the Quick Support button below to get started. Our AI will help you, or connect you with a live agent, request a callback, or submit a support ticket.
              </p>
              <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                <HelpCircle className="h-5 w-5 text-primary" />
                <span>Look for the orange Quick Support button at the bottom right →</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="font-serif font-bold text-4xl mb-4">High tech. Hassle free.</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              From installation to maintenance, enjoy an effortless and affordable solar experience with the warranty plan solar lease.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            {services.map((service) => (
              <Card key={service.title} className="hover-elevate transition-transform">
                <CardContent className="p-6">
                  <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                    <service.icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-semibold text-lg mb-2">{service.title}</h3>
                  <p className="text-sm text-muted-foreground">{service.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="text-center">
            <Link href="/contact">
              <Button size="lg" data-testid="button-get-in-touch">
                Get in Touch
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <section className="py-20 bg-card">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="font-serif font-bold text-4xl mb-4">How we work</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {howWeWork.map((step) => (
              <Card key={step.title} className="hover-elevate transition-transform overflow-hidden">
                <div className="h-48 overflow-hidden">
                  <img
                    src={step.image}
                    alt={step.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <CardContent className="p-6">
                  <h3 className="font-semibold text-xl mb-3">{step.title}</h3>
                  <p className="text-sm text-muted-foreground">{step.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="font-serif font-bold text-4xl mb-4">FAQs</h2>
          </div>
          <Accordion type="single" collapsible className="space-y-4">
            {faqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`} className="border rounded-lg px-6">
                <AccordionTrigger className="text-left hover:no-underline">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FAQWidget />
        </div>
      </section>

      <section className="py-20 bg-gradient-to-br from-primary via-primary/90 to-secondary text-primary-foreground">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-serif font-bold text-4xl mb-4">Have Questions?</h2>
          <p className="text-xl mb-8 opacity-90">
            Talk to one of our experts
          </p>
          <Link href="/contact">
            <Button size="lg" variant="secondary" className="text-lg px-8">
              Contact Us Now
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
