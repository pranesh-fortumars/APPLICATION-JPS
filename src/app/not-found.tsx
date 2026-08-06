"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Link from "next/link";
import { motion } from "framer-motion";
import { Search } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />

      <main className="flex-1 flex flex-col items-center justify-center py-32 px-6 text-center relative overflow-hidden">
        {/* Decorative Background Elements */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-accent/5 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-primary/5 rounded-full blur-2xl pointer-events-none animate-pulse"></div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          className="relative z-10 flex flex-col items-center"
        >
          <h1 className="font-serif text-8xl md:text-[150px] font-bold text-primary opacity-20 tracking-tighter leading-none mb-4">
            404
          </h1>
          <h2 className="font-serif text-3xl md:text-5xl font-bold text-primary mb-6 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full">
            Page Not Found
          </h2>
          
          <p className="font-sans text-foreground/70 text-lg font-light max-w-md mx-auto mb-10 mt-12">
            The exquisite fabric you are searching for seems to have been misplaced in our archives.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 items-center justify-center">
            <Link 
              href="/collections"
              className="px-8 py-4 bg-dark text-white font-sans font-semibold uppercase tracking-widest text-sm hover:bg-primary transition-colors shadow-ambient"
            >
              Explore Collections
            </Link>
            <Link 
              href="/"
              className="px-8 py-4 bg-transparent border border-black/20 dark:border-white/20 text-foreground font-sans font-semibold uppercase tracking-widest text-sm hover:border-primary hover:text-primary transition-colors"
            >
              Return Home
            </Link>
          </div>
        </motion.div>
      </main>

      <Footer />
    </div>
  );
}
