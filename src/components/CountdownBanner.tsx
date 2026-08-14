"use client";

import { useState, useEffect } from "react";
import { X, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function CountdownBanner() {
  const [isVisible, setIsVisible] = useState(true);
  
  // Hardcode a target date to 2 hours from now for the demo
  const [timeLeft, setTimeLeft] = useState(2 * 60 * 60); 

  useEffect(() => {
    if (!isVisible) return;
    
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    
    return () => clearInterval(timer);
  }, [isVisible]);

  if (!isVisible) return null;

  const hours = Math.floor(timeLeft / 3600);
  const minutes = Math.floor((timeLeft % 3600) / 60);
  const seconds = timeLeft % 60;

  return (
    <AnimatePresence>
      <motion.div 
        initial={{ height: 0, opacity: 0 }}
        animate={{ height: "auto", opacity: 1 }}
        exit={{ height: 0, opacity: 0 }}
        className="w-full bg-dark text-white relative z-[60] overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/20 to-transparent animate-[shimmer_2s_infinite]" />
        
        <div className="max-w-7xl mx-auto px-4 py-2 flex flex-col md:flex-row items-center justify-center gap-2 md:gap-6 relative">
          <div className="flex items-center gap-2 text-xs md:text-sm font-bold uppercase tracking-widest text-primary">
            <Sparkles size={14} /> Flash Sale
          </div>
          
          <p className="text-xs md:text-sm font-medium opacity-90 text-center">
            Use code <span className="font-bold text-white bg-white/20 px-2 py-0.5 rounded-sm mx-1">WELCOME10</span> for 10% off your entire order!
          </p>
          
          <div className="flex items-center gap-2 text-sm font-bold font-sans tabular-nums">
            <div className="bg-white/10 px-2 py-1 rounded-sm min-w-[32px] text-center">{hours.toString().padStart(2, '0')}</div>
            <span className="opacity-50">:</span>
            <div className="bg-white/10 px-2 py-1 rounded-sm min-w-[32px] text-center">{minutes.toString().padStart(2, '0')}</div>
            <span className="opacity-50">:</span>
            <div className="bg-white/10 px-2 py-1 rounded-sm min-w-[32px] text-center text-primary">{seconds.toString().padStart(2, '0')}</div>
          </div>

          <button 
            onClick={() => setIsVisible(false)}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-white/50 hover:text-white transition-colors p-1"
          >
            <X size={16} />
          </button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
