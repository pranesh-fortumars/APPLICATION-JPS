"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";

const journalPosts = [
  {
    id: 1,
    title: "Bridal Trends 2024: Beyond the Red Saree",
    category: "Styling Inspiration",
    date: "Aug 15, 2024",
    img: "https://images.unsplash.com/photo-1584916201218-f4242ceb4809?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    height: "h-[400px]"
  },
  {
    id: 2,
    title: "Behind the Loom: The Weavers of Banaras",
    category: "Heritage",
    date: "Aug 02, 2024",
    img: "https://images.unsplash.com/photo-1605518216938-7c31b7b14ad0?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    height: "h-[500px]"
  },
  {
    id: 3,
    title: "Minimalist Festive Wear",
    category: "Fashion",
    date: "Jul 28, 2024",
    img: "https://images.unsplash.com/photo-1596464716127-f2a82984de30?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    height: "h-[450px]"
  },
  {
    id: 4,
    title: "Choosing the Right Lining for Sheer Fabrics",
    category: "Tailoring Tips",
    date: "Jul 15, 2024",
    img: "https://images.unsplash.com/photo-1620799140188-3b2a02fd9a77?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    height: "h-[350px]"
  }
];

export default function JournalPage() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      
      <main className="flex-1 pt-32 pb-24">
        <div className="max-w-7xl mx-auto px-6 text-center mb-16">
          <p className="text-primary/70 tracking-[0.2em] uppercase text-sm font-semibold mb-4">Editorial</p>
          <h1 className="text-4xl md:text-6xl font-serif font-bold text-primary mb-6">The JPS Journal</h1>
          <p className="text-foreground/70 font-sans text-lg max-w-2xl mx-auto">
            Discover styling inspiration, trend reports, and stories celebrating the rich heritage of Indian textiles.
          </p>
        </div>

        {/* Masonry-style Grid Approximation */}
        <div className="max-w-7xl mx-auto px-6">
          <div className="columns-1 md:columns-2 gap-8 space-y-8">
            {journalPosts.map((post, i) => (
              <motion.div 
                key={post.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: (i % 2) * 0.2 }}
                className="break-inside-avoid group cursor-pointer"
              >
                <Link href={`/journal/${post.id}`}>
                  <div className={`relative w-full ${post.height} overflow-hidden mb-4 bg-secondary rounded-sm`}>
                    <Image 
                      src={post.img} 
                      alt={post.title} 
                      fill 
                      className="object-cover group-hover:scale-105 transition-transform duration-700" 
                    />
                    <div className="absolute top-4 left-4 bg-white px-3 py-1 text-xs font-bold uppercase tracking-widest z-10 shadow-sm">
                      {post.category}
                    </div>
                  </div>
                  <h2 className="text-2xl font-serif font-bold mb-2 group-hover:text-primary transition-colors">{post.title}</h2>
                  <p className="text-foreground/50 text-sm font-sans">{post.date}</p>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
