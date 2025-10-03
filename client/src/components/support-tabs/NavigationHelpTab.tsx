import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Home, Lightbulb, Info, Phone, HelpCircle, LogIn, LayoutDashboard } from "lucide-react";
import { Link } from "wouter";

export function NavigationHelpTab() {
  const navigationSections = [
    {
      title: "Public Pages",
      items: [
        {
          icon: Home,
          name: "Home",
          path: "/",
          description: "Our main landing page with company overview",
        },
        {
          icon: Lightbulb,
          name: "Services",
          path: "/services",
          description: "Explore our solar installation and energy services",
        },
        {
          icon: Info,
          name: "About Us",
          path: "/about",
          description: "Learn about our company and mission",
        },
        {
          icon: Phone,
          name: "Contact",
          path: "/contact",
          description: "Get in touch with our team",
        },
        {
          icon: HelpCircle,
          name: "FAQ",
          path: "/faq",
          description: "Find answers to common questions",
        },
      ],
    },
    {
      title: "Account & Support",
      items: [
        {
          icon: LogIn,
          name: "Login",
          path: "/login",
          description: "Access your solar dashboard and support tickets",
        },
        {
          icon: LayoutDashboard,
          name: "Dashboard",
          path: "/dashboard",
          description: "View your account, tickets, and notifications (requires login)",
        },
      ],
    },
  ];

  return (
    <ScrollArea className="h-[500px] pr-4">
      <div className="space-y-6">
        <p className="text-muted-foreground">
          Navigate our website easily with these quick links and descriptions
        </p>

        {navigationSections.map((section) => (
          <div key={section.title}>
            <h3 className="font-semibold mb-3">{section.title}</h3>
            <div className="grid gap-3">
              {section.items.map((item) => (
                <Link key={item.path} href={item.path}>
                  <a>
                    <Card className="hover-elevate cursor-pointer" data-testid={`nav-link-${item.name.toLowerCase().replace(/\s+/g, '-')}`}>
                      <CardHeader className="p-4">
                        <div className="flex items-start gap-3">
                          <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                            <item.icon className="h-5 w-5 text-primary" />
                          </div>
                          <div className="flex-1">
                            <CardTitle className="text-base">{item.name}</CardTitle>
                            <CardDescription className="text-sm mt-1">
                              {item.description}
                            </CardDescription>
                          </div>
                        </div>
                      </CardHeader>
                    </Card>
                  </a>
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>
    </ScrollArea>
  );
}
