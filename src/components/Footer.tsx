import { Link } from "@tanstack/react-router";
import { Instagram, Facebook, Twitter, Mail, Phone, MapPin } from "lucide-react";
import { Logo } from "./Logo";

export function Footer() {
  return (
    <footer className="mt-24 border-t border-border/60 bg-cream/60">
      <div className="container-x mx-auto grid max-w-7xl gap-12 py-16 md:grid-cols-4">
        <div>
          <Logo size={44} />
          <p className="mt-4 max-w-xs text-sm text-muted-foreground">
            Premium clothing, shoes and joy for little humans across Nigeria and beyond.
          </p>
          <div className="mt-6 flex gap-3">
            <a href="#" aria-label="Instagram" className="grid h-9 w-9 place-items-center rounded-full bg-background shadow-soft transition hover:text-primary">
              <Instagram className="h-4 w-4" />
            </a>
            <a href="#" aria-label="Facebook" className="grid h-9 w-9 place-items-center rounded-full bg-background shadow-soft transition hover:text-primary">
              <Facebook className="h-4 w-4" />
            </a>
            <a href="#" aria-label="Twitter" className="grid h-9 w-9 place-items-center rounded-full bg-background shadow-soft transition hover:text-primary">
              <Twitter className="h-4 w-4" />
            </a>
          </div>
        </div>

        <div>
          <h4 className="text-sm font-semibold uppercase tracking-widest">Shop</h4>
          <ul className="mt-4 space-y-2.5 text-sm text-muted-foreground">
            <li><Link to="/shop" className="hover:text-primary">All Products</Link></li>
            <li><Link to="/new-arrivals" className="hover:text-primary">New Arrivals</Link></li>
            <li><Link to="/sales" className="hover:text-primary">Sale</Link></li>
            <li><Link to="/category/school-wear" className="hover:text-primary">School Wear</Link></li>
            <li><Link to="/category/party-dresses" className="hover:text-primary">Party Dresses</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-semibold uppercase tracking-widest">Help</h4>
          <ul className="mt-4 space-y-2.5 text-sm text-muted-foreground">
            <li><Link to="/faq" className="hover:text-primary">FAQs</Link></li>
            <li><Link to="/track-order" className="hover:text-primary">Track Order</Link></li>
            <li><Link to="/contact" className="hover:text-primary">Contact</Link></li>
            <li><Link to="/about" className="hover:text-primary">About Us</Link></li>
            <li><Link to="/admin" className="hover:text-primary">Admin</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-semibold uppercase tracking-widest">Reach us</h4>
          <ul className="mt-4 space-y-3 text-sm text-muted-foreground">
            <li className="flex items-start gap-2"><MapPin className="mt-0.5 h-4 w-4 shrink-0" /> 24 Adeola Odeku St, Victoria Island, Lagos</li>
            <li className="flex items-start gap-2"><Phone className="mt-0.5 h-4 w-4 shrink-0" /> +234 800 000 0000</li>
            <li className="flex items-start gap-2"><Mail className="mt-0.5 h-4 w-4 shrink-0" /> hello@gyduskiddies.com</li>
          </ul>
        </div>
      </div>

      <div className="border-t border-border/60">
        <div className="container-x mx-auto flex max-w-7xl flex-col items-start justify-between gap-2 py-6 text-xs text-muted-foreground md:flex-row md:items-center">
          <p>© {new Date().getFullYear()} Gydus Kiddies. All rights reserved.</p>
          <p>Handmade with ♥ in Lagos.</p>
        </div>
      </div>
    </footer>
  );
}
