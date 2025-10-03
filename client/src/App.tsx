import { Switch, Route, Redirect } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { Header } from "@/components/solar/Header";
import { Footer } from "@/components/solar/Footer";
import { AIChat } from "@/components/solar/AIChat";
import Home from "@/pages/solar/Home";
import Services from "@/pages/solar/Services";
import About from "@/pages/solar/About";
import Contact from "@/pages/solar/Contact";
import FAQPage from "@/pages/FAQPage";
import SolarLogin from "@/pages/solar/SolarLogin";
import Dashboard from "@/pages/Dashboard";
import ChatPage from "@/pages/ChatPage";
import TicketsPage from "@/pages/TicketsPage";
import UsersPage from "@/pages/UsersPage";
import NotificationsPage from "@/pages/NotificationsPage";
import NotFound from "@/pages/not-found";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { ThemeToggle } from "@/components/ThemeToggle";
import { NotificationCenter } from "@/components/NotificationCenter";
import { QuickSupportButton } from "@/components/QuickSupportButton";

function ProtectedRoute({ component: Component }: { component: () => JSX.Element }) {
  const { user } = useAuth();
  
  if (!user) {
    return <Redirect to="/login" />;
  }
  
  return <Component />;
}

function DashboardLayout() {
  const style = {
    "--sidebar-width": "16rem",
    "--sidebar-width-icon": "3rem",
  };

  return (
    <SidebarProvider style={style as React.CSSProperties}>
      <div className="flex h-screen w-full">
        <AppSidebar />
        <div className="flex flex-col flex-1 overflow-hidden">
          <header className="flex items-center justify-between p-4 border-b">
            <SidebarTrigger data-testid="button-sidebar-toggle" />
            <div className="flex items-center gap-2">
              <NotificationCenter />
              <ThemeToggle />
            </div>
          </header>
          <main className="flex-1 overflow-auto p-6">
            <Switch>
              <Route path="/dashboard" component={() => <ProtectedRoute component={Dashboard} />} />
              <Route path="/chat" component={() => <ProtectedRoute component={ChatPage} />} />
              <Route path="/tickets" component={() => <ProtectedRoute component={TicketsPage} />} />
              <Route path="/users" component={() => <ProtectedRoute component={UsersPage} />} />
              <Route path="/notifications" component={() => <ProtectedRoute component={NotificationsPage} />} />
              <Route component={NotFound} />
            </Switch>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}

function PublicLayout() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <Switch>
          <Route path="/" component={Home} />
          <Route path="/services" component={Services} />
          <Route path="/about" component={About} />
          <Route path="/faq" component={FAQPage} />
          <Route path="/contact" component={Contact} />
          <Route path="/login" component={SolarLogin} />
          <Route component={NotFound} />
        </Switch>
      </main>
      <Footer />
      <AIChat />
    </div>
  );
}

function Router() {
  const { user } = useAuth();

  return (
    <Switch>
      <Route path="/dashboard" component={DashboardLayout} />
      <Route path="/chat" component={DashboardLayout} />
      <Route path="/tickets" component={DashboardLayout} />
      <Route path="/users" component={DashboardLayout} />
      <Route path="/notifications" component={DashboardLayout} />
      <Route component={PublicLayout} />
    </Switch>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <ThemeProvider>
          <AuthProvider>
            <Router />
            <QuickSupportButton />
          </AuthProvider>
        </ThemeProvider>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}
