import Link from "next/link";
import { MapPin, Phone, Mail, Clock } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-secondary text-primary pt-24 pb-12 border-t border-black/5">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8 mb-16">
          
          {/* Brand Info */}
          <div className="flex flex-col">
            <Link href="/" className="flex flex-col items-start justify-center relative w-max group mb-6">
              <span className="font-script text-6xl leading-none tracking-normal text-primary">JPS</span>
              <span className="font-sans text-[10px] uppercase tracking-[0.3em] text-foreground/50 mt-1 pl-1">Boutique</span>
            </Link>
            <p className="text-primary font-sans text-base font-medium leading-relaxed mb-8 max-w-xs">
              Curating premium fabrics and exquisite textiles for women's luxury clothing. Experience the elegance of JPS Fabrics.
            </p>
            <div className="flex gap-4">
              <a href="https://instagram.com/jpsfabrics" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full border border-primary/20 flex items-center justify-center hover:bg-accent hover:border-accent hover:text-white transition-colors duration-300">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>
              </a>
              <a href="#" className="w-10 h-10 rounded-full border border-primary/20 flex items-center justify-center hover:bg-accent hover:border-accent hover:text-white transition-colors duration-300">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="flex flex-col">
            <h4 className="text-accent font-sans uppercase tracking-widest text-sm font-bold mb-6">Explore</h4>
            <div className="flex flex-col gap-4 text-base font-medium text-primary">
              <Link href="/collections" className="hover:text-accent transition-colors w-max">New Arrivals</Link>
              <Link href="/collections?category=Womens Fabrics" className="hover:text-accent transition-colors w-max">Women's Fabrics</Link>
              <Link href="/collections?category=Lining Materials" className="hover:text-accent transition-colors w-max">Lining Materials</Link>
              <Link href="/collections?category=Falls" className="hover:text-accent transition-colors w-max">Falls & Trims</Link>
              <Link href="/about" className="hover:text-accent transition-colors w-max">About the Boutique</Link>
              <Link href="/faq" className="hover:text-accent transition-colors w-max">FAQ</Link>
            </div>
          </div>

          {/* Contact */}
          <div className="flex flex-col">
            <h4 className="text-accent font-sans uppercase tracking-widest text-sm font-bold mb-6">Contact Us</h4>
            <div className="flex flex-col gap-4 text-base font-medium text-primary">
              <div className="flex items-start gap-3">
                <MapPin size={18} className="text-accent shrink-0 mt-1" />
                <span>No.347 D P.H Road,<br />Aminjikarai, Chennai - 29</span>
              </div>
              <div className="flex items-center gap-3">
                <Phone size={18} className="text-accent shrink-0" />
                <div className="flex flex-col">
                  <span>+91 89396 95455</span>
                  <span>+91 97899 93726</span>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Mail size={18} className="text-accent shrink-0" />
                <span>contact@jpsfabrics.com</span>
              </div>
            </div>
          </div>

          {/* Working Hours */}
          <div className="flex flex-col">
            <h4 className="text-accent font-sans uppercase tracking-widest text-sm font-bold mb-6">Showroom Hours</h4>
            <div className="flex flex-col gap-4 text-base font-medium text-primary">
              <div className="flex items-start gap-3">
                <Clock size={18} className="text-accent shrink-0 mt-0.5" />
                <div className="flex flex-col gap-1">
                  <div className="flex justify-between w-40">
                    <span>Mon - Sat</span>
                    <span>10:00 AM - 9:00 PM</span>
                  </div>
                  <div className="flex justify-between w-40 text-primary/70">
                    <span>Sunday</span>
                    <span>Closed</span>
                  </div>
                </div>
              </div>
              <div className="mt-4 p-4 border border-primary/20 bg-primary/10 rounded-sm">
                <p className="text-sm text-primary font-medium italic">
                  Book an exclusive appointment for tailored fabric consulting.
                </p>
                <button className="mt-3 text-accent uppercase text-xs font-bold tracking-widest border-b border-accent pb-0.5 hover:text-primary hover:border-primary transition-colors">
                  Book Visit
                </button>
              </div>
            </div>
          </div>

        </div>

        <div className="pt-8 border-t border-primary/20 flex flex-col md:flex-row items-center justify-between gap-4 text-sm font-medium text-primary/80">
          <p>© {new Date().getFullYear()} JPS Fabrics. All rights reserved.</p>
          <div className="flex gap-6">
            <Link href="/privacy" className="hover:text-primary transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-primary transition-colors">Terms of Service</Link>
            <Link href="/shipping" className="hover:text-primary transition-colors">Shipping</Link>
            <Link href="/refunds" className="hover:text-primary transition-colors">Refunds</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
