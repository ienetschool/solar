import { Link } from "wouter";
import { Sun, Mail, Phone, MapPin, Facebook, Twitter, Linkedin, Instagram } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SupportButtons } from "./SupportButtons";

export function Footer() {
  return (
    <footer className="bg-card border-t">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="h-9 w-9 rounded-lg bg-primary flex items-center justify-center">
                <Sun className="h-6 w-6 text-primary-foreground" />
              </div>
              <span className="font-serif font-bold text-xl">SolarTech</span>
            </div>
            <p className="text-sm text-muted-foreground mb-4">
              Empowering homes and businesses with sustainable solar energy solutions since 2010.
            </p>
            <div className="flex gap-2">
              <Button variant="outline" size="icon" className="h-8 w-8">
                <Facebook className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon" className="h-8 w-8">
                <Twitter className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon" className="h-8 w-8">
                <Linkedin className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon" className="h-8 w-8">
                <Instagram className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Services</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/services"><a className="text-muted-foreground hover:text-foreground">Residential Solar</a></Link></li>
              <li><Link href="/services"><a className="text-muted-foreground hover:text-foreground">Commercial Solar</a></Link></li>
              <li><Link href="/services"><a className="text-muted-foreground hover:text-foreground">Solar Maintenance</a></Link></li>
              <li><Link href="/services"><a className="text-muted-foreground hover:text-foreground">Energy Storage</a></Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Company</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/about"><a className="text-muted-foreground hover:text-foreground">About Us</a></Link></li>
              <li><Link href="/faq"><a className="text-muted-foreground hover:text-foreground">FAQ</a></Link></li>
              <li><Link href="/contact"><a className="text-muted-foreground hover:text-foreground">Contact</a></Link></li>
              <li><Link href="/dashboard"><a className="text-muted-foreground hover:text-foreground">Support Portal</a></Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Contact Info</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-2">
                <MapPin className="h-4 w-4 mt-0.5 text-muted-foreground" />
                <span className="text-muted-foreground">123 Solar Street, Green City, CA 90210</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">(555) 123-4567</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">info@solartech.com</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t pt-8">
          <div className="mb-8">
            <h3 className="font-semibold text-center mb-4">Get Support</h3>
            <SupportButtons />
          </div>

          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-muted-foreground">
              © 2024 SolarTech. All rights reserved.
            </p>
            <div className="flex gap-6 text-sm text-muted-foreground">
              <a href="#" className="hover:text-foreground">Privacy Policy</a>
              <a href="#" className="hover:text-foreground">Terms of Service</a>
              <a href="#" className="hover:text-foreground">Cookie Policy</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
