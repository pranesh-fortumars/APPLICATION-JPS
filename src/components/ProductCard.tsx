"use client";

import Image from "next/image";
import { Product } from "@/lib/mockData";
import { ShoppingBag, Eye } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  // Use the WhatsApp link for enquiries
  const whatsappUrl = `https://wa.me/918939695455?text=${encodeURIComponent(
    `Hello, I'm interested in this fabric: ${product.name} (Code: ${product.id}). Please share more details.`
  )}`;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      className="group flex flex-col w-full bg-white dark:bg-[#1a1a1a] overflow-hidden rounded-sm hover:shadow-2xl transition-all duration-500 border border-black/5 dark:border-white/5"
    >
      {/* Image Container with Hover Zoom and 2nd Image Reveal */}
      <div className="relative aspect-[3/4] overflow-hidden bg-secondary">
        <Image 
          src={product.images[0]} 
          alt={product.name}
          fill
          className="object-cover transition-opacity duration-500 group-hover:opacity-0"
        />
        {product.images[1] && (
          <Image 
            src={product.images[1]} 
            alt={`${product.name} alternate view`}
            fill
            className="object-cover opacity-0 transition-all duration-700 scale-105 group-hover:opacity-100 group-hover:scale-100"
          />
        )}
        
        {/* Badges */}
        <div className="absolute top-4 left-4 flex flex-col gap-2 z-10">
          {product.isNewArrival && (
            <span className="bg-primary text-white text-[10px] font-bold uppercase tracking-widest px-3 py-1 shadow-md">
              New
            </span>
          )}
          {product.availability === "Low Stock" && (
            <span className="bg-accent text-dark text-[10px] font-bold uppercase tracking-widest px-3 py-1 shadow-md">
              Low Stock
            </span>
          )}
        </div>

        {/* Quick Actions Overlay */}
        <div className="absolute inset-x-0 bottom-0 p-4 translate-y-full opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 ease-out bg-gradient-to-t from-dark/80 to-transparent flex gap-2 justify-center z-20">
          <Link 
            href={whatsappUrl} 
            target="_blank"
            className="flex items-center gap-2 bg-white text-dark px-4 py-3 font-medium text-xs uppercase tracking-wider hover:bg-accent hover:text-white transition-colors flex-1 justify-center"
          >
            <ShoppingBag size={14} />
            Enquire
          </Link>
          <button className="flex items-center justify-center bg-dark text-white px-4 py-3 hover:bg-primary transition-colors">
            <Eye size={16} />
          </button>
        </div>
      </div>

      {/* Product Details */}
      <div className="p-5 flex flex-col gap-2">
        <div className="text-xs text-primary/60 dark:text-secondary/60 uppercase tracking-widest font-semibold flex justify-between">
          <span>{product.material}</span>
          <span>{product.width}</span>
        </div>
        
        <h3 className="font-serif text-lg font-bold text-dark dark:text-light line-clamp-1 group-hover:text-primary transition-colors">
          {product.name}
        </h3>
        
        <div className="flex items-center justify-between mt-2">
          <p className="font-sans font-medium text-primary dark:text-accent">
            ₹{product.price} <span className="text-xs text-foreground/50 line-through">₹{Math.floor(product.price * 1.2)}</span>
          </p>
          
          {/* Color Swatches */}
          <div className="flex gap-1">
            {product.colors.slice(0, 3).map((color, i) => (
              <span 
                key={i}
                className="w-4 h-4 rounded-full border border-black/10 dark:border-white/20"
                style={{ backgroundColor: color }}
                title={color}
              />
            ))}
            {product.colors.length > 3 && (
              <span className="w-4 h-4 rounded-full flex items-center justify-center text-[8px] bg-secondary text-dark border border-black/10">
                +{product.colors.length - 3}
              </span>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
