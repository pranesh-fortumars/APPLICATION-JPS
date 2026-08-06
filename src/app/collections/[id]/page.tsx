"use client";

import { useParams } from "next/navigation";
import { mockProducts } from "@/lib/mockData";
import { notFound } from "next/navigation";
import Image from "next/image";
import { motion } from "framer-motion";
import { useCartStore } from "@/store/cartStore";
import { ShoppingBag, Heart, Share2, Ruler, Weight, ShieldCheck } from "lucide-react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function ProductDetails() {
  const params = useParams();
  const id = params.id as string;
  const product = mockProducts.find((p) => p.id === id);
  const { addItem } = useCartStore();

  if (!product) {
    return notFound();
  }

  const whatsappUrl = `https://wa.me/918939695455?text=${encodeURIComponent(
    `Hello, I'm interested in this fabric: ${product.name} (Code: ${product.id}). Please share more details.`
  )}`;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      
      <main className="flex-1 max-w-[1440px] w-full mx-auto px-6 md:px-20 py-32 grid grid-cols-1 lg:grid-cols-2 gap-16">
        {/* Left: Image Gallery */}
        <div className="flex flex-col gap-6">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative aspect-[3/4] w-full bg-secondary rounded-sm overflow-hidden group cursor-zoom-in shadow-ambient"
          >
            <Image 
              src={product.images[0]} 
              alt={product.name} 
              fill 
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover transition-transform duration-700 group-hover:scale-110"
              priority
            />
          </motion.div>
          {product.images[1] && (
            <div className="grid grid-cols-2 gap-6">
              <div className="relative aspect-square w-full bg-secondary rounded-sm overflow-hidden shadow-sm">
                <Image src={product.images[1]} alt="Alternate view" fill sizes="25vw" className="object-cover hover:scale-105 transition-transform" />
              </div>
            </div>
          )}
        </div>

        {/* Right: Product Info */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="flex flex-col sticky top-32 h-fit"
        >
          {/* Breadcrumbs */}
          <div className="flex items-center gap-2 text-sm text-foreground/50 font-sans mb-8">
            <Link href="/" className="hover:text-primary transition-colors">Home</Link>
            <span>/</span>
            <Link href="/collections" className="hover:text-primary transition-colors">Collections</Link>
            <span>/</span>
            <span className="text-primary truncate">{product.name}</span>
          </div>

          <h1 className="font-serif text-4xl md:text-5xl font-bold text-primary mb-4 leading-tight">
            {product.name}
          </h1>
          
          <p className="text-2xl text-accent font-sans mb-8">₹{product.price} <span className="text-sm text-foreground/40 font-light">per meter</span></p>

          <div className="h-px w-full bg-black/10 dark:bg-white/10 mb-8"></div>

          {/* Specifications */}
          <div className="grid grid-cols-2 gap-6 mb-10">
            <div className="flex items-start gap-3">
              <Ruler className="text-primary mt-1" size={20} />
              <div>
                <p className="text-xs font-semibold uppercase tracking-widest text-foreground/50">Width</p>
                <p className="font-sans text-foreground">{product.width}</p>
              </div>
            </div>
            {product.gsm && (
              <div className="flex items-start gap-3">
                <Weight className="text-primary mt-1" size={20} />
                <div>
                  <p className="text-xs font-semibold uppercase tracking-widest text-foreground/50">GSM</p>
                  <p className="font-sans text-foreground">{product.gsm}</p>
                </div>
              </div>
            )}
            <div className="flex items-start gap-3">
              <ShieldCheck className="text-primary mt-1" size={20} />
              <div>
                <p className="text-xs font-semibold uppercase tracking-widest text-foreground/50">Material</p>
                <p className="font-sans text-foreground">{product.material}</p>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col gap-4 mb-12">
            <button 
              onClick={() => addItem({ product, quantity: 1 })}
              className="w-full py-4 bg-dark text-white font-sans font-semibold uppercase tracking-widest text-sm hover:bg-primary transition-colors flex items-center justify-center gap-2 shadow-ambient"
            >
              <ShoppingBag size={18} />
              Add to Cart
            </button>
            <div className="flex gap-4">
              <Link 
                href={whatsappUrl}
                target="_blank"
                className="flex-1 py-4 bg-[#25D366] text-white font-sans font-semibold uppercase tracking-widest text-sm hover:bg-[#20bd5a] transition-colors flex items-center justify-center gap-2"
              >
                WhatsApp Enquiry
              </Link>
              <button className="px-6 border border-black/10 dark:border-white/10 flex items-center justify-center hover:bg-black/5 dark:hover:bg-white/5 transition-colors">
                <Heart size={20} className="text-foreground/60" />
              </button>
              <button className="px-6 border border-black/10 dark:border-white/10 flex items-center justify-center hover:bg-black/5 dark:hover:bg-white/5 transition-colors">
                <Share2 size={20} className="text-foreground/60" />
              </button>
            </div>
          </div>

          {/* Description */}
          <div className="prose dark:prose-invert font-sans text-foreground/80 font-light">
            <p>
              Experience the unmatched luxury of our {product.name}. This exquisite piece is crafted from premium {product.material.toLowerCase()}, offering a perfect drape and exceptional comfort. The {product.pattern.toLowerCase()} pattern ensures you stand out in any elegant setting.
            </p>
            <p className="mt-4">
              Ideal for bespoke tailoring, bridal wear, and high-end fashion creations. We recommend dry cleaning to preserve the rich texture and vibrant colors of this fabric.
            </p>
          </div>
        </motion.div>
      </main>

      <Footer />
    </div>
  );
}
