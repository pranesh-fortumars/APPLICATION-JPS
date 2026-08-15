"use client";

import { useWishlistStore } from "@/store/wishlistStore";
import { useCartStore } from "@/store/cartStore";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { Trash2, ShoppingBag, Heart } from "lucide-react";

export default function WishlistPage() {
  const { items, removeItem, clearWishlist } = useWishlistStore();
  const { addItem } = useCartStore();

  const handleMoveToCart = (product: any) => {
    // Add to cart with default quantity of 1 meter
    addItem({ product, quantity: 1 });
    // Remove from wishlist
    removeItem(product.id);
  };

  return (
    <main className="min-h-screen bg-background flex flex-col pt-32">
      <Navbar />

      <div className="flex-1 w-full max-w-[1440px] mx-auto px-6 py-12">
        <div className="flex justify-between items-end mb-12 border-b border-black/10 pb-6">
          <div>
            <h1 className="font-serif text-4xl md:text-5xl font-bold text-primary mb-2">Your Wishlist</h1>
            <p className="text-primary/60 font-sans">{items.length} {items.length === 1 ? 'item' : 'items'} saved for later</p>
          </div>
          {items.length > 0 && (
            <button 
              onClick={clearWishlist}
              className="text-xs uppercase tracking-widest font-bold text-red-500 hover:text-red-600 transition-colors"
            >
              Clear All
            </button>
          )}
        </div>

        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-32 bg-black/5 rounded-sm">
            <Heart size={48} className="text-primary/20 mb-6" />
            <h2 className="font-serif text-2xl text-primary mb-2">Your wishlist is empty</h2>
            <p className="text-primary/60 mb-8 max-w-md text-center">You haven't saved any fabrics yet. Browse our collections and click the heart icon to save items here.</p>
            <Link 
              href="/collections" 
              className="bg-primary text-white px-8 py-4 uppercase tracking-widest text-sm font-bold hover:bg-primary/90 transition-colors shadow-ambient"
            >
              Explore Collections
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            <AnimatePresence>
              {items.map((item) => (
                <motion.div 
                  key={item.id}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="group flex flex-col border border-black/5 hover:shadow-xl transition-all duration-300 bg-white"
                >
                  <Link href={`/collections/${item.id}`} className="relative aspect-[3/4] bg-secondary overflow-hidden block">
                    <Image 
                      src={item.images[0]} 
                      alt={item.name} 
                      fill 
                      className="object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                    <button 
                      onClick={(e) => { e.preventDefault(); removeItem(item.id); }}
                      className="absolute top-4 right-4 bg-white/80 backdrop-blur-sm p-2 rounded-full text-red-500 hover:bg-red-50 hover:text-red-600 transition-colors shadow-sm z-10"
                      aria-label="Remove from wishlist"
                    >
                      <Trash2 size={16} />
                    </button>
                  </Link>
                  
                  <div className="p-5 flex flex-col flex-1">
                    <div className="text-xs text-primary/50 uppercase tracking-widest font-bold mb-2">
                      {item.material} • {item.width}
                    </div>
                    <Link href={`/collections/${item.id}`} className="font-serif text-lg font-bold text-primary hover:text-accent transition-colors line-clamp-1 mb-2">
                      {item.name}
                    </Link>
                    <p className="font-sans font-medium text-accent mb-6">₹{item.price} <span className="text-xs font-light text-primary/50">/m</span></p>
                    
                    <button 
                      onClick={() => handleMoveToCart(item)}
                      className="mt-auto w-full border border-primary text-primary py-3 uppercase tracking-widest text-xs font-bold hover:bg-primary hover:text-white transition-colors flex justify-center items-center gap-2"
                    >
                      <ShoppingBag size={14} />
                      Move to Cart
                    </button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>

      <Footer />
    </main>
  );
}
