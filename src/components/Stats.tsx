"use client";

import { motion, useInView } from "framer-motion";
import { useEffect, useRef, useState } from "react";



export default function Stats() {
  const stats = [
    { label: "Premium Silks & Cottons", value: "Curated Fabrics" },
    { label: "Heritage Craftsmanship", value: "Master Weavers" },
    { label: "Tailored For You", value: "Bespoke Service" },
    { label: "Guaranteed Authenticity", value: "100% Pure" },
  ];

  return (
    <section className="py-24 bg-secondary text-primary relative overflow-hidden border-y border-black/5">
      {/* Decorative background pattern */}
      <div className="absolute inset-0 opacity-[0.03] bg-[url('https://www.transparenttextures.com/patterns/arabesque.png')] pointer-events-none mix-blend-overlay"></div>
      
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-12 text-center">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.8, delay: index * 0.1 }}
              className="flex flex-col items-center justify-center space-y-4"
            >
              <h3 className="text-3xl md:text-4xl lg:text-5xl font-serif text-accent font-bold drop-shadow-sm leading-tight text-balance">
                {stat.value}
              </h3>
              <p className="text-xs md:text-sm tracking-widest uppercase font-sans font-semibold text-primary/70 max-w-[200px]">
                {stat.label}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
