"use client";

import { useEffect, useState } from "react";
import { collection, getDocs, query, limit } from "firebase/firestore";
import { db } from "@/lib/firebase/config";
import Navbar from "@/components/Navbar";
import { Heart, MessageCircle, Share2, ShoppingBag, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useCartStore } from "@/store/cartStore";

// Mock lifestyle images for the feed
const LIFESTYLE_IMAGES = [
  "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?w=800",
  "https://images.unsplash.com/photo-1550614000-4b95dd2475e1?w=800",
  "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=800"
];

export default function StyleFeedPage() {
  const [feedItems, setFeedItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeProduct, setActiveProduct] = useState<any | null>(null);
  const addItem = useCartStore(state => state.addItem);

  useEffect(() => {
    const fetchFeed = async () => {
      try {
        const q = query(collection(db, "products"), limit(3));
        const snap = await getDocs(q);
        
        const items = snap.docs.map((doc, idx) => ({
          id: `post-${idx}`,
          image: LIFESTYLE_IMAGES[idx] || LIFESTYLE_IMAGES[0],
          likes: Math.floor(Math.random() * 500) + 50,
          caption: "Loving this pure silk drape for the summer weddings! ✨ #JPSFashion #OOTD",
          product: { id: doc.id, ...doc.data() }
        }));
        
        setFeedItems(items);
      } catch (e) {
        console.error("Failed to fetch feed", e);
      } finally {
        setLoading(false);
      }
    };
    fetchFeed();
  }, []);

  const handleAddToCart = () => {
    if (activeProduct) {
      addItem({ product: activeProduct, quantity: 1, selectedVariant: activeProduct.variants?.[0] || null });
      setActiveProduct(null);
      alert("Added to cart!");
    }
  };

  return (
    <div className="min-h-screen bg-black">
      <Navbar />
      
      <main className="max-w-md mx-auto h-screen pt-20 pb-4 overflow-y-scroll snap-y snap-mandatory hide-scrollbar">
        {loading ? (
          <div className="h-full flex items-center justify-center text-white/50">Loading Feed...</div>
        ) : (
          feedItems.map((post) => (
            <div key={post.id} className="relative w-full h-[calc(100vh-80px)] snap-start shrink-0 bg-secondary mb-4 rounded-3xl overflow-hidden">
              
              {/* Main Image */}
              <Image src={post.image} alt="Lifestyle" fill className="object-cover" />
              
              {/* Overlay Gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20" />

              {/* Tag / Shoppable Link */}
              <button 
                onClick={() => setActiveProduct(post.product)}
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white/90 backdrop-blur-sm text-dark px-4 py-2 rounded-full font-bold text-xs uppercase tracking-widest shadow-xl flex items-center gap-2 hover:scale-105 transition-transform"
              >
                <ShoppingBag size={14} /> Shop The Look
              </button>

              {/* Post Info (Bottom) */}
              <div className="absolute bottom-0 left-0 w-full p-6 text-white">
                <p className="font-bold text-sm mb-2">@jps_studios</p>
                <p className="text-sm text-white/80 line-clamp-2">{post.caption}</p>
                
                {/* Actions */}
                <div className="flex items-center gap-6 mt-4">
                  <button className="flex items-center gap-2 hover:text-primary transition-colors">
                    <Heart size={24} /> <span className="text-xs font-bold">{post.likes}</span>
                  </button>
                  <button className="flex items-center gap-2 hover:text-white/80 transition-colors">
                    <MessageCircle size={24} />
                  </button>
                  <button className="flex items-center gap-2 hover:text-white/80 transition-colors">
                    <Share2 size={24} />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </main>

      {/* Shoppable Product Modal */}
      <AnimatePresence>
        {activeProduct && (
          <>
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setActiveProduct(null)}
              className="fixed inset-0 bg-black/60 z-50 backdrop-blur-sm"
            />
            <motion.div
              initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }}
              className="fixed bottom-0 left-0 w-full max-w-md mx-auto right-0 bg-white rounded-t-3xl p-6 z-50 shadow-2xl"
            >
              <button onClick={() => setActiveProduct(null)} className="absolute top-4 right-4 p-2 text-foreground/40 hover:text-dark">
                <X size={20} />
              </button>
              
              <h3 className="font-serif text-xl font-bold mb-4">Shop This Look</h3>
              
              <div className="flex gap-4 mb-6">
                <div className="w-24 h-32 relative bg-secondary rounded-sm overflow-hidden shrink-0">
                  {activeProduct.images?.[0] && <Image src={activeProduct.images[0]} alt={activeProduct.name} fill className="object-cover" />}
                </div>
                <div className="flex flex-col justify-center">
                  <p className="font-serif font-bold text-lg leading-tight mb-1">{activeProduct.name}</p>
                  <p className="text-xs text-foreground/50 uppercase tracking-widest mb-2">{activeProduct.material}</p>
                  <p className="font-bold font-sans">₹{activeProduct.price}</p>
                </div>
              </div>

              <div className="flex gap-3">
                <Link href={`/collections/${activeProduct.id}`} className="flex-1 text-center py-4 border border-black/10 font-bold uppercase tracking-widest text-xs hover:bg-secondary transition-colors">
                  View Details
                </Link>
                <button onClick={handleAddToCart} className="flex-[2] bg-primary text-white py-4 font-bold uppercase tracking-widest text-xs hover:bg-primary/90 transition-colors flex justify-center items-center gap-2">
                  <ShoppingBag size={14} /> Add to Cart
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
      
      <style dangerouslySetInnerHTML={{__html: `
        .hide-scrollbar::-webkit-scrollbar { display: none; }
        .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}} />
    </div>
  );
}
