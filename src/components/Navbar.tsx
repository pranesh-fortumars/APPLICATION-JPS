"use client";

import { useState, useEffect } from "react";
import { motion, useScroll, useMotionValueEvent, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { Search, ShoppingBag, User as UserIcon, LogOut, Menu, X, ChevronDown, Heart } from "lucide-react";
import SmartSearch from "@/components/SmartSearch";
import { useCartStore } from "@/store/cartStore";
import { useWishlistStore } from "@/store/wishlistStore";
import { useAuth } from "@/context/AuthContext";
import CountdownBanner from "@/components/CountdownBanner";
import Image from "next/image";

// Mega Menu Structure
const navigation = [
  {
    name: "Women",
    href: "/collections?category=Women",
    megaMenu: [
      { name: "Sarees", href: "/collections?category=Sarees" },
      { name: "Lehengas", href: "/collections?category=Lehengas" },
      { name: "Kurtis", href: "/collections?category=Kurtis" },
      { name: "Ready to Wear", href: "/collections?category=Ready+to+Wear" },
    ],
    featuredImage: "https://images.unsplash.com/photo-1583391733958-d25e07fac0ec?w=800"
  },
  {
    name: "Fabrics",
    href: "/collections?category=Fabrics",
    megaMenu: [
      { name: "Pure Silk", href: "/collections?category=Silk" },
      { name: "Cotton", href: "/collections?category=Cotton" },
      { name: "Georgette & Chiffon", href: "/collections?category=Georgette" },
      { name: "Banarasi", href: "/collections?category=Banarasi" },
      { name: "Organza", href: "/collections?category=Organza" },
      { name: "Lining & Falls", href: "/collections?category=Lining" },
    ],
    featuredImage: "https://images.unsplash.com/photo-1620799140188-3b2a02fd9a77?w=800"
  },
  {
    name: "Occasion",
    href: "/collections",
    megaMenu: [
      { name: "Bridal", href: "/collections?category=Bridal" },
      { name: "Festive Wear", href: "/collections?category=Festive" },
      { name: "Party Edit", href: "/collections?category=Party" },
      { name: "Office Wear", href: "/collections?category=Office" },
    ],
  },
  { name: "Collections", href: "/collections" },
  { name: "Trending", href: "/feed" },
  { name: "New Arrivals", href: "/collections?sort=newest" },
];

export default function Navbar() {
  const { scrollY } = useScroll();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  
  const { toggleCart, totalItems } = useCartStore();
  const { items: wishlistItems } = useWishlistStore();
  const { user, logout } = useAuth();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useMotionValueEvent(scrollY, "change", (latest) => {
    setIsScrolled(latest > 50);
  });

  return (
    <header className="fixed top-0 left-0 w-full z-50 flex flex-col group/header">
      <CountdownBanner />
      
      {/* Overlay for Mega Menu */}
      <AnimatePresence>
        {activeMenu && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/20 backdrop-blur-sm -z-10 mt-[130px]"
            onClick={() => setActiveMenu(null)}
            onMouseEnter={() => setActiveMenu(null)}
          />
        )}
      </AnimatePresence>

      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
        className={`w-full transition-all duration-500 relative ${
          isScrolled || activeMenu
            ? "bg-white shadow-sm border-b border-black/5"
            : "bg-transparent text-primary hover:bg-white"
        }`}
      >
        <div className="max-w-[1440px] mx-auto px-6 h-20 md:h-24 flex items-center justify-between">
          
          {/* Mobile Menu Toggle */}
          <button 
            className="lg:hidden p-2 -ml-2"
            onClick={() => setIsMobileMenuOpen(true)}
            aria-label="Open Menu"
          >
            <Menu size={24} />
          </button>

          {/* Logo */}
          <Link href="/" className="flex flex-col items-center justify-center relative w-32 shrink-0">
            <span className="font-script text-4xl md:text-5xl leading-none tracking-normal">JPS</span>
            <span className="font-sans text-[8px] uppercase tracking-[0.3em] opacity-60 mt-1">Boutique</span>
          </Link>

          {/* Desktop Mega Menu Navigation */}
          <div className="hidden lg:flex items-center justify-center flex-1 mx-8 h-full">
            {navigation.map((item) => (
              <div 
                key={item.name} 
                className="h-full flex items-center px-4 relative"
                onMouseEnter={() => item.megaMenu ? setActiveMenu(item.name) : setActiveMenu(null)}
              >
                <Link
                  href={item.href}
                  className={`text-xs font-bold tracking-[0.15em] uppercase transition-colors flex items-center gap-1 ${activeMenu === item.name ? 'text-accent' : 'hover:text-accent'}`}
                >
                  {item.name}
                  {item.megaMenu && <ChevronDown size={12} className={`transition-transform ${activeMenu === item.name ? 'rotate-180' : ''}`} />}
                </Link>

                {/* Mega Menu Dropdown */}
                {item.megaMenu && activeMenu === item.name && (
                  <div 
                    className="absolute top-full left-1/2 -translate-x-1/2 w-[800px] bg-white border border-black/5 shadow-2xl flex p-8 gap-8"
                    onMouseLeave={() => setActiveMenu(null)}
                  >
                    <div className="flex-1 grid grid-cols-2 gap-x-8 gap-y-4 content-start">
                      {item.megaMenu.map((subItem) => (
                        <Link 
                          key={subItem.name} 
                          href={subItem.href}
                          className="text-sm font-medium text-primary/80 hover:text-accent transition-colors"
                          onClick={() => setActiveMenu(null)}
                        >
                          {subItem.name}
                        </Link>
                      ))}
                    </div>
                    {item.featuredImage && (
                      <div className="w-64 aspect-[3/4] relative bg-secondary rounded-sm overflow-hidden shrink-0">
                        <Image src={item.featuredImage} alt={item.name} fill className="object-cover hover:scale-105 transition-transform duration-700" />
                        <div className="absolute inset-0 bg-black/20 flex items-end p-4">
                          <span className="text-white font-serif text-xl font-bold">Featured {item.name}</span>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Action Icons */}
          <div className="flex items-center gap-4 md:gap-6 shrink-0">
            <button 
              aria-label="Search"
              onClick={() => setIsSearchOpen(true)}
              className="hover:text-accent transition-colors"
            >
              <Search size={22} />
            </button>
            
            <Link href="/wishlist" className="hidden md:block hover:text-accent transition-colors relative">
              <Heart size={22} />
              {isMounted && wishlistItems.length > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-accent text-white text-[9px] font-bold w-4 h-4 flex items-center justify-center rounded-full">
                  {wishlistItems.length}
                </span>
              )}
            </Link>

            {user ? (
              <div className="relative group hidden md:flex items-center gap-2 cursor-pointer hover:text-accent transition-colors">
                <UserIcon size={22} />
                <div className="absolute top-full right-0 mt-4 w-48 bg-white border border-black/5 shadow-xl rounded-sm opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                  <div className="px-4 py-3 border-b border-black/5 text-sm font-bold truncate">
                    Hi, {user.displayName || "User"}
                  </div>
                  <Link href="/account" className="block px-4 py-2 text-sm hover:bg-black/5 transition-colors">
                    My Account
                  </Link>
                  <Link href="/orders" className="block px-4 py-2 text-sm hover:bg-black/5 transition-colors">
                    Orders & Returns
                  </Link>
                  <button 
                    onClick={logout}
                    className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors flex items-center gap-2 font-medium"
                  >
                    <LogOut size={14} /> Logout
                  </button>
                </div>
              </div>
            ) : (
              <Link href="/login" className="hidden md:block hover:text-accent transition-colors">
                <UserIcon size={22} />
              </Link>
            )}
            
            <button 
              aria-label="Cart"
              onClick={toggleCart}
              className="relative hover:text-accent transition-colors"
            >
              <ShoppingBag size={22} />
              {isMounted && totalItems > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-primary text-white text-[9px] font-bold w-4 h-4 flex items-center justify-center rounded-full shadow-md">
                  {totalItems}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Smart Search Overlay */}
        <SmartSearch isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />

        {/* Mobile Drawer Navigation */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <>
              <motion.div 
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
                onClick={() => setIsMobileMenuOpen(false)}
              />
              <motion.div
                initial={{ x: "-100%" }} animate={{ x: 0 }} exit={{ x: "-100%" }}
                transition={{ type: "spring", damping: 25, stiffness: 200 }}
                className="fixed top-0 left-0 w-[85%] max-w-[400px] h-screen bg-white z-50 flex flex-col lg:hidden overflow-y-auto"
              >
                <div className="p-6 border-b border-black/5 flex items-center justify-between sticky top-0 bg-white z-10">
                  <span className="font-script text-3xl">JPS</span>
                  <button onClick={() => setIsMobileMenuOpen(false)} className="p-2 hover:bg-black/5 rounded-full transition-colors">
                    <X size={24} />
                  </button>
                </div>
                
                <div className="flex-1 py-6 px-6 flex flex-col gap-6">
                  {navigation.map((item) => (
                    <div key={item.name} className="flex flex-col gap-3">
                      <Link 
                        href={item.href} 
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="text-lg font-bold tracking-widest uppercase flex items-center justify-between"
                      >
                        {item.name}
                      </Link>
                      {item.megaMenu && (
                        <div className="flex flex-col gap-2 pl-4 border-l-2 border-black/5">
                          {item.megaMenu.map(subItem => (
                            <Link 
                              key={subItem.name} 
                              href={subItem.href}
                              onClick={() => setIsMobileMenuOpen(false)}
                              className="text-primary/70 text-sm font-medium hover:text-accent"
                            >
                              {subItem.name}
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                <div className="p-6 border-t border-black/5 bg-secondary flex flex-col gap-4 mt-auto">
                  {user ? (
                    <>
                      <Link href="/account" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-3 font-medium uppercase text-xs tracking-widest">
                        <UserIcon size={18} /> My Account
                      </Link>
                      <Link href="/wishlist" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-3 font-medium uppercase text-xs tracking-widest">
                        <Heart size={18} /> Wishlist
                      </Link>
                      <button onClick={() => { logout(); setIsMobileMenuOpen(false); }} className="flex items-center gap-3 font-medium uppercase text-xs tracking-widest text-red-600">
                        <LogOut size={18} /> Logout
                      </button>
                    </>
                  ) : (
                    <Link href="/login" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-3 font-medium uppercase text-xs tracking-widest">
                      <UserIcon size={18} /> Login / Register
                    </Link>
                  )}
                  <Link href="https://wa.me/918939695455" className="mt-4 flex items-center justify-center gap-2 bg-[#25D366] text-white py-3 font-bold text-xs uppercase tracking-widest">
                    WhatsApp Assistance
                  </Link>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </motion.nav>
    </header>
  );
}
