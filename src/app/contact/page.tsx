"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Image from "next/image";
import { motion } from "framer-motion";
import { MapPin, Phone, Mail, Clock, Send, CheckCircle2 } from "lucide-react";
import { useState } from "react";

export default function ContactPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Mock API call
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
      setTimeout(() => setIsSuccess(false), 5000);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-[1440px] w-full mx-auto px-6 md:px-20 py-32">
        {/* Header */}
        <div className="text-center mb-16 md:mb-24 max-w-3xl mx-auto">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="font-serif text-5xl md:text-6xl font-bold text-primary mb-6"
          >
            Get In Touch
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="font-sans text-foreground/70 text-lg font-light leading-relaxed"
          >
            Whether you are looking for a bespoke bridal fabric or have a query about our collections, our textile consultants are here to assist you with the utmost care.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24">
          
          {/* Left: Contact Info & Map */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="flex flex-col gap-12"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="flex flex-col gap-4">
                <div className="w-12 h-12 bg-[#efe6e2] dark:bg-[#1a1a1a] flex items-center justify-center rounded-sm">
                  <MapPin className="text-accent" size={24} />
                </div>
                <h3 className="font-serif font-bold text-xl text-primary">Visit Our Boutique</h3>
                <p className="font-sans text-foreground/70 font-light">
                  123 Luxury Avenue,<br/>
                  T. Nagar, Chennai,<br/>
                  Tamil Nadu 600017
                </p>
              </div>

              <div className="flex flex-col gap-4">
                <div className="w-12 h-12 bg-[#efe6e2] dark:bg-[#1a1a1a] flex items-center justify-center rounded-sm">
                  <Clock className="text-accent" size={24} />
                </div>
                <h3 className="font-serif font-bold text-xl text-primary">Opening Hours</h3>
                <p className="font-sans text-foreground/70 font-light">
                  Mon - Sat: 10:00 AM - 8:00 PM<br/>
                  Sunday: 11:00 AM - 5:00 PM
                </p>
              </div>

              <div className="flex flex-col gap-4">
                <div className="w-12 h-12 bg-[#efe6e2] dark:bg-[#1a1a1a] flex items-center justify-center rounded-sm">
                  <Phone className="text-accent" size={24} />
                </div>
                <h3 className="font-serif font-bold text-xl text-primary">Call Us</h3>
                <p className="font-sans text-foreground/70 font-light">
                  +91 89396 95455<br/>
                  +91 44 2434 5678
                </p>
              </div>

              <div className="flex flex-col gap-4">
                <div className="w-12 h-12 bg-[#efe6e2] dark:bg-[#1a1a1a] flex items-center justify-center rounded-sm">
                  <Mail className="text-accent" size={24} />
                </div>
                <h3 className="font-serif font-bold text-xl text-primary">Email Us</h3>
                <p className="font-sans text-foreground/70 font-light">
                  enquiries@jpsfabrics.com<br/>
                  support@jpsfabrics.com
                </p>
              </div>
            </div>

            {/* Live Google Maps Embed */}
            <div className="relative w-full h-[400px] bg-secondary rounded-sm overflow-hidden shadow-ambient">
              <iframe
                src="https://maps.google.com/maps?q=Aminjikarai,Chennai&t=&z=14&ie=UTF8&iwloc=&output=embed"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen={true}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="absolute inset-0 w-full h-full grayscale hover:grayscale-0 transition-all duration-700"
              ></iframe>
            </div>
          </motion.div>

          {/* Right: Contact Form */}
          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white/50 dark:bg-black/20 p-8 md:p-12 border border-black/5 dark:border-white/5 shadow-ambient rounded-sm relative overflow-hidden"
          >
            {isSuccess ? (
              <div className="absolute inset-0 bg-background flex flex-col items-center justify-center text-center p-8 z-10">
                <CheckCircle2 size={64} className="text-[#50C878] mb-6 animate-float" />
                <h3 className="font-serif text-3xl font-bold text-primary mb-2">Message Sent</h3>
                <p className="font-sans text-foreground/70">Thank you for reaching out. A consultant will reply to your enquiry within 24 hours.</p>
                <button 
                  onClick={() => setIsSuccess(false)}
                  className="mt-8 text-sm font-sans text-accent hover:text-primary transition-colors underline underline-offset-4"
                >
                  Send another message
                </button>
              </div>
            ) : null}

            <h2 className="font-serif text-3xl font-bold text-primary mb-8">Send an Enquiry</h2>
            
            <form onSubmit={handleSubmit} className="flex flex-col gap-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex flex-col gap-2">
                  <label htmlFor="name" className="text-xs font-sans font-semibold uppercase tracking-widest text-foreground/60">Full Name *</label>
                  <input 
                    type="text" 
                    id="name"
                    required
                    className="w-full p-4 bg-transparent border border-black/20 dark:border-white/20 rounded-sm focus:outline-none focus:border-primary transition-colors font-sans"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label htmlFor="phone" className="text-xs font-sans font-semibold uppercase tracking-widest text-foreground/60">Phone Number</label>
                  <input 
                    type="tel" 
                    id="phone"
                    className="w-full p-4 bg-transparent border border-black/20 dark:border-white/20 rounded-sm focus:outline-none focus:border-primary transition-colors font-sans"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <label htmlFor="email" className="text-xs font-sans font-semibold uppercase tracking-widest text-foreground/60">Email Address *</label>
                <input 
                  type="email" 
                  id="email"
                  required
                  className="w-full p-4 bg-transparent border border-black/20 dark:border-white/20 rounded-sm focus:outline-none focus:border-primary transition-colors font-sans"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label htmlFor="subject" className="text-xs font-sans font-semibold uppercase tracking-widest text-foreground/60">Subject</label>
                <select 
                  id="subject"
                  className="w-full p-4 bg-transparent border border-black/20 dark:border-white/20 rounded-sm focus:outline-none focus:border-primary transition-colors font-sans appearance-none"
                >
                  <option>Bridal Collection Enquiry</option>
                  <option>Bulk Order / Wholesale</option>
                  <option>Fabric Customization</option>
                  <option>General Support</option>
                </select>
              </div>

              <div className="flex flex-col gap-2">
                <label htmlFor="message" className="text-xs font-sans font-semibold uppercase tracking-widest text-foreground/60">Message *</label>
                <textarea 
                  id="message"
                  required
                  rows={5}
                  className="w-full p-4 bg-transparent border border-black/20 dark:border-white/20 rounded-sm focus:outline-none focus:border-primary transition-colors font-sans resize-none"
                ></textarea>
              </div>

              <button 
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 mt-2 bg-dark text-white font-sans font-semibold uppercase tracking-widest text-sm hover:bg-primary transition-colors flex items-center justify-center gap-2 shadow-ambient disabled:opacity-50"
              >
                {isSubmitting ? (
                  "Sending..."
                ) : (
                  <>
                    Send Message
                    <Send size={16} />
                  </>
                )}
              </button>
            </form>
          </motion.div>

        </div>
      </main>

      <Footer />
    </div>
  );
}
