"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

export default function AboutPage() {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  const y = useTransform(scrollYProgress, [0, 1], ["0%", "20%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  return (
    <div className="min-h-screen bg-background flex flex-col" ref={containerRef}>
      <Navbar />

      <main className="flex-1 w-full">
        {/* Parallax Hero */}
        <section className="relative h-[80vh] w-full overflow-hidden bg-dark flex items-center justify-center">
          <motion.div style={{ y, opacity }} className="absolute inset-0 w-full h-full">
            <Image 
              src="https://images.unsplash.com/photo-1584916201218-f4242ceb4809?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80" 
              alt="Silk threads" 
              fill
              sizes="100vw"
              className="object-cover opacity-50"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-background"></div>
          </motion.div>
          
          <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
            <motion.h1 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.2 }}
              className="font-serif text-5xl md:text-7xl font-bold text-white mb-6 leading-tight"
            >
              Weaving Dreams<br/><span className="italic font-light text-accent">Since 1980</span>
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 0.5 }}
              className="font-sans text-white/80 text-lg md:text-xl font-light max-w-2xl mx-auto"
            >
              JPS Fabrics was born from a singular passion: to bring the finest, most luxurious textiles from master weavers directly to connoisseurs of haute couture.
            </motion.p>
          </div>
        </section>

        {/* The Heritage */}
        <section className="py-32 px-6 md:px-20 max-w-[1440px] mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
            className="flex flex-col gap-6"
          >
            <h2 className="text-xs font-sans font-bold uppercase tracking-[0.3em] text-primary/50">Our Heritage</h2>
            <h3 className="font-serif text-4xl md:text-5xl font-bold text-primary leading-tight">
              A Legacy of <br/> Uncompromised Quality
            </h3>
            <div className="h-px w-24 bg-accent my-2"></div>
            <p className="font-sans text-foreground/70 text-lg font-light leading-relaxed">
              For over four decades, JPS Fabrics has been the cornerstone of luxury textile procurement. We travel the globe—from the historic silk mills of Lyon to the intricate looms of Varanasi—to source materials that meet our exacting standards.
            </p>
            <p className="font-sans text-foreground/70 text-lg font-light leading-relaxed">
              Every yard of fabric in our boutique is hand-selected, ensuring that when you choose JPS, you are choosing unparalleled craftsmanship designed to last generations.
            </p>
          </motion.div>
          <motion.div 
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
            className="relative aspect-[4/5] w-full bg-secondary shadow-ambient"
          >
            <Image 
              src="https://images.unsplash.com/photo-1605518216938-7c31b7b14ad0?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
              alt="Heritage craftsmanship" 
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover"
            />
          </motion.div>
        </section>

        {/* Timeline/Values */}
        <section className="py-32 bg-[#fbf2ed] dark:bg-[#1a1a1a] border-y border-black/5 dark:border-white/5">
          <div className="px-6 md:px-20 max-w-[1440px] mx-auto text-center">
            <h2 className="font-serif text-4xl md:text-5xl font-bold text-primary mb-16">The Pillars of JPS</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              {[
                { year: "Curation", title: "Only The Best", desc: "We reject 90% of what we see. Only the absolute pinnacle of textile artistry makes it to our showroom." },
                { year: "Sustainability", title: "Ethical Sourcing", desc: "We partner exclusively with mills that respect their artisans and the environment, ensuring a beautiful future." },
                { year: "Service", title: "Bespoke Experience", desc: "From private showroom viewings to dedicated fabric consultants, we offer a service as premium as our silk." }
              ].map((item, index) => (
                <motion.div 
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.6, delay: index * 0.2 }}
                  className="flex flex-col items-center text-center gap-4"
                >
                  <span className="font-sans text-accent font-bold tracking-widest uppercase text-sm">{item.year}</span>
                  <h4 className="font-serif text-2xl font-bold text-primary">{item.title}</h4>
                  <p className="font-sans text-foreground/70 font-light">{item.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
