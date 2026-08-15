"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { ChevronLeft, ChevronRight, ShoppingBag } from "lucide-react";
import { mockProducts } from "@/lib/mockData";

interface ProductCarouselProps {
  title: string;
  subtitle?: string;
  category?: string;
  dark?: boolean;
}

export default function ProductCarousel({ title, subtitle, category, dark = false }: ProductCarouselProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -400, behavior: "smooth" });
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 400, behavior: "smooth" });
    }
  };

  // Filter mock products (in a real app, this would fetch from backend based on category/tags)
  const products = category ? mockProducts.filter(p => p.category.includes(category as any) || (p.bestFor && p.bestFor.includes(category))) : mockProducts.slice(0, 8);

  const bgClass = dark ? "bg-primary text-white" : "bg-white text-primary";
  const borderClass = dark ? "border-white/10" : "border-black/5";

  return (
    <section className={`py-24 ${bgClass} relative overflow-hidden border-t ${borderClass}`}>
      <div className="max-w-7xl mx-auto px-6 mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          {subtitle && (
            <span className={`text-xs font-bold uppercase tracking-[0.2em] mb-3 block ${dark ? 'text-accent' : 'text-primary/60'}`}>
              {subtitle}
            </span>
          )}
          <h2 className="text-4xl md:text-5xl font-serif font-bold">{title}</h2>
        </div>
        <div className="flex gap-4">
          <button 
            onClick={scrollLeft}
            className={`w-12 h-12 rounded-full border flex items-center justify-center transition-colors ${dark ? 'border-white/30 text-white hover:bg-white hover:text-primary' : 'border-black/10 text-primary hover:bg-primary hover:text-white'}`}
          >
            <ChevronLeft size={20} />
          </button>
          <button 
            onClick={scrollRight}
            className={`w-12 h-12 rounded-full border flex items-center justify-center transition-colors ${dark ? 'border-white/30 text-white hover:bg-white hover:text-primary' : 'border-black/10 text-primary hover:bg-primary hover:text-white'}`}
          >
            <ChevronRight size={20} />
          </button>
        </div>
      </div>

      <div className="relative max-w-[1440px] mx-auto px-6">
        <div 
          ref={scrollContainerRef}
          className="flex gap-6 overflow-x-auto snap-x snap-mandatory hide-scrollbar pb-8 -mx-6 px-6"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {products.map((product) => (
            <Link 
              href={`/collections/${product.id}`} 
              key={product.id}
              className="group min-w-[280px] md:min-w-[320px] snap-start flex-shrink-0"
            >
              <div className="relative aspect-[3/4] overflow-hidden mb-4 rounded-sm bg-secondary">
                <Image 
                  src={product.images[0]} 
                  alt={product.name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-700"
                />
                
                {product.isNewArrival && (
                  <div className="absolute top-4 left-4 bg-white text-primary text-[10px] font-bold uppercase tracking-widest px-3 py-1 z-10">
                    New Arrival
                  </div>
                )}
                
                {/* Hover overlay actions */}
                <div className="absolute inset-x-0 bottom-0 p-4 opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
                  <div className="bg-white/90 backdrop-blur-sm text-primary py-3 flex items-center justify-center gap-2 font-bold text-xs uppercase tracking-widest shadow-lg hover:bg-primary hover:text-white transition-colors">
                    <ShoppingBag size={14} />
                    Quick View
                  </div>
                </div>
              </div>
              
              <div className="flex flex-col gap-1">
                <h3 className={`font-serif text-lg font-bold truncate ${dark ? 'text-white' : 'text-primary'}`}>
                  {product.name}
                </h3>
                <p className={`font-sans text-sm font-medium ${dark ? 'text-accent' : 'text-primary/60'}`}>
                  ₹{product.price} <span className="font-light text-xs">/ meter</span>
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
