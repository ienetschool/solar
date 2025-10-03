import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Sun } from "lucide-react";
import { useLocation } from "wouter";

export default function SolarLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useAuth();
  const [, setLocation] = useLocation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await login(email, password);
    setLocation("/dashboard");
  };

  return (
    <div className="min-h-screen flex">
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-primary via-primary/90 to-secondary items-center justify-center p-12">
        <div className="text-primary-foreground max-w-md">
          <div className="h-16 w-16 rounded-2xl bg-primary-foreground/20 backdrop-blur flex items-center justify-center mb-6">
            <Sun className="h-10 w-10" />
          </div>
          <h2 className="font-serif font-bold text-4xl mb-4">
            Welcome to Your Solar Portal
          </h2>
          <p className="text-lg opacity-90">
            Access your solar dashboard to monitor energy production, track savings, manage support tickets, and connect with our expert team.
          </p>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center p-8">
        <Card className="w-full max-w-md">
          <CardHeader className="space-y-3">
            <div className="flex lg:hidden items-center gap-2 mb-2">
              <div className="h-10 w-10 rounded-lg bg-primary flex items-center justify-center">
                <Sun className="h-6 w-6 text-primary-foreground" />
              </div>
              <span className="font-serif font-bold text-xl">Green Power Solutions</span>
            </div>
            <CardTitle className="text-2xl">Sign in to your account</CardTitle>
            <CardDescription>
              Enter your credentials to access your solar dashboard
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="user@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  data-testid="input-email"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  data-testid="input-password"
                />
              </div>
              <Button type="submit" className="w-full" data-testid="button-login">
                Sign In
              </Button>
              <p className="text-sm text-center text-muted-foreground mt-4">
                Demo: Use any email to sign in
              </p>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
