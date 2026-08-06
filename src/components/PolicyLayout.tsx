"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";
import Link from "next/link";

interface PolicyLayoutProps {
  title: string;
  lastUpdated: string;
  children: React.ReactNode;
}

export default function PolicyLayout({ title, lastUpdated, children }: PolicyLayoutProps) {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-[1024px] w-full mx-auto px-6 md:px-20 py-32">
        {/* Header */}
        <div className="mb-16 pb-8 border-b border-black/10 dark:border-white/10 text-center md:text-left">
          <Link href="/" className="text-xs font-sans font-bold uppercase tracking-widest text-foreground/50 hover:text-primary transition-colors mb-6 inline-block">
            ← Back to Home
          </Link>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="font-serif text-4xl md:text-6xl font-bold text-primary mb-4"
          >
            {title}
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="font-sans text-foreground/50 text-sm tracking-widest uppercase"
          >
            Last Updated: {lastUpdated}
          </motion.p>
        </div>

        {/* Content */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="prose dark:prose-invert prose-lg max-w-none font-sans text-foreground/80 font-light marker:text-accent prose-headings:font-serif prose-headings:text-primary prose-a:text-accent prose-a:no-underline hover:prose-a:underline prose-strong:font-semibold prose-strong:text-foreground"
        >
          {children}
        </motion.div>
      </main>

      <Footer />
    </div>
  );
}
