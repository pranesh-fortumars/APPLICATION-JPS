"use client";

import Image from "next/image";
import { Product } from "@/lib/mockData";
import { ShoppingBag, Eye, MessageCircle, Heart } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useCartStore } from "@/store/cartStore";
import { useWishlistStore } from "@/store/wishlistStore";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addItem } = useCartStore();
  const { toggleItem, isInWishlist } = useWishlistStore();
  const isSaved = isInWishlist(product.id);

  // Use the WhatsApp link for enquiries
  const whatsappUrl = `https://wa.me/918939695455?text=${encodeURIComponent(
    `Hello, I'm interested in this fabric: ${product.name} (Code: ${product.id}). Please share more details.`
  )}`;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      className="group flex flex-col w-full bg-white dark:bg-[#1a1a1a] rounded-sm hover:shadow-2xl transition-all duration-500 border border-black/5 dark:border-white/5 overflow-hidden"
    >
      {/* Image Container */}
      <div className="relative w-full aspect-[3/4] bg-secondary overflow-hidden">
        
        {/* Clickable Image Area */}
        <Link href={`/collections/${product.id}`} className="absolute inset-0 z-0">
          <Image 
            src={product.images[0]} 
            alt={product.name}
            fill
            priority={product.id === "p-001" || product.id === "p-002"}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover transition-opacity duration-500 group-hover:opacity-0"
          />
          {product.images[1] && (
            <Image 
              src={product.images[1]} 
              alt={`${product.name} alternate view`}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="object-cover opacity-0 transition-all duration-700 scale-105 group-hover:opacity-100 group-hover:scale-100"
            />
          )}
        </Link>
        
        {/* Badges */}
        <div className="absolute top-4 left-4 flex flex-col gap-2 z-10 pointer-events-none">
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

        {/* Wishlist Button */}
        <button
          onClick={(e) => { e.preventDefault(); e.stopPropagation(); toggleItem(product); }}
          className={`absolute top-4 right-4 z-20 w-8 h-8 rounded-full flex items-center justify-center bg-white/80 backdrop-blur-sm shadow-sm transition-colors hover:bg-white ${isSaved ? 'text-red-500' : 'text-primary/50 hover:text-primary'}`}
          aria-label={isSaved ? "Remove from wishlist" : "Add to wishlist"}
        >
          <Heart size={16} className={isSaved ? "fill-red-500" : ""} />
        </button>

        {/* Quick Actions Overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-full opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 ease-out bg-gradient-to-t from-dark/90 to-transparent flex flex-col gap-2 z-20 pointer-events-auto">
          <button 
            onClick={(e) => { e.preventDefault(); addItem({ product, quantity: 1 }); }}
            className="flex items-center gap-2 bg-dark text-white px-4 py-3 font-medium text-xs uppercase tracking-wider hover:bg-primary transition-colors justify-center w-full shadow-lg"
          >
            <ShoppingBag size={14} />
            Add to Cart
          </button>
          
          <div className="flex gap-2">
            <a 
              href={whatsappUrl} 
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 bg-[#25D366] text-white px-4 py-3 font-medium text-xs uppercase tracking-wider hover:bg-[#20bd5a] transition-colors flex-1 justify-center shadow-lg"
              onClick={(e) => e.stopPropagation()}
            >
              <MessageCircle size={14} />
              WhatsApp
            </a>
            <Link 
              href={`/collections/${product.id}`} 
              className="flex items-center justify-center bg-white text-dark px-4 py-3 hover:bg-accent hover:text-white transition-colors shadow-lg"
              onClick={(e) => e.stopPropagation()}
            >
              <Eye size={16} />
            </Link>
          </div>
        </div>
      </div>

      {/* Product Details */}
      <Link href={`/collections/${product.id}`} className="p-5 flex flex-col gap-2 bg-white dark:bg-[#1a1a1a] z-10 relative">
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
      </Link>
    </motion.div>
  );
}
