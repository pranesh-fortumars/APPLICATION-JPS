"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

const categories = [
  {
    id: "sarees",
    title: "Sarees",
    image: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    href: "/collections?category=Womens Fabrics",
    aspect: "aspect-[3/4]",
  },
  {
    id: "lehengas",
    title: "Lehengas",
    image: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    href: "/collections?category=Designer Collection",
    aspect: "aspect-square",
  },
  {
    id: "kurtis",
    title: "Kurtis",
    image: "https://images.unsplash.com/photo-1596464716127-f2a82984de30?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    href: "/collections?category=New Arrivals",
    aspect: "aspect-[4/5]",
  }
];

export default function InteractiveCategories() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  const y1 = useTransform(scrollYProgress, [0, 1], [100, -100]);
  const y2 = useTransform(scrollYProgress, [0, 1], [-100, 100]);

  return (
    <section ref={containerRef} className="py-24 md:py-32 bg-dark text-white overflow-hidden relative">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Header */}
        <div className="text-center mb-20 md:mb-32">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="font-serif text-5xl md:text-7xl font-bold mb-4 flex flex-col md:flex-row items-center justify-center gap-2 md:gap-4"
          >
            <span>Let the</span>
            <span className="font-script text-accent text-6xl md:text-8xl -mt-4 md:mt-0 font-normal tracking-normal">Fashion</span>
            <span>Begin</span>
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="font-sans text-white/70 max-w-lg mx-auto text-lg"
          >
            Start planning your occasion with our curated fabrics across every category.
          </motion.p>
        </div>

        {/* Masonry-style Interactive Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12 items-center">
          
          {/* Left Column (Sarees) */}
          <div className="md:col-span-5 relative group">
            <motion.div style={{ y: y1 }} className="relative z-10">
              <Link href={categories[0].href} className="block relative overflow-hidden rounded-sm">
                <div className={`relative w-full ${categories[0].aspect}`}>
                  <Image 
                    src={categories[0].image} 
                    alt={categories[0].title}
                    fill
                    priority
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                  />
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors duration-500" />
                </div>
                
                {/* Floating Interactive Button */}
                <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center justify-center gap-3 opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500 delay-100">
                  <div className="w-14 h-14 rounded-full bg-white text-dark flex items-center justify-center shadow-2xl hover:scale-110 hover:bg-accent hover:text-white transition-all">
                    <ArrowRight size={24} className="-rotate-45" />
                  </div>
                  <span className="font-sans font-bold uppercase tracking-widest text-sm text-white drop-shadow-md">
                    {categories[0].title}
                  </span>
                </div>
              </Link>
            </motion.div>
          </div>

          {/* Right Column (Lehengas & Kurtis) */}
          <div className="md:col-span-7 flex flex-col gap-12 md:gap-24">
            
            <motion.div style={{ y: y2 }} className="relative group self-end w-full md:w-3/4">
              <Link href={categories[1].href} className="block relative overflow-hidden rounded-sm">
                <div className={`relative w-full ${categories[1].aspect}`}>
                  <Image 
                    src={categories[1].image} 
                    alt={categories[1].title}
                    fill
                    priority
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                  />
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors duration-500" />
                </div>
                
                {/* Floating Interactive Button */}
                <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center justify-center gap-3 opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500 delay-100">
                  <div className="w-14 h-14 rounded-full bg-white text-dark flex items-center justify-center shadow-2xl hover:scale-110 hover:bg-accent hover:text-white transition-all">
                    <ArrowRight size={24} className="-rotate-45" />
                  </div>
                  <span className="font-sans font-bold uppercase tracking-widest text-sm text-white drop-shadow-md">
                    {categories[1].title}
                  </span>
                </div>
              </Link>
            </motion.div>

            <motion.div style={{ y: y1 }} className="relative group self-start w-full md:w-4/5">
              <Link href={categories[2].href} className="block relative overflow-hidden rounded-sm">
                <div className={`relative w-full ${categories[2].aspect}`}>
                  <Image 
                    src={categories[2].image} 
                    alt={categories[2].title}
                    fill
                    priority
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                  />
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors duration-500" />
                </div>
                
                {/* Floating Interactive Button */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center justify-center gap-3 opacity-0 scale-90 group-hover:opacity-100 group-hover:scale-100 transition-all duration-500 delay-100">
                  <div className="w-16 h-16 rounded-full bg-white/90 backdrop-blur-sm text-dark flex items-center justify-center shadow-2xl hover:scale-110 hover:bg-accent hover:text-white transition-all">
                    <ArrowRight size={28} className="-rotate-45" />
                  </div>
                  <span className="font-sans font-bold uppercase tracking-widest text-sm text-white drop-shadow-md">
                    {categories[2].title}
                  </span>
                </div>
              </Link>
            </motion.div>

          </div>

        </div>
      </div>
    </section>
  );
}
