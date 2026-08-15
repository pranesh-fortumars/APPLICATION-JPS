"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, Trash2, ShoppingBag } from "lucide-react";
import { useCartStore } from "@/store/cartStore";
import Image from "next/image";
import Link from "next/link";

export default function MiniCart() {
  const { items, isOpen, toggleCart, removeItem, updateQuantity, totalPrice } = useCartStore();

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[110] flex justify-end">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={toggleCart}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />

          {/* Cart Drawer */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "tween", duration: 0.4, ease: "anticipate" }}
            className="relative w-full max-w-md bg-background h-full shadow-2xl flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-black/10 dark:border-white/10">
              <h2 className="font-serif text-2xl font-bold flex items-center gap-3">
                <ShoppingBag />
                Your Bag
              </h2>
              <button onClick={toggleCart} className="p-2 hover:bg-black/5 dark:hover:bg-white/5 rounded-full transition-colors">
                <X size={24} />
              </button>
            </div>

            {/* Cart Items */}
            <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-6 hide-scrollbar">
              {/* Free Shipping Progress */}
              {items.length > 0 && (
                <div className="bg-secondary/50 p-4 rounded-sm border border-black/5 mb-2">
                  <p className="text-xs font-bold uppercase tracking-widest text-primary mb-2 text-center">
                    {totalPrice >= 5000 
                      ? "✨ You've unlocked Free Shipping!" 
                      : `Add ₹${(5000 - totalPrice).toLocaleString()} more for Free Shipping`}
                  </p>
                  <div className="w-full bg-black/10 h-1.5 rounded-full overflow-hidden">
                    <div 
                      className="bg-primary h-full transition-all duration-500 ease-out"
                      style={{ width: `${Math.min(100, (totalPrice / 5000) * 100)}%` }}
                    />
                  </div>
                </div>
              )}

              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-foreground/50 gap-4">
                  <ShoppingBag size={48} strokeWidth={1} />
                  <p className="font-serif text-xl">Your bag is empty.</p>
                  <button onClick={toggleCart} className="mt-4 text-primary underline text-sm font-semibold uppercase tracking-widest">
                    Continue Shopping
                  </button>
                </div>
              ) : (
                items.map((item) => {
                  const itemPrice = item.selectedVariant ? item.selectedVariant.price : item.product.price;
                  const itemId = item.selectedVariant ? item.selectedVariant.sku : item.product.id;
                  return (
                    <div key={itemId} className="flex gap-4 border-b border-black/5 dark:border-white/5 pb-6">
                      <div className="relative w-24 h-32 bg-secondary shrink-0 overflow-hidden">
                        <Image src={item.product.images[0]} alt={item.product.name} fill sizes="96px" className="object-cover" />
                      </div>
                      <div className="flex flex-col flex-1 py-1">
                        <div className="flex justify-between items-start gap-2">
                          <h3 className="font-serif font-bold text-lg leading-tight line-clamp-2">
                            {item.product.name}
                          </h3>
                          <button 
                            onClick={() => removeItem(itemId)}
                            className="text-foreground/40 hover:text-red-500 transition-colors"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                        <p className="text-sm text-foreground/60 mt-1">
                          {item.selectedVariant ? `Color: ${item.selectedVariant.color}` : item.product.material}
                        </p>
                        
                        <div className="mt-auto flex items-center justify-between">
                          <div className="flex items-center border border-black/10">
                            <button 
                              className="px-3 py-1 hover:bg-black/5 disabled:opacity-30 disabled:cursor-not-allowed"
                              disabled={item.quantity <= 1}
                              onClick={() => updateQuantity(itemId, Math.max(1.0, item.quantity - 0.5))}
                            >-</button>
                            <span className="px-3 py-1 text-sm w-12 text-center font-bold">{item.quantity.toFixed(1)}m</span>
                            <button 
                              className="px-3 py-1 hover:bg-black/5"
                              onClick={() => updateQuantity(itemId, item.quantity + 0.5)}
                            >+</button>
                          </div>
                          <span className="font-semibold text-primary">₹{(itemPrice * item.quantity).toLocaleString()}</span>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}

              {/* Cross-Sells (Static Mock for UX) */}
              {items.length > 0 && (
                <div className="mt-4 border-t border-black/5 pt-6">
                  <p className="text-xs font-bold uppercase tracking-widest text-primary/70 mb-4">You May Also Like</p>
                  <div className="flex gap-4 overflow-x-auto hide-scrollbar pb-4">
                    {/* Mock Item 1 */}
                    <div className="min-w-[120px] flex flex-col gap-2">
                      <div className="relative aspect-[3/4] bg-secondary w-full">
                        <Image src="https://images.unsplash.com/photo-1583391733958-d25e07fac0ec?w=400" alt="Lining" fill className="object-cover" />
                      </div>
                      <p className="text-xs font-bold font-serif line-clamp-1">Premium Crepe Lining</p>
                      <p className="text-xs text-accent">₹150 /m</p>
                    </div>
                    {/* Mock Item 2 */}
                    <div className="min-w-[120px] flex flex-col gap-2">
                      <div className="relative aspect-[3/4] bg-secondary w-full">
                        <Image src="https://images.unsplash.com/photo-1620799140188-3b2a02fd9a77?w=400" alt="Fall" fill className="object-cover" />
                      </div>
                      <p className="text-xs font-bold font-serif line-clamp-1">Matching Saree Fall</p>
                      <p className="text-xs text-accent">₹80 /pc</p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="p-6 border-t border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/5">
                <div className="flex justify-between items-center mb-6 text-lg font-semibold">
                  <span className="font-serif">Subtotal</span>
                  <span className="text-primary">₹{totalPrice}</span>
                </div>
                <Link 
                  href="/checkout"
                  onClick={toggleCart}
                  className="w-full flex justify-center py-4 bg-primary text-white uppercase tracking-widest text-sm font-bold hover:bg-primary/90 transition-colors"
                >
                  Proceed to Checkout
                </Link>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
