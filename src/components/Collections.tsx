"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import MagneticButton from "@/components/MagneticButton";

const collections = [
  {
    id: 1,
    title: "Women's Fabrics",
    image: "https://images.unsplash.com/photo-1596464716127-f2a82984de30?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    size: "large",
  },
  {
    id: 2,
    title: "Lining Materials",
    image: "https://images.unsplash.com/photo-1584916201218-f4242ceb4809?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    size: "small",
  },
  {
    id: 3,
    title: "Falls & Trims",
    image: "https://images.unsplash.com/photo-1620799140188-3b2a02fd9a77?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    size: "medium",
  },
  {
    id: 4,
    title: "Designer Silks",
    image: "https://images.unsplash.com/photo-1605518216938-7c31b7b14ad0?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    size: "medium",
  },
  {
    id: 5,
    title: "Printed Cottons",
    image: "https://images.unsplash.com/photo-1528360983277-13d401cdc186?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    size: "large",
  },
];

export default function Collections() {
  return (
    <section className="py-32 bg-background relative">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col items-center text-center mb-20">
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-accent font-sans tracking-[0.2em] uppercase text-sm font-semibold mb-4"
          >
            Curated For You
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-5xl md:text-6xl font-serif text-primary font-bold"
          >
            Featured Collections
          </motion.h2>
          <motion.div 
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="h-[1px] w-24 bg-accent mt-8 origin-left"
          />
        </div>

        {/* CSS Grid Masonry approximation */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 auto-rows-[300px]">
          {collections.map((collection, index) => {
            const isLarge = collection.size === "large";
            const isMedium = collection.size === "medium";
            
            return (
              <motion.div
                key={collection.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className={`group relative overflow-hidden rounded-sm cursor-pointer shadow-lg ${
                  isLarge ? "md:col-span-2 lg:col-span-2 lg:row-span-2" : 
                  isMedium ? "lg:col-span-1 lg:row-span-2" : "lg:col-span-1 lg:row-span-1"
                }`}
              >
                {/* Background Image with Zoom */}
                <div className="absolute inset-0 transition-transform duration-700 ease-out group-hover:scale-110">
                  <Image 
                    src={collection.image} 
                    alt={collection.title}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-cover"
                  />
                </div>

                {/* Dark Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-dark/90 via-dark/30 to-transparent transition-opacity duration-500 group-hover:opacity-80"></div>

                {/* Gold Border Reveal */}
                <div className="absolute inset-4 border border-accent/0 transition-colors duration-500 group-hover:border-accent/50 z-10"></div>

                {/* Content */}
                <div className="absolute inset-0 flex flex-col justify-end p-8 z-20" data-cursor="VIEW">
                  <h3 className="text-3xl font-serif text-light mb-2 translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                    {collection.title}
                  </h3>
                  
                  <div className="opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500 delay-100">
                    <button className="text-accent font-sans text-sm tracking-widest uppercase border-b border-accent pb-1">
                      View Collection
                    </button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
        
        <div className="mt-16 text-center">
          <MagneticButton strength={0.3}>
            <button className="px-10 py-4 bg-transparent border border-primary text-primary font-sans font-medium uppercase tracking-wider text-base hover:bg-primary hover:text-secondary transition-all duration-300">
              View All Fabrics
            </button>
          </MagneticButton>
        </div>
      </div>
    </section>
  );
}
