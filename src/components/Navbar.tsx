"use client";

import { useState, useEffect } from "react";
import { motion, useScroll, useMotionValueEvent } from "framer-motion";
import Link from "next/link";
import { Menu, X, Search, ShoppingBag } from "lucide-react";
import SmartSearch from "@/components/SmartSearch";
import { useCartStore } from "@/store/cartStore";

export default function Navbar() {
  const { scrollY } = useScroll();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const { toggleCart, totalItems } = useCartStore();

  useMotionValueEvent(scrollY, "change", (latest) => {
    setIsScrolled(latest > 50);
  });

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Collections", href: "/collections" },
    { name: "Women's Fabrics", href: "/collections?category=Womens Fabrics" },
    { name: "Lining", href: "/collections?category=Lining Materials" },
    { name: "Falls", href: "/collections?category=Falls" },
    { name: "About", href: "/about" },
    { name: "Contact", href: "/contact" },
  ];

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
      className={`fixed top-0 left-0 w-full z-50 transition-colors duration-500 ${
        isScrolled
          ? "bg-background/80 backdrop-blur-md shadow-sm border-b border-black/5 dark:border-white/5"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 h-24 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="font-serif text-4xl font-bold tracking-tight text-primary">
          JPS<span className="text-accent text-2xl">.</span>
        </Link>

        {/* Desktop Links */}
        <div className="hidden lg:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className="text-base font-medium tracking-wide uppercase hover:text-accent transition-colors"
            >
              {link.name}
            </Link>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="hidden lg:flex items-center gap-6">
          <button 
            aria-label="Search"
            onClick={() => setIsSearchOpen(true)}
            className="text-foreground hover:text-accent transition-colors"
          >
            <Search size={20} />
          </button>
          
          <button 
            aria-label="Cart"
            onClick={toggleCart}
            className="relative text-foreground hover:text-accent transition-colors"
          >
            <ShoppingBag size={20} />
            {totalItems > 0 && (
              <span className="absolute -top-2 -right-2 bg-primary text-white text-[10px] font-bold w-4 h-4 flex items-center justify-center rounded-full">
                {totalItems}
              </span>
            )}
          </button>

          <Link
            href="https://wa.me/918939695455"
            target="_blank"
            className="px-6 py-3 bg-primary text-secondary font-medium tracking-wide hover:bg-primary/90 transition-all rounded-sm shadow-lg hover:shadow-xl hover:-translate-y-0.5"
          >
            WhatsApp
          </Link>
        </div>

        {/* Mobile Actions Toggle */}
        <div className="lg:hidden flex items-center gap-4 text-foreground">
          <button aria-label="Search" onClick={() => setIsSearchOpen(true)}>
            <Search size={24} />
          </button>
          <button aria-label="Cart" onClick={toggleCart} className="relative">
            <ShoppingBag size={24} />
            {totalItems > 0 && (
              <span className="absolute -top-2 -right-2 bg-primary text-white text-[10px] font-bold w-4 h-4 flex items-center justify-center rounded-full">
                {totalItems}
              </span>
            )}
          </button>
          <button aria-label="Mobile Menu" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
            {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </div>

      {/* Smart Search Overlay */}
      <SmartSearch isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />

      {/* Mobile Menu (Simplified) */}
      {isMobileMenuOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "100vh" }}
          exit={{ opacity: 0, height: 0 }}
          className="lg:hidden bg-background absolute top-24 left-0 w-full flex flex-col items-center justify-center gap-8"
        >
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              onClick={() => setIsMobileMenuOpen(false)}
              className="text-2xl font-serif text-foreground hover:text-accent transition-colors"
            >
              {link.name}
            </Link>
          ))}
        </motion.div>
      )}
    </motion.nav>
  );
}
