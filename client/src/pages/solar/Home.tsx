import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Home as HomeIcon,
  Building2,
  Wrench,
  Battery,
  CheckCircle2,
  Sun,
  TrendingUp,
  Users,
  Award,
  ArrowRight,
} from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export default function Home() {
  const services = [
    {
      icon: HomeIcon,
      title: "Residential Solar",
      description: "Transform your home with clean, renewable energy. Save on electricity bills while reducing your carbon footprint.",
    },
    {
      icon: Building2,
      title: "Commercial Solar",
      description: "Power your business with sustainable energy solutions. Maximize ROI with tax incentives and energy savings.",
    },
    {
      icon: Wrench,
      title: "Solar Maintenance",
      description: "Keep your system running at peak performance with our expert maintenance and monitoring services.",
    },
    {
      icon: Battery,
      title: "Energy Storage",
      description: "Store excess energy and ensure power availability 24/7 with our advanced battery storage solutions.",
    },
  ];

  const stats = [
    { value: "5,000+", label: "Installations", icon: Sun },
    { value: "50MW", label: "Total Capacity", icon: TrendingUp },
    { value: "10,000+", label: "Happy Clients", icon: Users },
    { value: "15+", label: "Years Experience", icon: Award },
  ];

  const steps = [
    { title: "Consultation", description: "Free assessment of your energy needs and site evaluation" },
    { title: "Custom Design", description: "Tailored solar system design optimized for your property" },
    { title: "Installation", description: "Professional installation by certified technicians" },
    { title: "Activation", description: "System activation and ongoing monitoring support" },
  ];

  const faqs = [
    {
      question: "How much can I save with solar panels?",
      answer: "Most homeowners save 40-70% on their electricity bills. The exact savings depend on your location, system size, and energy consumption. Our team provides detailed savings estimates during the consultation.",
    },
    {
      question: "What incentives are available?",
      answer: "Federal tax credits cover up to 30% of installation costs. Many states offer additional rebates and incentives. We help you navigate all available programs to maximize your savings.",
    },
    {
      question: "How long does installation take?",
      answer: "Most residential installations are completed in 1-3 days. Commercial projects vary based on size. The entire process from consultation to activation typically takes 4-8 weeks.",
    },
    {
      question: "What maintenance is required?",
      answer: "Solar panels require minimal maintenance. We recommend annual inspections and occasional cleaning. Our monitoring system alerts you to any performance issues.",
    },
    {
      question: "Do solar panels work on cloudy days?",
      answer: "Yes! Solar panels still generate electricity on cloudy days, though at reduced efficiency. Modern panels are highly efficient and can produce power even in diffuse light conditions.",
    },
  ];

  return (
    <div className="min-h-screen">
      <section className="relative min-h-[85vh] flex items-center justify-center bg-gradient-to-br from-primary/20 via-background to-secondary/20">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1509391366360-2e959784a276?w=1920')] bg-cover bg-center opacity-10" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
          <Badge className="mb-6 bg-primary/10 text-primary border-primary/20" variant="outline">
            Powering a Sustainable Future
          </Badge>
          <h1 className="font-serif font-bold text-5xl md:text-6xl lg:text-7xl mb-6">
            Transform Your Energy
            <br />
            <span className="text-primary">with Solar Power</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
            Join thousands of homeowners and businesses making the switch to clean, renewable energy. Save money while protecting the planet.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/contact">
              <Button size="lg" className="text-lg px-8" data-testid="button-get-quote">
                Get Free Quote
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
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
            <h2 className="font-serif font-bold text-4xl mb-4">Our Services</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Comprehensive solar solutions tailored to your needs
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
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
        </div>
      </section>

      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="font-serif font-bold text-4xl mb-4">How It Works</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Simple steps to solar energy independence
            </p>
          </div>
          <div className="grid md:grid-cols-4 gap-8">
            {steps.map((step, index) => (
              <div key={step.title} className="text-center">
                <div className="h-16 w-16 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                  {index + 1}
                </div>
                <h3 className="font-semibold text-lg mb-2">{step.title}</h3>
                <p className="text-sm text-muted-foreground">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-primary text-primary-foreground">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            {stats.map((stat) => (
              <div key={stat.label}>
                <stat.icon className="h-8 w-8 mx-auto mb-3 opacity-90" />
                <div className="text-4xl font-bold mb-2">{stat.value}</div>
                <div className="text-sm opacity-90">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="font-serif font-bold text-4xl mb-4">Frequently Asked Questions</h2>
            <p className="text-muted-foreground">
              Get answers to common questions about solar energy
            </p>
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

      <section className="py-20 bg-gradient-to-br from-primary via-primary/90 to-secondary text-primary-foreground">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-serif font-bold text-4xl mb-4">Ready to Go Solar?</h2>
          <p className="text-xl mb-8 opacity-90">
            Get a free consultation and personalized quote today
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
