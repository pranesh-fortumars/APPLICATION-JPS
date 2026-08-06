"use client";

import { useCartStore } from "@/store/cartStore";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ShieldCheck, ChevronRight, CheckCircle2 } from "lucide-react";

export default function CheckoutPage() {
  const { items, totalPrice, clearCart } = useCartStore();
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    
    // Mock processing delay
    setTimeout(() => {
      setIsProcessing(false);
      setIsSuccess(true);
      clearCart();
    }, 2000);
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 text-center">
        <CheckCircle2 size={80} className="text-[#50C878] mb-8 animate-float" strokeWidth={1} />
        <h1 className="font-serif text-4xl md:text-5xl font-bold text-primary mb-4">Order Confirmed</h1>
        <p className="font-sans text-foreground/70 max-w-md mb-8">
          Thank you for choosing JPS Fabrics. We have received your order and will begin processing it immediately. An email confirmation has been sent to you.
        </p>
        <Link 
          href="/collections"
          className="px-8 py-4 bg-dark text-white font-sans font-semibold uppercase tracking-widest text-sm hover:bg-primary transition-colors shadow-ambient"
        >
          Return to Boutique
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col md:flex-row">
      {/* Left: Form */}
      <div className="flex-1 p-6 md:p-12 lg:p-20 order-2 md:order-1 flex flex-col">
        <div className="max-w-xl mx-auto w-full">
          {/* Header */}
          <div className="mb-12">
            <Link href="/" className="font-serif font-bold text-2xl tracking-widest text-primary block mb-6">
              JPS FABRICS
            </Link>
            <div className="flex items-center gap-2 text-xs font-sans text-foreground/50 uppercase tracking-widest">
              <Link href="/cart" className="hover:text-primary transition-colors">Cart</Link>
              <ChevronRight size={14} />
              <span className="font-bold text-primary">Information</span>
              <ChevronRight size={14} />
              <span>Shipping</span>
              <ChevronRight size={14} />
              <span>Payment</span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-8">
            {/* Contact Info */}
            <section>
              <h2 className="font-serif text-xl font-bold text-primary mb-4">Contact Information</h2>
              <div className="flex flex-col gap-4">
                <input 
                  type="email" 
                  placeholder="Email or mobile phone number" 
                  required
                  className="w-full p-4 bg-transparent border border-black/20 dark:border-white/20 rounded-sm focus:outline-none focus:border-primary transition-colors font-sans"
                />
              </div>
            </section>

            {/* Shipping Info */}
            <section>
              <h2 className="font-serif text-xl font-bold text-primary mb-4">Shipping Address</h2>
              <div className="flex flex-col gap-4">
                <div className="grid grid-cols-2 gap-4">
                  <input 
                    type="text" 
                    placeholder="First name" 
                    required
                    className="w-full p-4 bg-transparent border border-black/20 dark:border-white/20 rounded-sm focus:outline-none focus:border-primary transition-colors font-sans"
                  />
                  <input 
                    type="text" 
                    placeholder="Last name" 
                    required
                    className="w-full p-4 bg-transparent border border-black/20 dark:border-white/20 rounded-sm focus:outline-none focus:border-primary transition-colors font-sans"
                  />
                </div>
                <input 
                  type="text" 
                  placeholder="Address" 
                  required
                  className="w-full p-4 bg-transparent border border-black/20 dark:border-white/20 rounded-sm focus:outline-none focus:border-primary transition-colors font-sans"
                />
                <input 
                  type="text" 
                  placeholder="Apartment, suite, etc. (optional)" 
                  className="w-full p-4 bg-transparent border border-black/20 dark:border-white/20 rounded-sm focus:outline-none focus:border-primary transition-colors font-sans"
                />
                <div className="grid grid-cols-3 gap-4">
                  <input 
                    type="text" 
                    placeholder="City" 
                    required
                    className="w-full p-4 bg-transparent border border-black/20 dark:border-white/20 rounded-sm focus:outline-none focus:border-primary transition-colors font-sans col-span-1"
                  />
                  <select 
                    className="w-full p-4 bg-transparent border border-black/20 dark:border-white/20 rounded-sm focus:outline-none focus:border-primary transition-colors font-sans col-span-1 appearance-none"
                    required
                  >
                    <option value="" disabled selected>State</option>
                    <option value="TN">Tamil Nadu</option>
                    <option value="KL">Kerala</option>
                    <option value="KA">Karnataka</option>
                    <option value="MH">Maharashtra</option>
                    <option value="DL">Delhi</option>
                  </select>
                  <input 
                    type="text" 
                    placeholder="PIN code" 
                    required
                    className="w-full p-4 bg-transparent border border-black/20 dark:border-white/20 rounded-sm focus:outline-none focus:border-primary transition-colors font-sans col-span-1"
                  />
                </div>
              </div>
            </section>

            {/* Actions */}
            <div className="flex justify-between items-center mt-4">
              <Link href="/cart" className="text-sm font-sans text-primary hover:text-accent transition-colors">
                Return to cart
              </Link>
              <button 
                type="submit"
                disabled={isProcessing || items.length === 0}
                className="px-8 py-4 bg-primary text-white font-sans font-semibold uppercase tracking-widest text-sm hover:bg-primary/90 transition-colors shadow-ambient disabled:opacity-50 flex items-center gap-2"
              >
                {isProcessing ? "Processing..." : "Continue to Payment"}
              </button>
            </div>
          </form>

          {/* Footer */}
          <div className="mt-16 pt-6 border-t border-black/10 dark:border-white/10 flex items-center justify-between text-xs font-sans text-foreground/50">
            <p>Secure Checkout</p>
            <ShieldCheck size={16} />
          </div>
        </div>
      </div>

      {/* Right: Order Summary Sidebar */}
      <div className="flex-1 p-6 md:p-12 lg:p-20 bg-[#fbf2ed] dark:bg-[#1a1a1a] order-1 md:order-2 border-b md:border-b-0 md:border-l border-black/5 dark:border-white/5">
        <div className="max-w-md mx-auto w-full sticky top-12 flex flex-col gap-6">
          
          <div className="flex flex-col gap-4 max-h-[40vh] overflow-y-auto pr-2">
            {items.map((item) => (
              <div key={item.product.id} className="flex gap-4 items-center">
                <div className="relative w-16 h-20 bg-secondary rounded-sm overflow-hidden shrink-0 border border-black/10 dark:border-white/10">
                  <Image 
                    src={item.product.images[0]} 
                    alt={item.product.name} 
                    fill 
                    sizes="64px"
                    className="object-cover" 
                  />
                  <span className="absolute -top-2 -right-2 bg-primary text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full z-10">
                    {item.quantity}
                  </span>
                </div>
                <div className="flex-1 flex flex-col">
                  <span className="font-serif font-bold text-primary line-clamp-1">{item.product.name}</span>
                  <span className="text-xs text-foreground/50 uppercase tracking-widest font-sans">{item.product.material}</span>
                </div>
                <span className="font-sans font-medium">₹{item.product.price * item.quantity}</span>
              </div>
            ))}
          </div>

          <div className="h-px w-full bg-black/10 dark:bg-white/10"></div>

          <div className="flex gap-2">
            <input 
              type="text" 
              placeholder="Discount code" 
              className="flex-1 p-4 bg-transparent border border-black/20 dark:border-white/20 rounded-sm focus:outline-none focus:border-primary transition-colors font-sans"
            />
            <button className="px-6 bg-black/10 dark:bg-white/10 text-foreground font-sans font-semibold uppercase tracking-widest text-sm hover:bg-black/20 transition-colors rounded-sm">
              Apply
            </button>
          </div>

          <div className="h-px w-full bg-black/10 dark:bg-white/10"></div>

          <div className="flex flex-col gap-2 font-sans text-sm text-foreground/70">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>₹{totalPrice}</span>
            </div>
            <div className="flex justify-between">
              <span>Shipping</span>
              <span className="text-xs">Calculated at next step</span>
            </div>
          </div>

          <div className="h-px w-full bg-black/10 dark:bg-white/10"></div>

          <div className="flex justify-between items-end">
            <span className="font-sans font-bold text-lg">Total</span>
            <span className="font-sans font-bold text-3xl text-primary">
              <span className="text-sm font-normal text-foreground/50 mr-1">INR</span>
              ₹{totalPrice}
            </span>
          </div>

        </div>
      </div>
    </div>
  );
}
