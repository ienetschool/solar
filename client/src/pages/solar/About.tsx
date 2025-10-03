import { Card, CardContent } from "@/components/ui/card";
import { Award, Users, Target, Heart } from "lucide-react";

export default function About() {
  const values = [
    {
      icon: Target,
      title: "Our Mission",
      description: "To accelerate the world's transition to sustainable energy by making solar power accessible, affordable, and reliable for everyone.",
    },
    {
      icon: Heart,
      title: "Our Values",
      description: "We're committed to transparency, quality craftsmanship, exceptional customer service, and environmental stewardship in everything we do.",
    },
    {
      icon: Users,
      title: "Our Team",
      description: "Over 200 certified professionals with decades of combined experience in solar installation, engineering, and customer support.",
    },
    {
      icon: Award,
      title: "Our Promise",
      description: "Industry-leading warranties, guaranteed performance, and unwavering support throughout your solar journey and beyond.",
    },
  ];

  return (
    <div className="min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1 className="font-serif font-bold text-5xl mb-4">About SolarTech</h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Leading the solar revolution since 2010
          </p>
        </div>

        <div className="mb-20">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="font-serif font-bold text-4xl mb-6">
                Powering Sustainable Futures
              </h2>
              <div className="space-y-4 text-muted-foreground">
                <p>
                  Founded in 2010, SolarTech has been at the forefront of the renewable energy revolution. What started as a small team of passionate engineers has grown into one of the most trusted solar installation companies in the nation.
                </p>
                <p>
                  With over 5,000 successful installations and counting, we've helped homeowners and businesses across the country reduce their carbon footprint while saving significantly on energy costs. Our commitment to quality, innovation, and customer satisfaction has earned us numerous industry awards and, more importantly, the trust of our clients.
                </p>
                <p>
                  We believe that clean energy should be accessible to everyone. That's why we offer flexible financing options, comprehensive warranties, and ongoing support to ensure your solar investment delivers maximum value for decades to come.
                </p>
              </div>
            </div>
            <div className="relative">
              <div className="aspect-square bg-gradient-to-br from-primary/20 to-secondary/20 rounded-2xl flex items-center justify-center">
                <div className="text-center p-8">
                  <p className="text-6xl font-bold mb-2">15+</p>
                  <p className="text-xl">Years of Excellence</p>
                  <div className="grid grid-cols-2 gap-4 mt-8">
                    <div>
                      <p className="text-3xl font-bold">5K+</p>
                      <p className="text-sm text-muted-foreground">Installations</p>
                    </div>
                    <div>
                      <p className="text-3xl font-bold">50MW</p>
                      <p className="text-sm text-muted-foreground">Total Capacity</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
          {values.map((value) => (
            <Card key={value.title} className="text-center hover-elevate transition-transform">
              <CardContent className="p-6">
                <div className="h-14 w-14 rounded-lg bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <value.icon className="h-7 w-7 text-primary" />
                </div>
                <h3 className="font-semibold text-lg mb-2">{value.title}</h3>
                <p className="text-sm text-muted-foreground">{value.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card className="bg-gradient-to-br from-primary via-primary/90 to-secondary text-primary-foreground">
          <CardContent className="p-12 text-center">
            <h2 className="font-serif font-bold text-3xl mb-4">
              Join the Solar Revolution
            </h2>
            <p className="text-lg mb-6 opacity-90 max-w-2xl mx-auto">
              Become part of a community committed to sustainable energy and a cleaner future for generations to come.
            </p>
            <div className="flex flex-wrap justify-center gap-8 text-sm">
              <div>
                <p className="text-2xl font-bold mb-1">200+</p>
                <p className="opacity-90">Team Members</p>
              </div>
              <div>
                <p className="text-2xl font-bold mb-1">10K+</p>
                <p className="opacity-90">Happy Clients</p>
              </div>
              <div>
                <p className="text-2xl font-bold mb-1">25+</p>
                <p className="opacity-90">Industry Awards</p>
              </div>
              <div>
                <p className="text-2xl font-bold mb-1">100%</p>
                <p className="opacity-90">Customer Satisfaction</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
