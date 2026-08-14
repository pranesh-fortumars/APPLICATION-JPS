"use client";

import { useAuth } from "@/context/AuthContext";
import { useRouter, usePathname } from "next/navigation";
import { useEffect } from "react";
import Link from "next/link";
import { LayoutDashboard, Package, ShoppingCart, PlusCircle, Settings, LogOut } from "lucide-react";
import { Loader2 } from "lucide-react";

export default function SellerLayout({ children }: { children: React.ReactNode }) {
  const { user, userProfile, loading, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!loading) {
      if (!user || (userProfile?.role !== "seller" && userProfile?.role !== "admin")) {
        router.push("/");
      }
    }
  }, [user, userProfile, loading, router]);

  if (loading || !user || (userProfile?.role !== "seller" && userProfile?.role !== "admin")) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
      </div>
    );
  }

  const navItems = [
    { label: "Dashboard", href: "/seller", icon: <LayoutDashboard size={20} /> },
    { label: "My Catalog", href: "/seller/products", icon: <Package size={20} /> },
    { label: "Add Product", href: "/seller/products/new", icon: <PlusCircle size={20} /> },
    { label: "Orders", href: "/seller/orders", icon: <ShoppingCart size={20} /> },
    { label: "Settlements", href: "/seller/settlements", icon: <IndianRupee size={20} /> },
    { label: "Settings", href: "#", icon: <Settings size={20} /> },
  ];

  return (
    <div className="flex h-screen bg-secondary/20">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-black/10 flex flex-col hidden md:flex">
        <div className="p-6 border-b border-black/10">
          <Link href="/" className="font-serif text-2xl font-bold tracking-widest text-primary block">
            JPS<span className="text-foreground">.</span>
          </Link>
          <p className="text-xs text-foreground/50 mt-1 uppercase tracking-widest font-bold">Seller Central</p>
        </div>
        
        <nav className="flex-1 p-4 space-y-2">
          {navItems.map((item) => (
            <Link 
              key={item.label}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-sm text-sm font-medium transition-colors ${
                pathname === item.href 
                  ? "bg-primary text-white" 
                  : "text-foreground/70 hover:bg-secondary hover:text-primary"
              }`}
            >
              {item.icon}
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t border-black/10">
          <div className="flex items-center gap-3 px-4 py-3 mb-2">
            <div className="w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center text-accent font-bold">
              {userProfile.displayName?.charAt(0) || "S"}
            </div>
            <div className="flex-1 overflow-hidden">
              <p className="text-sm font-bold truncate">{userProfile.displayName || "Seller"}</p>
              <p className="text-[10px] uppercase tracking-widest font-bold text-accent">Vendor</p>
            </div>
          </div>
          <button 
            onClick={logout}
            className="flex w-full items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 rounded-sm text-sm font-medium transition-colors"
          >
            <LogOut size={20} />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        <header className="h-16 bg-white border-b border-black/10 flex items-center px-8 md:hidden">
           <span className="font-serif font-bold text-lg">Seller Mobile (Use Desktop)</span>
        </header>
        <div className="flex-1 overflow-auto p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
