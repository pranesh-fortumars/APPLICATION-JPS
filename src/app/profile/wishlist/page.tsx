"use client";

import { useWishlistStore } from "@/store/wishlistStore";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import { Heart } from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

export default function WishlistPage() {
  const { items } = useWishlistStore();

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      
      <main className="flex-1 max-w-[1440px] w-full mx-auto px-6 py-32">
        <div className="flex items-center gap-4 mb-12 border-b border-black/10 pb-6">
          <Heart className="text-primary w-8 h-8 fill-primary" />
          <h1 className="font-serif text-3xl font-bold text-primary">My Wishlist</h1>
          <span className="text-sm font-sans font-medium text-foreground/50 ml-auto bg-secondary px-3 py-1 rounded-full">
            {items.length} {items.length === 1 ? 'Item' : 'Items'}
          </span>
        </div>

        {items.length === 0 ? (
          <div className="text-center py-20 bg-secondary/30 rounded-sm border border-black/5">
            <h2 className="font-serif text-2xl mb-4 text-foreground/60">Your wishlist is empty</h2>
            <p className="text-sm font-sans mb-8">Save your favorite fabrics here to find them easily later.</p>
            <Link href="/collections" className="px-8 py-4 bg-primary text-white font-bold uppercase tracking-widest text-sm hover:bg-primary/90 transition-colors">
              Explore Collections
            </Link>
          </div>
        ) : (
          <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            <AnimatePresence>
              {items.map((product) => (
                <motion.div
                  key={product.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.3 }}
                >
                  <ProductCard product={product} />
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </main>

      <Footer />
    </div>
  );
}
