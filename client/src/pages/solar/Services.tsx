import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check, Home, Building2, Wrench, Battery, ArrowRight } from "lucide-react";
import { Link } from "wouter";

export default function Services() {
  const services = [
    {
      icon: Home,
      title: "Residential Solar Installation",
      description: "Comprehensive solar solutions for homeowners looking to reduce energy costs and environmental impact.",
      features: [
        "Custom system design for your home",
        "Premium solar panels with 25-year warranty",
        "Professional installation by certified technicians",
        "Net metering and grid connection setup",
        "Monitoring system for real-time performance tracking",
        "Maintenance and support packages available",
      ],
      price: "Starting at $15,000",
    },
    {
      icon: Building2,
      title: "Commercial Solar Solutions",
      description: "Scalable solar energy systems designed to meet the unique needs of businesses and commercial properties.",
      features: [
        "Large-scale system design and engineering",
        "ROI analysis and financial modeling",
        "Tax incentive and rebate consultation",
        "Minimal business disruption during installation",
        "Advanced monitoring and analytics",
        "Fleet management for multiple locations",
      ],
      price: "Custom pricing based on needs",
    },
    {
      icon: Wrench,
      title: "Solar System Maintenance",
      description: "Keep your solar investment running at peak efficiency with our comprehensive maintenance services.",
      features: [
        "Annual system inspection and cleaning",
        "Performance optimization and diagnostics",
        "Panel cleaning and debris removal",
        "Inverter and electrical system checks",
        "24/7 monitoring and alert system",
        "Priority emergency repair service",
      ],
      price: "Plans from $299/year",
    },
    {
      icon: Battery,
      title: "Energy Storage Solutions",
      description: "Store excess solar energy and ensure reliable power supply with our advanced battery systems.",
      features: [
        "Tesla Powerwall and LG Chem batteries",
        "Backup power during grid outages",
        "Time-of-use optimization",
        "Seamless integration with solar systems",
        "Smart energy management software",
        "10-year battery warranty included",
      ],
      price: "Starting at $8,500",
    },
  ];

  return (
    <div className="min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="font-serif font-bold text-5xl mb-4">Our Solar Services</h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Comprehensive solar solutions tailored to your energy needs and budget
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 mb-16">
          {services.map((service) => (
            <Card key={service.title} className="hover-elevate transition-all">
              <CardHeader>
                <div className="flex items-start gap-4">
                  <div className="h-14 w-14 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <service.icon className="h-7 w-7 text-primary" />
                  </div>
                  <div>
                    <CardTitle className="text-2xl mb-2">{service.title}</CardTitle>
                    <p className="text-muted-foreground">{service.description}</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <ul className="space-y-3">
                  {service.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
                <div className="pt-4 border-t flex items-center justify-between">
                  <p className="font-semibold text-lg">{service.price}</p>
                  <Link href="/contact">
                    <Button data-testid={`button-get-quote-${service.title.toLowerCase().replace(/\s+/g, '-')}`}>
                      Get Quote
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card className="bg-gradient-to-br from-primary via-primary/90 to-secondary text-primary-foreground">
          <CardContent className="p-12 text-center">
            <h2 className="font-serif font-bold text-3xl mb-4">
              Not sure which service is right for you?
            </h2>
            <p className="text-lg mb-6 opacity-90">
              Our solar experts are here to help you choose the perfect solution for your needs
            </p>
            <Link href="/contact">
              <Button size="lg" variant="secondary" className="text-lg px-8">
                Schedule Free Consultation
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
