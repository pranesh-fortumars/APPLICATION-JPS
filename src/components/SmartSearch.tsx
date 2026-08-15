"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, X, Camera, Clock, ArrowUpRight } from "lucide-react";
import { mockProducts } from "@/lib/mockData";
import Link from "next/link";
import Image from "next/image";

interface SmartSearchProps {
  isOpen: boolean;
  onClose: () => void;
}

// Simple typo tolerance mock (checks if string a is mostly in string b)
const fuzzyMatch = (query: string, text: string) => {
  const a = query.toLowerCase().replace(/[^a-z0-9]/g, '');
  const b = text.toLowerCase().replace(/[^a-z0-9]/g, '');
  if (a.length < 3) return b.includes(a);
  
  // Very basic typo tolerance: if 80% of chars match in order, or it includes the query
  if (b.includes(a)) return true;
  
  let matches = 0;
  let i = 0; let j = 0;
  while (i < a.length && j < b.length) {
    if (a[i] === b[j]) {
      matches++;
      i++;
    }
    j++;
  }
  return (matches / a.length) > 0.8;
};

export default function SmartSearch({ isOpen, onClose }: SmartSearchProps) {
  const [query, setQuery] = useState("");
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [isScanning, setIsScanning] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("jps_recent_searches");
      if (saved) {
        try { setRecentSearches(JSON.parse(saved)); } catch (e) {}
      }
    }
  }, []);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  const handleSearchSubmit = (e?: React.FormEvent, term?: string) => {
    if (e) e.preventDefault();
    const searchTerm = term || query;
    if (searchTerm.trim().length > 0) {
      const updated = [searchTerm, ...recentSearches.filter(s => s !== searchTerm)].slice(0, 5);
      setRecentSearches(updated);
      localStorage.setItem("jps_recent_searches", JSON.stringify(updated));
      // In a real app, this would route to search results page
      // window.location.href = `/collections?search=${encodeURIComponent(searchTerm)}`;
    }
  };

  const simulateVisualSearch = () => {
    setIsScanning(true);
    setTimeout(() => {
      setIsScanning(false);
      setQuery("Red Silk"); 
    }, 2500);
  };

  const results = query.length > 1 
    ? mockProducts.filter(p => 
        fuzzyMatch(query, p.name) || 
        fuzzyMatch(query, p.material) || 
        (p.category && p.category.some(c => fuzzyMatch(query, c))) ||
        (p.bestFor && p.bestFor.some(t => fuzzyMatch(query, t)))
      ).slice(0, 6)
    : [];

  const trendingSearches = ["Banarasi Silk", "Cotton Lining", "Georgette", "Designer Falls", "Wedding Collection"];

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
              <form onSubmit={handleSearchSubmit} className="flex items-center flex-1 gap-4 text-primary">
                <Search size={28} />
                <input
                  ref={inputRef}
                  type="text"
                  placeholder="Search fabrics, materials, colors, or occasions..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="w-full bg-transparent text-xl md:text-2xl font-serif outline-none placeholder:text-primary/30"
                />
                <button 
                  type="button"
                  onClick={simulateVisualSearch}
                  className="p-2 hover:bg-black/5 dark:hover:bg-white/5 rounded-full transition-colors flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-foreground/50 hover:text-primary"
                  title="Search by Image"
                >
                  <Camera size={24} />
                  <span className="hidden md:inline">Visual Search</span>
                </button>
              </form>
              <button onClick={onClose} className="text-foreground hover:text-accent transition-colors ml-4 shrink-0 p-2">
                <X size={32} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto py-12 relative hide-scrollbar">
              {isScanning && (
                <div className="absolute inset-0 z-10 bg-background/80 backdrop-blur-sm flex flex-col items-center justify-center">
                  <div className="relative">
                    <Camera size={48} className="text-primary/20" />
                    <div className="absolute inset-0 bg-primary/20 animate-ping rounded-full" />
                  </div>
                  <p className="mt-6 font-serif text-xl animate-pulse">Scanning image for visual matches...</p>
                  <p className="text-xs uppercase tracking-widest text-foreground/50 mt-2">JPS Vision AI</p>
                </div>
              )}

              {query.length <= 1 ? (
                <div className="flex flex-col gap-10">
                  {/* Recent Searches */}
                  {recentSearches.length > 0 && (
                    <div className="flex flex-col gap-4">
                      <div className="flex items-center justify-between">
                        <h3 className="text-xs uppercase tracking-widest font-bold text-primary/60">Recent Searches</h3>
                        <button 
                          onClick={() => { setRecentSearches([]); localStorage.removeItem("jps_recent_searches"); }}
                          className="text-[10px] uppercase tracking-widest font-bold text-primary/40 hover:text-primary transition-colors"
                        >
                          Clear
                        </button>
                      </div>
                      <div className="flex flex-wrap gap-3">
                        {recentSearches.map(term => (
                          <button 
                            key={term}
                            onClick={() => { setQuery(term); handleSearchSubmit(undefined, term); }}
                            className="flex items-center gap-2 px-4 py-2 border border-black/5 bg-black/5 rounded-sm text-sm hover:border-accent hover:text-accent transition-colors font-medium"
                          >
                            <Clock size={14} className="opacity-50" />
                            {term}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Trending Searches */}
                  <div className="flex flex-col gap-4">
                    <h3 className="text-xs uppercase tracking-widest font-bold text-primary/60">Trending Right Now</h3>
                    <div className="flex flex-wrap gap-3">
                      {trendingSearches.map(term => (
                        <button 
                          key={term}
                          onClick={() => { setQuery(term); handleSearchSubmit(undefined, term); }}
                          className="flex items-center gap-2 px-4 py-2 border border-black/10 rounded-sm text-sm hover:border-accent hover:bg-accent/5 hover:text-accent transition-colors font-medium"
                        >
                          <ArrowUpRight size={14} className="opacity-50" />
                          {term}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col gap-8">
                  <h3 className="text-xs uppercase tracking-widest font-bold text-primary/60">
                    Search Results ({results.length})
                  </h3>
                  {results.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      {results.map(product => (
                        <Link 
                          key={product.id} 
                          href={`/collections/${product.id}`}
                          onClick={() => { handleSearchSubmit(); onClose(); }}
                          className="group flex gap-6 items-center p-4 hover:bg-black/5 rounded-sm transition-colors border border-transparent hover:border-black/5"
                        >
                          <div className="relative w-20 h-28 bg-secondary shrink-0 overflow-hidden rounded-sm">
                            <Image src={product.images[0]} alt={product.name} fill sizes="80px" className="object-cover group-hover:scale-110 transition-transform duration-700" />
                          </div>
                          <div className="flex flex-col gap-1">
                            <span className="font-serif font-bold text-lg text-primary group-hover:text-accent transition-colors line-clamp-1">{product.name}</span>
                            <span className="text-xs font-bold uppercase tracking-widest text-primary/50">{product.material}</span>
                            <span className="text-sm font-medium mt-1 text-primary">₹{product.price} <span className="text-xs font-light">/ meter</span></span>
                          </div>
                        </Link>
                      ))}
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-20 text-center gap-4">
                      <Search size={48} className="text-primary/10" />
                      <div className="font-serif text-2xl text-primary/70">
                        No fabrics found matching "<span className="text-primary">{query}</span>"
                      </div>
                      <p className="text-sm text-primary/50 font-medium">Try checking for typos or searching by broad categories like 'Silk' or 'Cotton'.</p>
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
