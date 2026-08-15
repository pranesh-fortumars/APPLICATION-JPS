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
import { mockProducts } from "@/lib/mockData";
import { ChevronLeft } from "lucide-react";

// Mock lifestyle images for the feed
const LIFESTYLE_IMAGES = [
  "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?w=800",
  "https://images.unsplash.com/photo-1620799140188-3b2a02fd9a77?w=800",
  "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=800"
];

export default function StyleFeedPage() {
  const [feedItems, setFeedItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeProduct, setActiveProduct] = useState<any | null>(null);
  const [likedPosts, setLikedPosts] = useState<Set<string>>(new Set());
  const [showLikeAnimation, setShowLikeAnimation] = useState<string | null>(null);
  const addItem = useCartStore(state => state.addItem);

  useEffect(() => {
    const fetchFeed = async () => {
      try {
        const q = query(collection(db, "products"), limit(3));
        const snap = await getDocs(q);
        
        let items = [];
        
        if (snap.docs.length === 0) {
          // Fallback to mock products
          items = mockProducts.slice(0, 3).map((doc, idx) => ({
            id: `post-${idx}`,
            image: LIFESTYLE_IMAGES[idx] || LIFESTYLE_IMAGES[0],
            likes: Math.floor(Math.random() * 500) + 50,
            caption: "Loving this pure silk drape for the summer weddings! ✨ #JPSFashion #OOTD",
            product: doc
          }));
        } else {
          items = snap.docs.map((doc, idx) => ({
            id: `post-${idx}`,
            image: LIFESTYLE_IMAGES[idx] || LIFESTYLE_IMAGES[0],
            likes: Math.floor(Math.random() * 500) + 50,
            caption: "Loving this pure silk drape for the summer weddings! ✨ #JPSFashion #OOTD",
            product: { id: doc.id, ...doc.data() }
          }));
        }
        
        setFeedItems(items);
      } catch (e) {
        console.error("Failed to fetch feed", e);
        // Fallback to mock products on error
        const mockItems = mockProducts.slice(0, 3).map((doc, idx) => ({
          id: `post-${idx}`,
          image: LIFESTYLE_IMAGES[idx] || LIFESTYLE_IMAGES[0],
          likes: Math.floor(Math.random() * 500) + 50,
          caption: "Loving this pure silk drape for the summer weddings! ✨ #JPSFashion #OOTD",
          product: doc,
          relatedProducts: mockProducts.filter(p => p.id !== doc.id).slice(0, 2)
        }));
        setFeedItems(mockItems);
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

  const handleDoubleTap = (postId: string) => {
    toggleLike(postId);
    setShowLikeAnimation(postId);
    setTimeout(() => setShowLikeAnimation(null), 1000);
  };

  const toggleLike = (postId: string) => {
    setLikedPosts(prev => {
      const newSet = new Set(prev);
      if (newSet.has(postId)) {
        newSet.delete(postId);
      } else {
        newSet.add(postId);
      }
      return newSet;
    });
  };

  return (
    <div className="fixed inset-0 bg-black z-[100]">
      {/* Minimalist Top Nav for Feed */}
      <div className="absolute top-0 left-0 w-full p-6 z-[60] flex justify-between items-center bg-gradient-to-b from-black/60 to-transparent">
        <Link href="/" className="text-white hover:text-white/80 transition-colors">
          <ChevronLeft size={28} />
        </Link>
        <h1 className="text-white font-serif font-bold text-xl tracking-widest uppercase">Style Feed</h1>
        <div className="w-7" /> {/* Spacer */}
      </div>
      
      <main className="w-full h-full md:max-w-md md:mx-auto overflow-y-scroll snap-y snap-mandatory hide-scrollbar relative bg-black">
        {loading ? (
          <div className="h-full flex items-center justify-center text-white/50">Loading Feed...</div>
        ) : (
          feedItems.map((post) => {
            const isLiked = likedPosts.has(post.id);
            return (
              <div key={post.id} className="relative w-full h-full snap-start shrink-0 overflow-hidden" onDoubleClick={() => handleDoubleTap(post.id)}>
                
                {/* Main Image */}
                <Image src={post.image} alt="Lifestyle" fill className="object-cover" priority />
                
                {/* Overlay Gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent pointer-events-none" />

                {/* Double Tap Like Animation */}
                <AnimatePresence>
                  {showLikeAnimation === post.id && (
                    <motion.div
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1.5, opacity: 1 }}
                      exit={{ scale: 2, opacity: 0 }}
                      transition={{ duration: 0.5, ease: "easeOut" }}
                      className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white pointer-events-none drop-shadow-2xl"
                    >
                      <Heart size={100} className="fill-white" />
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Shoppable Tags */}
                <div className="absolute top-[40%] right-6 flex flex-col gap-4">
                  <button 
                    onClick={() => setActiveProduct(post.product)}
                    className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-full flex flex-col items-center justify-center text-white hover:bg-white/40 transition-colors border border-white/20 shadow-lg"
                  >
                    <ShoppingBag size={20} />
                  </button>
                </div>

                {/* Post Info (Bottom) */}
                <div className="absolute bottom-0 left-0 w-full p-6 pb-12 flex items-end justify-between">
                  <div className="flex-1 pr-12 text-white">
                    <p className="font-bold text-lg mb-2 flex items-center gap-2">
                      @jps_studios <span className="text-[10px] bg-primary text-white px-2 py-0.5 rounded-sm uppercase tracking-widest font-bold">Follow</span>
                    </p>
                    <p className="text-sm text-white/90 font-light mb-4">{post.caption}</p>
                    
                    {/* Featured Product Banner */}
                    <button 
                      onClick={() => setActiveProduct(post.product)}
                      className="w-full max-w-[280px] bg-white/10 backdrop-blur-md border border-white/20 p-3 rounded-xl flex items-center gap-4 hover:bg-white/20 transition-colors text-left"
                    >
                      <div className="w-12 h-12 bg-secondary rounded-lg overflow-hidden shrink-0 relative">
                        {post.product.images?.[0] && <Image src={post.product.images[0]} alt="Product" fill className="object-cover" />}
                      </div>
                      <div className="flex-1 overflow-hidden">
                        <p className="text-white font-bold text-sm truncate">{post.product.name}</p>
                        <p className="text-white/70 text-xs">₹{post.product.price} • Shop Now</p>
                      </div>
                    </button>
                  </div>
                  
                  {/* Right Side Actions */}
                  <div className="flex flex-col items-center gap-6 text-white pb-4">
                    <button onClick={() => toggleLike(post.id)} className="flex flex-col items-center gap-1 hover:scale-110 transition-transform">
                      <div className="w-10 h-10 bg-black/20 backdrop-blur-sm rounded-full flex items-center justify-center border border-white/10">
                        <Heart size={22} className={isLiked ? "fill-red-500 text-red-500" : ""} />
                      </div>
                      <span className="text-xs font-bold">{isLiked ? post.likes + 1 : post.likes}</span>
                    </button>
                    <button className="flex flex-col items-center gap-1 hover:scale-110 transition-transform">
                      <div className="w-10 h-10 bg-black/20 backdrop-blur-sm rounded-full flex items-center justify-center border border-white/10">
                        <MessageCircle size={22} />
                      </div>
                      <span className="text-xs font-bold">12</span>
                    </button>
                    <button className="flex flex-col items-center gap-1 hover:scale-110 transition-transform">
                      <div className="w-10 h-10 bg-black/20 backdrop-blur-sm rounded-full flex items-center justify-center border border-white/10">
                        <Share2 size={22} />
                      </div>
                      <span className="text-xs font-bold">Share</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </main>

      {/* Shoppable Product Modal */}
      <AnimatePresence>
        {activeProduct && (
          <>
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setActiveProduct(null)}
              className="fixed inset-0 bg-black/60 z-[110] backdrop-blur-sm"
            />
            <motion.div
              initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }}
              className="fixed bottom-0 left-0 w-full max-w-md mx-auto right-0 bg-white rounded-t-3xl p-6 z-[120] shadow-2xl"
            >
              <div className="w-12 h-1.5 bg-black/10 rounded-full mx-auto mb-6" />
              
              <button onClick={() => setActiveProduct(null)} className="absolute top-6 right-6 p-2 bg-secondary rounded-full text-foreground/40 hover:text-dark transition-colors">
                <X size={20} />
              </button>
              
              <h3 className="font-serif text-xl font-bold mb-6">Shop The Look</h3>
              
              <div className="flex gap-4 mb-6 p-3 border border-primary/20 bg-primary/5 rounded-xl">
                <div className="w-24 h-32 relative bg-secondary rounded-lg overflow-hidden shrink-0 shadow-sm">
                  {activeProduct.images?.[0] && <Image src={activeProduct.images[0]} alt={activeProduct.name} fill className="object-cover" />}
                </div>
                <div className="flex flex-col justify-center flex-1">
                  <p className="font-serif font-bold text-lg leading-tight mb-1 line-clamp-2">{activeProduct.name}</p>
                  <p className="text-xs text-foreground/50 uppercase tracking-widest mb-2">{activeProduct.material}</p>
                  <p className="font-bold font-sans text-primary text-xl">₹{activeProduct.price}</p>
                </div>
              </div>

              {activeProduct.relatedProducts && activeProduct.relatedProducts.length > 0 && (
                <div className="mb-6">
                  <p className="text-xs font-bold uppercase tracking-widest text-foreground/50 mb-3">Complete The Look</p>
                  <div className="flex gap-3 overflow-x-auto hide-scrollbar pb-2">
                    {activeProduct.relatedProducts.map((p: any) => (
                      <Link href={`/collections/${p.id}`} key={p.id} className="w-24 shrink-0 group">
                        <div className="w-full h-24 bg-secondary rounded-lg overflow-hidden relative mb-2 border border-black/5 group-hover:border-primary transition-colors">
                          {p.images?.[0] && <Image src={p.images[0]} alt={p.name} fill className="object-cover" />}
                        </div>
                        <p className="text-[10px] font-bold line-clamp-1 group-hover:text-primary transition-colors">{p.name}</p>
                        <p className="text-[10px] text-foreground/60">₹{p.price}</p>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex gap-3">
                <Link href={`/collections/${activeProduct.id}`} className="flex-1 text-center py-4 border border-black/10 rounded-xl font-bold uppercase tracking-widest text-xs hover:bg-secondary transition-colors">
                  View Details
                </Link>
                <button onClick={handleAddToCart} className="flex-[2] bg-primary text-white rounded-xl py-4 font-bold uppercase tracking-widest text-xs hover:bg-primary/90 transition-colors flex justify-center items-center gap-2 shadow-lg shadow-primary/30">
                  <ShoppingBag size={16} /> Add to Cart
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
