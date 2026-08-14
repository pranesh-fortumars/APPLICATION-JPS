"use client";

import { useParams } from "next/navigation";
import { Product } from "@/lib/mockData";
import { notFound } from "next/navigation";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { useCartStore } from "@/store/cartStore";
import { ShoppingBag, Heart, Share2, Ruler, Weight, ShieldCheck, Scissors, MessageCircle } from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase/config";

// Helper for dot ratings
const DotRating = ({ rating, max = 5, label }: { rating: number, max?: number, label: string }) => (
  <div className="flex items-center justify-between py-2 border-b border-black/5">
    <span className="text-sm font-sans text-primary/70">{label}</span>
    <div className="flex gap-1">
      {[...Array(max)].map((_, i) => (
        <span 
          key={i} 
          className={`w-2 h-2 rounded-full ${i < rating ? 'bg-primary' : 'bg-primary/20'}`}
        />
      ))}
    </div>
  </div>
);

export default function ProductDetails() {
  const params = useParams();
  const id = params.id as string;
  const { addItem } = useCartStore();
  
  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProds, setRelatedProds] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [selectedColorIndex, setSelectedColorIndex] = useState(0);
  const [isSwatchModalOpen, setIsSwatchModalOpen] = useState(false);
  const [isZoomed, setIsZoomed] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const docRef = doc(db, "products", id);
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
          const prodData = { id: docSnap.id, ...docSnap.data() } as Product;
          setProduct(prodData);
          
          // Fetch related products
          if (prodData.relatedProducts && prodData.relatedProducts.length > 0) {
            const relatedPromises = prodData.relatedProducts.map(relId => getDoc(doc(db, "products", relId)));
            const relatedSnaps = await Promise.all(relatedPromises);
            const fetchedRelated = relatedSnaps
              .filter(snap => snap.exists())
              .map(snap => ({ id: snap.id, ...snap.data() } as Product));
            setRelatedProds(fetchedRelated);
          }
        }
      } catch (error) {
        console.error("Error fetching product:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchProduct();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <p className="text-xl font-serif animate-pulse">Loading luxury fabric...</p>
        </div>
        <Footer />
      </div>
    );
  }

  if (!product) {
    return notFound();
  }

  const selectedColor = product.colorVariants ? product.colorVariants[selectedColorIndex] : null;
  const mainImageIndex = selectedColor ? selectedColor.imageIndex : 0;
  const mainImage = product.images[mainImageIndex] || product.images[0];

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    setMousePos({ x, y });
  };

  const whatsappUrl = `https://wa.me/918939695455?text=${encodeURIComponent(
    `Hello JPS Fabrics,\n\nI am interested in:\nProduct: ${product.name}\nSKU: ${product.sku}\nColor: ${selectedColor?.name || 'Default'}\n\nPlease share availability and pricing.`
  )}`;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      
      <main className="flex-1 w-full mx-auto">
        <div className="max-w-[1440px] mx-auto px-6 md:px-20 py-32 grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Left: Image Gallery with Texture Zoom */}
          <div className="flex flex-col gap-6">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              onMouseEnter={() => setIsZoomed(true)}
              onMouseLeave={() => setIsZoomed(false)}
              onMouseMove={handleMouseMove}
              className="relative aspect-[3/4] w-full bg-secondary rounded-sm overflow-hidden cursor-crosshair shadow-ambient"
            >
              <Image 
                src={mainImage} 
                alt={product.name} 
                fill 
                sizes="(max-width: 1024px) 100vw, 50vw"
                className={`object-cover transition-opacity duration-300 ${isZoomed ? 'opacity-0' : 'opacity-100'}`}
                priority
              />
              {/* Zoomed Image Overlay */}
              <div 
                className={`absolute inset-0 bg-no-repeat transition-opacity duration-300 pointer-events-none ${isZoomed ? 'opacity-100' : 'opacity-0'}`}
                style={{
                  backgroundImage: `url(${mainImage})`,
                  backgroundPosition: `${mousePos.x}% ${mousePos.y}%`,
                  backgroundSize: '250%' // Zoom level
                }}
              />
            </motion.div>
            
            {/* Thumbnails */}
            {product.images.length > 1 && (
              <div className="grid grid-cols-4 gap-4">
                {product.images.map((img, i) => (
                  <button 
                    key={i}
                    onClick={() => {
                      // Attempt to map thumbnail back to color variant
                      const cvIndex = product.colorVariants?.findIndex(cv => cv.imageIndex === i);
                      if (cvIndex !== -1 && cvIndex !== undefined) setSelectedColorIndex(cvIndex);
                    }}
                    className={`relative aspect-square w-full bg-secondary rounded-sm overflow-hidden border-2 transition-colors ${mainImageIndex === i ? 'border-primary' : 'border-transparent'}`}
                  >
                    <Image src={img} alt={`${product.name} view ${i+1}`} fill sizes="25vw" className="object-cover hover:scale-105 transition-transform" />
                  </button>
                ))}
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
            <div className="flex items-center gap-2 text-sm text-primary/50 font-sans mb-8">
              <Link href="/" className="hover:text-primary transition-colors">Home</Link>
              <span>/</span>
              <Link href="/collections" className="hover:text-primary transition-colors">Collections</Link>
              <span>/</span>
              <span className="text-primary truncate">{product.name}</span>
            </div>

            <div className="mb-2 text-xs font-bold tracking-widest text-primary/50 uppercase">
              SKU: {product.sku}
            </div>

            <h1 className="font-serif text-4xl md:text-5xl font-bold text-primary mb-4 leading-tight">
              {product.name}
            </h1>
            
            <p className="text-2xl text-accent font-sans mb-8">₹{product.price} <span className="text-sm text-primary/40 font-light">per meter</span></p>

            <div className="h-px w-full bg-black/5 mb-8"></div>

            {/* Color Explorer */}
            {product.colorVariants && product.colorVariants.length > 0 && (
              <div className="mb-8">
                <p className="text-sm font-sans font-semibold uppercase tracking-widest text-primary/70 mb-4">
                  Color: <span className="text-primary">{selectedColor?.name}</span>
                </p>
                <div className="flex gap-4">
                  {product.colorVariants.map((color, idx) => (
                    <button
                      key={color.hex}
                      onClick={() => setSelectedColorIndex(idx)}
                      className={`w-10 h-10 rounded-full border-2 transition-all ${selectedColorIndex === idx ? 'border-primary scale-110 shadow-md' : 'border-black/10 hover:border-primary/50'}`}
                      style={{ backgroundColor: color.hex }}
                      title={color.name}
                      aria-label={`Select ${color.name}`}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="flex flex-col gap-4 mb-8">
              <button 
                onClick={() => addItem({ product, quantity: 1, selectedColor: selectedColor?.name })}
                className="w-full py-4 bg-primary text-white font-sans font-semibold uppercase tracking-widest text-sm hover:bg-primary/90 transition-colors flex items-center justify-center gap-2 shadow-ambient"
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
                  <MessageCircle size={18} />
                  WhatsApp Enquiry
                </Link>
                <button 
                  onClick={() => setIsSwatchModalOpen(true)}
                  className="flex-1 py-4 bg-transparent border border-primary text-primary font-sans font-semibold uppercase tracking-widest text-sm hover:bg-primary/5 transition-colors flex items-center justify-center gap-2"
                >
                  <Scissors size={18} />
                  Request Swatch
                </button>
              </div>
            </div>

            {/* Fabric Intelligence & Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mt-8 border-t border-black/5 pt-8">
              <div>
                <h3 className="font-serif font-bold text-xl mb-4">Fabric Details</h3>
                <div className="space-y-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-primary/60 font-semibold uppercase tracking-widest text-xs">Material</span>
                    <span className="text-primary font-medium">{product.material}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-primary/60 font-semibold uppercase tracking-widest text-xs">Width</span>
                    <span className="text-primary font-medium">{product.width}</span>
                  </div>
                  {product.gsm && (
                    <div className="flex justify-between text-sm">
                      <span className="text-primary/60 font-semibold uppercase tracking-widest text-xs">Weight</span>
                      <span className="text-primary font-medium">{product.gsm} GSM</span>
                    </div>
                  )}
                  {product.bestFor && (
                    <div className="flex justify-between text-sm">
                      <span className="text-primary/60 font-semibold uppercase tracking-widest text-xs">Best For</span>
                      <span className="text-primary font-medium text-right max-w-[150px]">{product.bestFor.join(", ")}</span>
                    </div>
                  )}
                </div>
              </div>

              {product.fabricSpecs && (
                <div>
                  <h3 className="font-serif font-bold text-xl mb-4">Characteristics</h3>
                  <div className="space-y-1">
                    <DotRating label="Softness" rating={product.fabricSpecs.softness} />
                    <DotRating label="Drape" rating={product.fabricSpecs.drape} />
                    <DotRating label="Weight" rating={product.fabricSpecs.weight} />
                    <DotRating label="Transparency" rating={product.fabricSpecs.transparency} />
                    <DotRating label="Sheen" rating={product.fabricSpecs.sheen} />
                  </div>
                </div>
              )}
            </div>

            {/* Description & Care */}
            <div className="mt-8 border-t border-black/5 pt-8 prose prose-p:font-light prose-p:text-primary/80">
              <p>{product.description}</p>
              {product.careInstructions && (
                <div className="mt-6 p-4 bg-secondary rounded-sm">
                  <span className="block text-xs font-bold uppercase tracking-widest mb-2 text-primary">Care Instructions</span>
                  <p className="text-sm m-0">{product.careInstructions}</p>
                </div>
              )}
            </div>
          </motion.div>
        </div>

        {/* Complete the Look Section */}
        {relatedProds.length > 0 && (
          <div className="max-w-[1440px] mx-auto px-6 md:px-20 py-24 border-t border-black/5">
            <h2 className="font-serif text-3xl font-bold text-primary mb-12 text-center">Complete The Look</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
              {relatedProds.map(relatedProd => (
                <Link key={relatedProd.id} href={`/collections/${relatedProd.id}`} className="group block">
                  <div className="relative aspect-[3/4] bg-secondary overflow-hidden mb-4 rounded-sm">
                    <Image src={relatedProd.images[0]} alt={relatedProd.name} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                  </div>
                  <h4 className="font-serif font-bold text-lg text-primary line-clamp-1">{relatedProd.name}</h4>
                  <p className="font-sans text-accent font-medium mt-1">₹{relatedProd.price}</p>
                </Link>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* Request Swatch Modal */}
      <AnimatePresence>
        {isSwatchModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              onClick={() => setIsSwatchModalOpen(false)}
            />
            <motion.div 
              initial={{ scale: 0.95, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.95, opacity: 0, y: 20 }}
              className="relative bg-white w-full max-w-lg p-8 m-6 rounded-sm shadow-2xl"
            >
              <button onClick={() => setIsSwatchModalOpen(false)} className="absolute top-4 right-4 text-primary/50 hover:text-primary">✕</button>
              <h3 className="font-serif text-3xl font-bold mb-2">Request a Swatch</h3>
              <p className="font-light text-primary/70 mb-6 text-sm">Not sure about the fabric? Request a physical swatch to feel the quality before buying.</p>
              
              <div className="flex gap-4 p-4 bg-secondary mb-6 rounded-sm">
                <div className="relative w-16 h-16 shrink-0 rounded-sm overflow-hidden">
                  <Image src={mainImage} alt={product.name} fill className="object-cover" />
                </div>
                <div>
                  <h4 className="font-serif font-bold line-clamp-1">{product.name}</h4>
                  <p className="text-xs text-primary/60 mt-1">Color: {selectedColor?.name || 'Default'}</p>
                </div>
              </div>

              <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); alert('Swatch request submitted successfully!'); setIsSwatchModalOpen(false); }}>
                <div>
                  <label className="block text-xs font-bold tracking-widest uppercase mb-1">Full Name</label>
                  <input type="text" required className="w-full border border-black/10 px-4 py-3 bg-transparent outline-none focus:border-primary" />
                </div>
                <div>
                  <label className="block text-xs font-bold tracking-widest uppercase mb-1">Shipping Address</label>
                  <textarea required rows={3} className="w-full border border-black/10 px-4 py-3 bg-transparent outline-none focus:border-primary resize-none"></textarea>
                </div>
                <button type="submit" className="w-full bg-primary text-white font-bold uppercase tracking-widest text-sm py-4 hover:bg-primary/90 transition-colors mt-4">
                  Request Swatch (Free)
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <Footer />
    </div>
  );
}
