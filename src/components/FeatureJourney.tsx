"use client";

import { motion } from "framer-motion";
import { Diamond } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function FeatureJourney() {
  return (
    <section className="py-24 bg-transparent w-full">
      <div className="max-w-[1440px] mx-auto px-6 md:px-20">
        
        {/* Header */}
        <div className="text-center mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="font-serif text-4xl md:text-[40px] font-semibold text-primary mb-4"
          >
            A New Journey Begins
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="font-sans text-on-surface-variant max-w-xl mx-auto italic text-lg"
          >
            Your support means everything to us.
          </motion.p>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          
          {/* Large Feature Image */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="md:col-span-8 relative rounded-xl overflow-hidden shadow-ambient h-[400px] md:h-[500px] group cursor-pointer"
          >
            <Image 
              src="https://images.unsplash.com/photo-1605518216938-7c31b7b14ad0?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80" 
              alt="Premium fabrics stacked elegantly" 
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 66vw, 50vw"
              className="object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#2a0002]/90 to-transparent"></div>
            
            <div className="absolute bottom-0 left-0 p-8 flex flex-col items-start">
              <span className="px-3 py-1 bg-[#775a19]/90 text-white font-sans text-xs font-semibold tracking-wider uppercase mb-3 inline-block rounded-sm">
                Featured
              </span>
              <h3 className="font-serif text-2xl md:text-3xl text-white mb-2 font-medium">Exquisite Silks & Brocades</h3>
              <p className="text-[#e9e1dc] font-sans max-w-md">Immerse yourself in textures that speak volumes of heritage and craftsmanship.</p>
            </div>
          </motion.div>

          {/* Secondary Feature Card */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="md:col-span-4 relative rounded-xl overflow-hidden shadow-ambient h-[400px] md:h-[500px] group bg-[#efe6e2]/80 backdrop-blur-sm flex flex-col items-center justify-center text-center p-8 border border-[#fed488]/30"
          >
            <Diamond className="text-[#D4AF37] mb-6 animate-float" size={48} strokeWidth={1.5} />
            <h3 className="font-serif text-2xl text-primary mb-4 font-medium">Uncompromising Quality</h3>
            <p className="text-on-surface-variant font-sans mb-8 leading-relaxed">
              Every thread is a testament to our dedication to providing only the finest materials for your bespoke creations.
            </p>
            <Link 
              href="/about"
              className="text-[#775a19] font-sans text-xs font-semibold uppercase tracking-wider border-b border-[#775a19] pb-1 hover:text-primary transition-colors"
            >
              Learn More
            </Link>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
