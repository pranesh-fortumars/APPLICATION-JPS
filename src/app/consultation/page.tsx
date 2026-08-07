"use client";

import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Check, Calendar, Video, Clock } from "lucide-react";
import { motion } from "framer-motion";

export default function ConsultationPage() {
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      
      <main className="flex-1 pt-32 pb-24">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          
          {/* Left: Info */}
          <div>
            <h1 className="text-4xl md:text-5xl font-serif font-bold text-primary mb-6 leading-tight">Book a Personal Fabric Consultation</h1>
            <p className="text-foreground/70 font-sans text-lg mb-10">
              Not sure which fabric to choose for your special occasion? Connect with our expert textile consultants via video call or in our physical boutique. We'll guide you through our collections, explain fabric properties, and help you find the perfect match for your design.
            </p>
            
            <div className="space-y-8">
              <div className="flex gap-4 items-start">
                <div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center shrink-0">
                  <Video className="text-primary" size={24} />
                </div>
                <div>
                  <h3 className="font-serif font-bold text-xl mb-2">Virtual Boutique Tour</h3>
                  <p className="text-foreground/60 text-sm">Join a WhatsApp video call. We will walk you through our shelves and show you the drape and texture of fabrics live.</p>
                </div>
              </div>
              
              <div className="flex gap-4 items-start">
                <div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center shrink-0">
                  <Calendar className="text-primary" size={24} />
                </div>
                <div>
                  <h3 className="font-serif font-bold text-xl mb-2">Tailored Recommendations</h3>
                  <p className="text-foreground/60 text-sm">Tell us your occasion (e.g., Bridal, Festive) and preferred color palette, and we will curate a selection specifically for you.</p>
                </div>
              </div>

              <div className="flex gap-4 items-start">
                <div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center shrink-0">
                  <Clock className="text-primary" size={24} />
                </div>
                <div>
                  <h3 className="font-serif font-bold text-xl mb-2">30-Minute Sessions</h3>
                  <p className="text-foreground/60 text-sm">Our consultations are completely free and designed to give you undivided attention from our specialists.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Booking Form */}
          <div>
            {isSubmitted ? (
              <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="bg-secondary p-12 text-center rounded-sm">
                <div className="w-20 h-20 bg-primary text-white rounded-full flex items-center justify-center mx-auto mb-6">
                  <Check size={40} />
                </div>
                <h2 className="text-3xl font-serif font-bold mb-4">Consultation Requested!</h2>
                <p className="text-foreground/70 mb-8 max-w-md mx-auto">We have received your request. One of our specialists will reach out via WhatsApp shortly to confirm your booking time.</p>
                <button onClick={() => setIsSubmitted(false)} className="px-8 py-3 bg-transparent border border-primary text-primary font-bold uppercase tracking-widest text-sm hover:bg-primary hover:text-white transition-colors">Book Another</button>
              </motion.div>
            ) : (
              <div className="bg-white p-8 border border-black/5 shadow-2xl">
                <h2 className="text-2xl font-serif font-bold mb-8 pb-4 border-b border-black/10">Request a Slot</h2>
                
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-widest mb-2">First Name *</label>
                      <input type="text" required className="w-full border border-black/10 px-4 py-3 outline-none focus:border-primary" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-widest mb-2">Last Name *</label>
                      <input type="text" required className="w-full border border-black/10 px-4 py-3 outline-none focus:border-primary" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-widest mb-2">WhatsApp Number *</label>
                    <input type="tel" required className="w-full border border-black/10 px-4 py-3 outline-none focus:border-primary" />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-widest mb-2">What are you creating? *</label>
                    <select required className="w-full border border-black/10 px-4 py-3 outline-none focus:border-primary bg-transparent text-foreground/80">
                      <option value="">Select an option</option>
                      <option value="saree">Saree</option>
                      <option value="blouse">Blouse</option>
                      <option value="lehenga">Lehenga / Bridal</option>
                      <option value="kurta">Kurta / Dress</option>
                      <option value="menswear">Menswear / Sherwani</option>
                      <option value="other">Other</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-widest mb-2">Occasion & Preferences</label>
                    <textarea rows={3} placeholder="E.g. I need something for a summer wedding, preferably in pastel colors." className="w-full border border-black/10 px-4 py-3 outline-none focus:border-primary resize-none"></textarea>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-widest mb-2">Preferred Date</label>
                      <input type="date" required className="w-full border border-black/10 px-4 py-3 outline-none focus:border-primary bg-transparent" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-widest mb-2">Preferred Time</label>
                      <select required className="w-full border border-black/10 px-4 py-3 outline-none focus:border-primary bg-transparent text-foreground/80">
                        <option value="">Select a slot</option>
                        <option value="morning">Morning (10 AM - 1 PM)</option>
                        <option value="afternoon">Afternoon (2 PM - 5 PM)</option>
                        <option value="evening">Evening (6 PM - 8 PM)</option>
                      </select>
                    </div>
                  </div>

                  <button type="submit" className="w-full bg-primary text-white font-bold uppercase tracking-widest text-sm py-4 hover:bg-primary/90 transition-colors mt-4 shadow-ambient">
                    Book Consultation
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
