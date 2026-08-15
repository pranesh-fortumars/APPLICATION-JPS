"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import MagneticButton from "@/components/MagneticButton";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";

const slides = [
  {
    id: 1,
    title: "The Wedding Edit",
    subtitle: "Heritage Craftsmanship",
    description: "Discover our latest collection of premium bridal textiles, meticulously curated for elegance and crafted for perfection.",
    image: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=1920",
    cta: "Explore Bridal",
    link: "/collections?category=Wedding"
  },
  {
    id: 2,
    title: "Pure Handloom Silks",
    subtitle: "Timeless Elegance",
    description: "Experience the tactile luxury of pure silk, woven by master artisans passing down centuries of tradition.",
    image: "https://images.unsplash.com/photo-1583391733958-d25e07fac0ec?w=1920",
    cta: "Shop Silks",
    link: "/collections?category=Silk"
  },
  {
    id: 3,
    title: "Summer Breeze",
    subtitle: "Lightweight Cottons",
    description: "Breathe easy in our curated selection of premium cottons, perfect for the modern minimalist.",
    image: "https://images.unsplash.com/photo-1620799140188-3b2a02fd9a77?w=1920",
    cta: "Shop Cottons",
    link: "/collections?category=Cotton"
  }
];

export default function Hero() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const nextSlide = () => setCurrent((prev) => (prev + 1) % slides.length);
  const prevSlide = () => setCurrent((prev) => (prev - 1 + slides.length) % slides.length);

  return (
    <section className="relative w-full h-screen overflow-hidden bg-black">
      <AnimatePresence mode="wait">
        <motion.div
          key={current}
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.2 }}
          className="absolute inset-0"
        >
          <Image
            src={slides[current].image}
            alt={slides[current].title}
            fill
            className="object-cover opacity-80"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/80" />
        </motion.div>
      </AnimatePresence>

      <div className="absolute inset-0 z-10 flex flex-col items-center justify-center text-center px-6 pointer-events-none">
        <AnimatePresence mode="wait">
          <motion.div
            key={current}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="flex flex-col items-center max-w-4xl"
          >
            <p className="text-accent tracking-[0.3em] uppercase mb-4 text-xs md:text-sm font-bold">
              {slides[current].subtitle}
            </p>
            
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-serif text-white leading-tight mb-6">
              {slides[current].title}
            </h1>
            
            <div className="flex items-center gap-4 mb-8">
              <div className="h-px w-12 bg-white/30"></div>
              <div className="w-1.5 h-1.5 rounded-full bg-accent"></div>
              <div className="h-px w-12 bg-white/30"></div>
            </div>

            <p className="text-white/80 max-w-2xl text-lg md:text-xl font-light mb-10">
              {slides[current].description}
            </p>
            
            <div className="pointer-events-auto">
              <MagneticButton strength={0.4}>
                <Link
                  href={slides[current].link}
                  className="group relative inline-flex items-center justify-center px-8 py-4 bg-primary text-white font-bold uppercase tracking-widest text-sm hover:bg-white hover:text-primary transition-all duration-500 overflow-hidden shadow-ambient"
                >
                  <span className="relative z-10 flex items-center gap-2">
                    {slides[current].cta}
                  </span>
                </Link>
              </MagneticButton>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation Controls */}
      <div className="absolute bottom-12 left-12 right-12 z-20 flex justify-between items-end pointer-events-none hidden md:flex">
        <div className="flex gap-4 pointer-events-auto">
          <button onClick={prevSlide} className="w-12 h-12 rounded-full border border-white/30 flex items-center justify-center text-white hover:bg-white hover:text-black transition-colors">
            <ChevronLeft size={20} />
          </button>
          <button onClick={nextSlide} className="w-12 h-12 rounded-full border border-white/30 flex items-center justify-center text-white hover:bg-white hover:text-black transition-colors">
            <ChevronRight size={20} />
          </button>
        </div>
        
        <div className="flex gap-2 pointer-events-auto">
          {slides.map((_, idx) => (
            <button 
              key={idx}
              onClick={() => setCurrent(idx)}
              className={`h-1.5 transition-all duration-500 ${current === idx ? 'w-12 bg-accent' : 'w-6 bg-white/30'}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
