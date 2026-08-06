"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { Plus, Minus, Search } from "lucide-react";

const faqs = [
  {
    category: "Ordering & Shipping",
    questions: [
      { q: "Do you offer international shipping?", a: "Yes, we ship globally. However, shipping rates and times vary by country. Please contact us directly for international wholesale orders." },
      { q: "How do I track my order?", a: "Once your order has shipped, you will receive an email with a tracking number and a link to trace your delivery." },
      { q: "What is the minimum order quantity?", a: "For retail customers, the minimum cut is 1 meter. For wholesale and boutique orders, please contact our support team for specialized pricing." }
    ]
  },
  {
    category: "Fabrics & Care",
    questions: [
      { q: "How should I care for Banarasi silk?", a: "We strongly recommend dry cleaning only for our pure silk and Banarasi fabrics to maintain their sheen and structural integrity." },
      { q: "Are the colors on the website exactly as they appear?", a: "We take great care to photograph our fabrics under neutral lighting. However, due to varying monitor calibrations, slight variations in color may occur." },
      { q: "Can I order a swatch before purchasing?", a: "Yes, swatch requests can be made via our WhatsApp enquiry line for a nominal shipping fee." }
    ]
  },
  {
    category: "Returns & Exchanges",
    questions: [
      { q: "Can I return a fabric if I don't like it?", a: "Because fabrics are cut specifically to your requested measurements, we cannot accept returns for change of mind. Please see our Refund Policy for details on defective items." },
      { q: "What do I do if my fabric arrives damaged?", a: "Contact us within 48 hours of delivery with photographic evidence, and we will arrange a replacement or full refund immediately." }
    ]
  }
];

export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const toggleFAQ = (id: string) => {
    setOpenIndex(openIndex === id ? null : id);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-[800px] w-full mx-auto px-6 md:px-20 py-32">
        <div className="text-center mb-16">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="font-serif text-4xl md:text-5xl font-bold text-primary mb-6"
          >
            Frequently Asked Questions
          </motion.h1>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="relative max-w-md mx-auto mt-8"
          >
            <input 
              type="text" 
              placeholder="Search for an answer..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full p-4 pl-12 bg-transparent border border-black/20 dark:border-white/20 rounded-sm focus:outline-none focus:border-primary transition-colors font-sans"
            />
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-foreground/40" size={20} />
          </motion.div>
        </div>

        <div className="flex flex-col gap-12">
          {faqs.map((section, sIdx) => {
            const filteredQuestions = section.questions.filter(
              q => q.q.toLowerCase().includes(searchQuery.toLowerCase()) || q.a.toLowerCase().includes(searchQuery.toLowerCase())
            );

            if (filteredQuestions.length === 0) return null;

            return (
              <motion.div 
                key={sIdx}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + sIdx * 0.1 }}
              >
                <h2 className="font-serif text-2xl font-bold text-primary mb-6">{section.category}</h2>
                <div className="flex flex-col gap-4">
                  {filteredQuestions.map((item, qIdx) => {
                    const id = `${sIdx}-${qIdx}`;
                    const isOpen = openIndex === id;

                    return (
                      <div 
                        key={id} 
                        className="border border-black/10 dark:border-white/10 rounded-sm overflow-hidden bg-white/50 dark:bg-black/20"
                      >
                        <button 
                          onClick={() => toggleFAQ(id)}
                          className="w-full p-6 text-left flex justify-between items-center hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
                        >
                          <span className="font-sans font-semibold text-primary pr-8">{item.q}</span>
                          {isOpen ? <Minus className="text-accent shrink-0" size={20} /> : <Plus className="text-foreground/40 shrink-0" size={20} />}
                        </button>
                        <AnimatePresence>
                          {isOpen && (
                            <motion.div 
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: "auto", opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.3 }}
                              className="overflow-hidden"
                            >
                              <div className="p-6 pt-0 border-t border-black/5 dark:border-white/5 mt-2">
                                <p className="font-sans text-foreground/80 font-light mt-4 leading-relaxed">{item.a}</p>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    );
                  })}
                </div>
              </motion.div>
            );
          })}
        </div>
      </main>

      <Footer />
    </div>
  );
}
