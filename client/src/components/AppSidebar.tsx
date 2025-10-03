import {
  LayoutDashboard,
  MessageSquare,
  Ticket,
  HelpCircle,
  Users,
  Settings,
  Bell,
  Phone,
  FileText,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
} from "@/components/ui/sidebar";
import { useAuth } from "@/contexts/AuthContext";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";

export function AppSidebar() {
  const { user, logout } = useAuth();
  const [location, setLocation] = useLocation();

  const userItems = [
    { title: "Dashboard", url: "/dashboard", icon: LayoutDashboard },
    { title: "Live Chat", url: "/chat", icon: MessageSquare },
    { title: "My Tickets", url: "/tickets", icon: Ticket },
    { title: "FAQ", url: "/faq", icon: HelpCircle },
    { title: "Notifications", url: "/notifications", icon: Bell },
  ];

  const agentItems = [
    { title: "Dashboard", url: "/dashboard", icon: LayoutDashboard },
    { title: "Chat Queue", url: "/chat", icon: MessageSquare },
    { title: "Ticket Queue", url: "/tickets", icon: Ticket },
    { title: "Callbacks", url: "/callbacks", icon: Phone },
    { title: "FAQ", url: "/faq", icon: HelpCircle },
  ];

  const adminItems = [
    { title: "Dashboard", url: "/dashboard", icon: LayoutDashboard },
    { title: "Live Chat", url: "/chat", icon: MessageSquare },
    { title: "Tickets", url: "/tickets", icon: Ticket },
    { title: "Callbacks", url: "/callbacks", icon: Phone },
    { title: "Users", url: "/users", icon: Users },
    { title: "Content", url: "/content", icon: FileText },
    { title: "FAQ", url: "/faq", icon: HelpCircle },
    { title: "Settings", url: "/settings", icon: Settings },
  ];

  const items =
    user?.role === "admin"
      ? adminItems
      : user?.role === "agent"
      ? agentItems
      : userItems;

  return (
    <Sidebar>
      <SidebarHeader className="p-4 border-b border-sidebar-border">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-md bg-primary flex items-center justify-center">
            <MessageSquare className="h-5 w-5 text-primary-foreground" />
          </div>
          <div>
            <h2 className="font-semibold text-sm">AI Support</h2>
            <p className="text-xs text-muted-foreground">
              {user?.role === "admin"
                ? "Admin Panel"
                : user?.role === "agent"
                ? "Agent Portal"
                : "Support Portal"}
            </p>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    onClick={() => setLocation(item.url)}
                    isActive={location === item.url}
                    data-testid={`link-${item.title.toLowerCase().replace(" ", "-")}`}
                  >
                    <item.icon className="h-4 w-4" />
                    <span>{item.title}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-4 border-t border-sidebar-border">
        <div className="flex items-center gap-3">
          <Avatar className="h-8 w-8">
            <AvatarFallback>
              {user?.name?.charAt(0).toUpperCase() || "U"}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">{user?.name}</p>
            <p className="text-xs text-muted-foreground capitalize">{user?.role}</p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={logout}
            data-testid="button-logout"
          >
            Logout
          </Button>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
