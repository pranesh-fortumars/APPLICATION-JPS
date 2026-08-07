"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { ChevronRight } from "lucide-react";

const libraries = [
  {
    title: "The Silk Guide",
    desc: "From Kanchipuram to Banaras: Understand the weaves, purity, and heritage of Indian silks.",
    img: "https://images.unsplash.com/photo-1605518216938-7c31b7b14ad0?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
  },
  {
    title: "Mastering Organza",
    desc: "How to handle, stitch, and care for this delicate, sheer, and incredibly elegant fabric.",
    img: "https://images.unsplash.com/photo-1596464716127-f2a82984de30?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
  },
  {
    title: "Cotton Essentials",
    desc: "Breathable and versatile. Explore the different weights and weaves of pure cotton.",
    img: "https://images.unsplash.com/photo-1528360983277-13d401cdc186?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
  },
  {
    title: "The Perfect Lining",
    desc: "Why your lining choice matters just as much as your outer fabric. A complete guide.",
    img: "https://images.unsplash.com/photo-1620799140188-3b2a02fd9a77?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
  }
];

export default function LibraryPage() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      
      <main className="flex-1 pt-32 pb-24">
        <div className="max-w-7xl mx-auto px-6 text-center mb-16">
          <p className="text-primary/70 tracking-[0.2em] uppercase text-sm font-semibold mb-4">Textile Education</p>
          <h1 className="text-4xl md:text-6xl font-serif font-bold text-primary mb-6">The Fabric Library</h1>
          <p className="text-foreground/70 font-sans text-lg max-w-2xl mx-auto">
            Deepen your understanding of textiles. Learn how to identify quality, choose the right drape for your design, and care for luxury materials.
          </p>
        </div>

        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {libraries.map((lib, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="group flex flex-col bg-white border border-black/5 hover:shadow-2xl transition-all duration-500"
              >
                <div className="relative aspect-[16/9] overflow-hidden">
                  <Image src={lib.img} alt={lib.title} fill className="object-cover group-hover:scale-105 transition-transform duration-700" />
                </div>
                <div className="p-8 flex flex-col flex-1">
                  <h2 className="text-2xl font-serif font-bold mb-3 group-hover:text-primary transition-colors">{lib.title}</h2>
                  <p className="text-foreground/70 mb-8 flex-1">{lib.desc}</p>
                  <Link href={`/library/${lib.title.toLowerCase().replace(/ /g, "-")}`} className="flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-primary hover:text-accent transition-colors w-fit">
                    Read Guide <ChevronRight size={16} />
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
