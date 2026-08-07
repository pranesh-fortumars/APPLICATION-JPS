"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function AboutBoutique() {
  return (
    <section className="py-24 md:py-32 bg-secondary">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
          
          {/* Text Content */}
          <div className="order-2 lg:order-1 flex flex-col items-start text-left">
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold text-primary mb-8"
            >
              About JPS Boutique
            </motion.h2>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="flex flex-col gap-6 text-foreground/70 font-sans text-lg font-light leading-relaxed mb-10"
            >
              <p>
                JPS Boutique is your premier destination for exquisite handcrafted fabrics, seamlessly merging traditional Indian elegance with everyday style.
              </p>
              <p>
                We curate our collections to ensure exceptional quality in every thread—from the luxurious drape of our Kanchipuram silks to the breathable comfort of our daily wear cottons. Discover fabrics that celebrate you.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              <Link 
                href="/about" 
                className="group flex items-center gap-4 text-sm font-bold uppercase tracking-widest text-primary hover:text-accent transition-colors"
              >
                <span className="border-b border-primary group-hover:border-accent pb-1 transition-colors">Discover Our Story</span>
                <div className="w-8 h-8 rounded-full border border-primary group-hover:border-accent flex items-center justify-center transition-colors">
                  <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            </motion.div>
          </div>

          {/* Image Collage */}
          <div className="order-1 lg:order-2 relative w-full aspect-[4/5] md:aspect-[3/3] lg:aspect-[4/5]">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="relative w-full h-full shadow-2xl"
            >
              <Image 
                src="https://images.unsplash.com/photo-1620799140188-3b2a02fd9a77?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80" 
                alt="Women in traditional sarees"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-primary/10 mix-blend-multiply" />
            </motion.div>
            
            {/* Decorative Element */}
            <motion.div 
              initial={{ opacity: 0, rotate: -45 }}
              whileInView={{ opacity: 1, rotate: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1, delay: 0.5 }}
              className="absolute -top-12 -right-12 w-32 h-32 text-accent/20 hidden md:block"
            >
              <svg viewBox="0 0 100 100" fill="currentColor">
                <path d="M50 0 C50 50, 100 50, 100 50 C50 50, 50 100, 50 100 C50 50, 0 50, 0 50 C50 50, 50 0, 50 0 Z" />
              </svg>
            </motion.div>
          </div>

        </div>
      </div>
    </section>
  );
}
