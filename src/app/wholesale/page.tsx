"use client";

import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Check } from "lucide-react";
import { motion } from "framer-motion";

export default function WholesalePage() {
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      
      <main className="flex-1 pt-32 pb-24">
        <div className="max-w-3xl mx-auto px-6 text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-primary mb-6">JPS for Designers & Boutiques</h1>
          <p className="text-foreground/70 font-sans text-lg max-w-2xl mx-auto">
            Partner with JPS Fabrics for exclusive wholesale pricing, bulk sourcing, and dedicated support for your fashion label or boutique.
          </p>
        </div>

        <div className="max-w-4xl mx-auto px-6">
          {isSubmitted ? (
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="bg-secondary p-12 text-center rounded-sm">
              <div className="w-20 h-20 bg-primary text-white rounded-full flex items-center justify-center mx-auto mb-6">
                <Check size={40} />
              </div>
              <h2 className="text-3xl font-serif font-bold mb-4">Application Received</h2>
              <p className="text-foreground/70 mb-8 max-w-md mx-auto">Thank you for your interest in partnering with JPS Fabrics. Our B2B team will review your application and contact you within 24-48 hours.</p>
              <button onClick={() => setIsSubmitted(false)} className="px-8 py-3 bg-transparent border border-primary text-primary font-bold uppercase tracking-widest text-sm hover:bg-primary hover:text-white transition-colors">Submit Another</button>
            </motion.div>
          ) : (
            <div className="bg-white p-8 md:p-12 border border-black/5 shadow-2xl">
              <h2 className="text-2xl font-serif font-bold mb-8 pb-4 border-b border-black/10">Wholesale Application Form</h2>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-widest mb-2">First Name *</label>
                    <input type="text" required className="w-full border border-black/10 px-4 py-3 outline-none focus:border-primary" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-widest mb-2">Last Name *</label>
                    <input type="text" required className="w-full border border-black/10 px-4 py-3 outline-none focus:border-primary" />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-widest mb-2">Email Address *</label>
                    <input type="email" required className="w-full border border-black/10 px-4 py-3 outline-none focus:border-primary" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-widest mb-2">Phone Number *</label>
                    <input type="tel" required className="w-full border border-black/10 px-4 py-3 outline-none focus:border-primary" />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest mb-2">Business Name *</label>
                  <input type="text" required className="w-full border border-black/10 px-4 py-3 outline-none focus:border-primary" />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest mb-2">Business Type *</label>
                  <select required className="w-full border border-black/10 px-4 py-3 outline-none focus:border-primary bg-transparent text-foreground/80">
                    <option value="">Select an option</option>
                    <option value="boutique">Independent Boutique</option>
                    <option value="designer">Fashion Designer / Label</option>
                    <option value="tailor">Tailoring Service</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest mb-2">GSTIN (Optional)</label>
                  <input type="text" className="w-full border border-black/10 px-4 py-3 outline-none focus:border-primary" />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest mb-2">Fabric Interests & Expected Monthly Volume *</label>
                  <textarea required rows={4} className="w-full border border-black/10 px-4 py-3 outline-none focus:border-primary resize-none"></textarea>
                </div>

                <button type="submit" className="w-full bg-primary text-white font-bold uppercase tracking-widest text-sm py-4 hover:bg-primary/90 transition-colors mt-4 shadow-ambient">
                  Submit Application
                </button>
              </form>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
