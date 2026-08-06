"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, X } from "lucide-react";
import { mockProducts } from "@/lib/mockData";
import Link from "next/link";
import Image from "next/image";

interface SmartSearchProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SmartSearch({ isOpen, onClose }: SmartSearchProps) {
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  const results = query.length > 1 
    ? mockProducts.filter(p => p.name.toLowerCase().includes(query.toLowerCase()) || p.material.toLowerCase().includes(query.toLowerCase()))
    : [];

  const trendingSearches = ["Banarasi Silk", "Cotton Lining", "Georgette", "Designer Falls"];

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="fixed inset-0 z-[100] bg-background/95 backdrop-blur-xl flex flex-col"
        >
          <div className="max-w-4xl w-full mx-auto px-6 pt-16 flex flex-col h-full">
            <div className="flex items-center justify-between border-b border-black/20 dark:border-white/20 pb-4">
              <div className="flex items-center flex-1 gap-4 text-primary">
                <Search size={28} />
                <input
                  ref={inputRef}
                  type="text"
                  placeholder="Search fabrics, materials, or colors..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="w-full bg-transparent text-2xl font-serif outline-none placeholder:text-primary/30"
                />
              </div>
              <button onClick={onClose} className="text-foreground hover:text-accent transition-colors ml-4">
                <X size={32} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto py-12">
              {query.length <= 1 ? (
                <div className="flex flex-col gap-6">
                  <h3 className="text-xs uppercase tracking-widest font-semibold text-foreground/50">Trending Searches</h3>
                  <div className="flex flex-wrap gap-4">
                    {trendingSearches.map(term => (
                      <button 
                        key={term}
                        onClick={() => setQuery(term)}
                        className="px-6 py-2 border border-black/10 dark:border-white/10 rounded-full text-sm hover:border-accent hover:text-accent transition-colors"
                      >
                        {term}
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="flex flex-col gap-8">
                  <h3 className="text-xs uppercase tracking-widest font-semibold text-foreground/50">
                    Results ({results.length})
                  </h3>
                  {results.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                      {results.map(product => (
                        <Link 
                          key={product.id} 
                          href={`/collections?search=${encodeURIComponent(product.name)}`}
                          onClick={onClose}
                          className="group flex gap-4 items-center p-2 hover:bg-black/5 dark:hover:bg-white/5 rounded-sm transition-colors"
                        >
                          <div className="relative w-16 h-20 bg-secondary shrink-0 overflow-hidden">
                            <Image src={product.images[0]} alt={product.name} fill sizes="64px" className="object-cover" />
                          </div>
                          <div className="flex flex-col">
                            <span className="font-serif font-bold text-foreground group-hover:text-primary transition-colors line-clamp-1">{product.name}</span>
                            <span className="text-xs text-foreground/60">{product.material} • ₹{product.price}</span>
                          </div>
                        </Link>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-20 text-foreground/50 font-serif text-xl">
                      No fabrics found matching "{query}".
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
