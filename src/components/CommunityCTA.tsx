"use client";

import { motion } from "framer-motion";
import { Heart } from "lucide-react";
import Link from "next/link";

export default function CommunityCTA() {
  return (
    <section className="py-24 bg-transparent w-full relative overflow-hidden floral-bg-subtle">
      <div className="max-w-4xl mx-auto px-6 md:px-20 text-center relative z-10">
        
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="flex justify-center mb-6"
        >
          <Heart className="text-primary fill-primary" size={48} />
        </motion.div>

        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="font-serif text-4xl md:text-[40px] font-semibold text-primary mb-4"
        >
          Join Our Community
        </motion.h2>
        
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="font-sans text-on-surface-variant text-lg mb-10 max-w-2xl mx-auto font-light leading-relaxed"
        >
          Please support us by following our business page for updates on new arrivals, exclusive collections, and behind-the-scenes glimpses.
        </motion.p>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
        >
          <Link 
            href="https://instagram.com/jpsfabrics"
            target="_blank"
            className="inline-flex items-center justify-center px-8 py-4 bg-white shadow-ambient rounded-full text-primary font-serif text-xl border border-[#775a19] hover:bg-primary hover:text-[#ffdea5] hover:border-transparent transition-all duration-500 gap-3 group"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="group-hover:scale-110 transition-transform"
            >
              <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
              <path d="M16.11 7.66v.01" />
              <path d="M12 16a4 4 0 1 0 0-8 4 4 0 0 0 0 8z" />
            </svg>
            @jpsfabrics
          </Link>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="mt-16 flex items-center justify-center gap-4 text-[#775a19] opacity-70"
        >
          <Heart size={16} />
          <span className="font-serif text-lg italic">Thank you for being part of this journey!</span>
          <Heart size={16} />
        </motion.div>
        
      </div>
    </section>
  );
}
