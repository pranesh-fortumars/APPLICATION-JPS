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
            <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-6">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-foreground/50 gap-4">
                  <ShoppingBag size={48} strokeWidth={1} />
                  <p className="font-serif text-xl">Your bag is empty.</p>
                  <button onClick={toggleCart} className="mt-4 text-primary underline text-sm font-semibold uppercase tracking-widest">
                    Continue Shopping
                  </button>
                </div>
              ) : (
                items.map((item) => (
                  <div key={item.product.id} className="flex gap-4 border-b border-black/5 dark:border-white/5 pb-6">
                    <div className="relative w-24 h-32 bg-secondary shrink-0 overflow-hidden">
                      <Image src={item.product.images[0]} alt={item.product.name} fill sizes="96px" className="object-cover" />
                    </div>
                    <div className="flex flex-col flex-1 py-1">
                      <div className="flex justify-between items-start gap-2">
                        <h3 className="font-serif font-bold text-lg leading-tight line-clamp-2">
                          {item.product.name}
                        </h3>
                        <button 
                          onClick={() => removeItem(item.product.id)}
                          className="text-foreground/40 hover:text-red-500 transition-colors"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                      <p className="text-sm text-foreground/60 mt-1">{item.product.material}</p>
                      
                        <div className="mt-auto flex items-center justify-between">
                        <div className="flex items-center border border-black/10">
                          <button 
                            className="px-3 py-1 hover:bg-black/5"
                            onClick={() => updateQuantity(item.product.id, Math.max(0.5, item.quantity - 0.5))}
                          >-</button>
                          <span className="px-3 py-1 text-sm w-12 text-center">{item.quantity} m</span>
                          <button 
                            className="px-3 py-1 hover:bg-black/5"
                            onClick={() => updateQuantity(item.product.id, item.quantity + 0.5)}
                          >+</button>
                        </div>
                        <span className="font-semibold text-primary">₹{item.product.price * item.quantity}</span>
                      </div>
                    </div>
                  </div>
                ))
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
