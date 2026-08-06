"use client";

import { useCartStore } from "@/store/cartStore";
import Image from "next/image";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Trash2, ArrowRight, ShoppingBag } from "lucide-react";

export default function CartPage() {
  const { items, removeItem, updateQuantity, totalPrice } = useCartStore();

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      
      <main className="flex-1 max-w-[1440px] w-full mx-auto px-6 md:px-20 py-32">
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 border-b border-black/10 dark:border-white/10 pb-6">
          <h1 className="font-serif text-4xl md:text-5xl font-bold text-primary flex items-center gap-4">
            <ShoppingBag size={40} className="text-accent" />
            Your Shopping Bag
          </h1>
          <Link href="/collections" className="text-sm font-semibold uppercase tracking-widest text-foreground/50 hover:text-primary transition-colors mt-4 md:mt-0">
            Continue Shopping
          </Link>
        </div>

        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center gap-6">
            <ShoppingBag size={64} className="text-foreground/20" strokeWidth={1} />
            <p className="font-serif text-2xl text-foreground/60">Your bag is currently empty.</p>
            <Link 
              href="/collections"
              className="mt-4 px-8 py-4 bg-dark text-white font-sans font-semibold uppercase tracking-widest text-sm hover:bg-primary transition-colors shadow-ambient"
            >
              Explore Collections
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
            {/* Cart Items */}
            <div className="lg:col-span-8 flex flex-col gap-8">
              {items.map((item) => (
                <div key={item.product.id} className="flex flex-col sm:flex-row gap-6 border border-black/5 dark:border-white/5 bg-white/50 dark:bg-black/20 backdrop-blur-sm p-4 rounded-sm shadow-sm group">
                  <div className="relative w-full sm:w-32 aspect-[3/4] bg-secondary shrink-0 overflow-hidden rounded-sm">
                    <Image 
                      src={item.product.images[0]} 
                      alt={item.product.name} 
                      fill 
                      sizes="(max-width: 640px) 100vw, 128px"
                      className="object-cover transition-transform duration-700 group-hover:scale-110" 
                    />
                  </div>
                  
                  <div className="flex flex-col flex-1 justify-between py-2">
                    <div className="flex justify-between items-start gap-4">
                      <div>
                        <Link href={`/collections/${item.product.id}`} className="font-serif font-bold text-xl text-primary hover:text-accent transition-colors leading-tight">
                          {item.product.name}
                        </Link>
                        <p className="text-sm font-sans text-foreground/60 mt-1 uppercase tracking-widest">{item.product.material}</p>
                      </div>
                      <button 
                        onClick={() => removeItem(item.product.id)}
                        className="text-foreground/30 hover:text-red-500 transition-colors p-2"
                        aria-label="Remove item"
                      >
                        <Trash2 size={20} />
                      </button>
                    </div>
                    
                    <div className="flex items-center justify-between mt-6">
                      <div className="flex items-center border border-black/10 dark:border-white/10 rounded-sm">
                        <button 
                          className="px-4 py-2 hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
                          onClick={() => updateQuantity(item.product.id, Math.max(1, item.quantity - 1))}
                          aria-label="Decrease quantity"
                        >-</button>
                        <span className="px-4 py-2 font-sans text-sm">{item.quantity}</span>
                        <button 
                          className="px-4 py-2 hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
                          onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                          aria-label="Increase quantity"
                        >+</button>
                      </div>
                      <span className="font-sans font-medium text-lg">₹{item.product.price * item.quantity}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-4">
              <div className="bg-[#efe6e2] dark:bg-[#1a1a1a] p-8 rounded-sm sticky top-32 border border-[#fed488]/30 shadow-ambient">
                <h2 className="font-serif text-2xl font-bold mb-6 text-primary">Order Summary</h2>
                
                <div className="flex flex-col gap-4 font-sans text-foreground/80 mb-6">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>₹{totalPrice}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Shipping</span>
                    <span className="text-accent italic">Calculated at checkout</span>
                  </div>
                </div>

                <div className="h-px w-full bg-black/10 dark:bg-white/10 mb-6"></div>

                <div className="flex justify-between items-center mb-8">
                  <span className="font-sans font-bold text-lg">Total</span>
                  <span className="font-sans font-bold text-2xl text-primary">₹{totalPrice}</span>
                </div>

                <Link 
                  href="/checkout"
                  className="w-full py-4 bg-primary text-white font-sans font-semibold uppercase tracking-widest text-sm hover:bg-primary/90 transition-colors flex items-center justify-center gap-2 group shadow-ambient"
                >
                  Proceed to Checkout
                  <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </Link>
                
                <p className="text-xs text-center mt-4 text-foreground/50 font-sans tracking-wide">
                  Taxes and shipping calculated at checkout.
                </p>
              </div>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
