"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { MessageCircle } from "lucide-react";

export default function FloatingWhatsApp() {
  const whatsappNumber = "918939695455";
  const defaultMessage = "Hello, I am interested in exploring your premium fabric collection.";

  return (
    <motion.div
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay: 2, duration: 0.5, type: "spring" }}
      className="fixed bottom-8 right-8 z-50 flex items-end justify-end group"
    >
      <div className="absolute right-20 bg-background border border-black/5 dark:border-white/5 shadow-xl px-4 py-3 rounded-2xl rounded-br-none opacity-0 translate-x-4 pointer-events-none group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 w-48 hidden md:block">
        <p className="text-sm font-sans font-medium text-foreground">
          Need Help?
          <span className="block text-xs text-foreground/60 font-normal mt-1">
            Chat with our luxury boutique advisors.
          </span>
        </p>
      </div>

      <Link
        href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(defaultMessage)}`}
        target="_blank"
        rel="noopener noreferrer"
        className="relative flex items-center justify-center w-16 h-16 bg-[#25D366] text-white rounded-full shadow-[0_4px_20px_rgba(37,211,102,0.4)] hover:shadow-[0_8px_30px_rgba(37,211,102,0.6)] transition-shadow duration-300 hover:scale-105"
      >
        <span className="absolute inset-0 rounded-full animate-ping bg-[#25D366] opacity-30"></span>
        <MessageCircle size={32} />
      </Link>
    </motion.div>
  );
}
