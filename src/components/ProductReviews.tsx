"use client";

import { useState, useEffect } from "react";
import { collection, query, where, getDocs, addDoc, orderBy } from "firebase/firestore";
import { db } from "@/lib/firebase/config";
import { useAuth } from "@/context/AuthContext";
import { Star, MessageCircle, User as UserIcon } from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

interface Review {
  id: string;
  productId: string;
  userId: string;
  userName: string;
  rating: number;
  comment: string;
  createdAt: string;
}

export default function ProductReviews({ productId }: { productId: string }) {
  const { user, userProfile } = useAuth();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Form State
  const [isWriting, setIsWriting] = useState(false);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const q = query(
          collection(db, "reviews"),
          where("productId", "==", productId)
        );
        const querySnapshot = await getDocs(q);
        const fetchedReviews = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Review));
        
        // Manual sort since we don't want to enforce composite indexes right now
        fetchedReviews.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        setReviews(fetchedReviews);
      } catch (error) {
        console.error("Error fetching reviews:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, [productId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !userProfile) return;
    setSubmitting(true);

    const newReview = {
      productId,
      userId: user.uid,
      userName: userProfile.displayName || "Anonymous User",
      rating,
      comment,
      createdAt: new Date().toISOString()
    };

    try {
      const docRef = await addDoc(collection(db, "reviews"), newReview);
      setReviews([{ id: docRef.id, ...newReview }, ...reviews]);
      setIsWriting(false);
      setComment("");
      setRating(5);
    } catch (error) {
      console.error("Error adding review:", error);
      alert("Failed to submit review.");
    } finally {
      setSubmitting(false);
    }
  };

  const averageRating = reviews.length > 0 
    ? (reviews.reduce((acc, curr) => acc + curr.rating, 0) / reviews.length).toFixed(1)
    : "0.0";

  return (
    <div className="w-full mt-24 border-t border-black/10 pt-16">
      <div className="flex flex-col md:flex-row gap-12 md:items-start justify-between">
        
        {/* Left: Summary */}
        <div className="w-full md:w-1/3">
          <h2 className="font-serif text-3xl font-bold mb-4">Customer Reviews</h2>
          <div className="flex items-center gap-4 mb-4">
            <span className="text-5xl font-sans font-bold text-primary">{averageRating}</span>
            <div className="flex flex-col">
              <div className="flex text-accent">
                {[1,2,3,4,5].map(star => (
                  <Star key={star} size={16} className={star <= Number(averageRating) ? "fill-accent" : "text-black/10"} />
                ))}
              </div>
              <span className="text-sm text-foreground/50 mt-1">Based on {reviews.length} reviews</span>
            </div>
          </div>

          {!user ? (
            <div className="mt-8 p-6 bg-secondary/30 border border-black/5 rounded-sm">
              <h3 className="font-serif font-bold mb-2">Share your thoughts</h3>
              <p className="text-sm text-foreground/60 mb-4">You must be logged in to leave a review.</p>
              <Link href="/login" className="inline-block px-6 py-3 border border-primary text-primary font-bold uppercase tracking-widest text-xs hover:bg-primary hover:text-white transition-colors">
                Log In to Review
              </Link>
            </div>
          ) : (
            !isWriting && (
              <button 
                onClick={() => setIsWriting(true)}
                className="mt-8 w-full py-4 bg-primary text-white font-bold uppercase tracking-widest text-sm hover:bg-primary/90 transition-colors"
              >
                Write a Review
              </button>
            )
          )}
        </div>

        {/* Right: Reviews List & Form */}
        <div className="w-full md:w-2/3 flex flex-col gap-8">
          
          <AnimatePresence>
            {isWriting && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden"
              >
                <form onSubmit={handleSubmit} className="bg-secondary/20 p-8 border border-black/5 rounded-sm relative">
                  <button type="button" onClick={() => setIsWriting(false)} className="absolute top-4 right-4 text-foreground/40 hover:text-primary">✕</button>
                  <h3 className="font-serif text-2xl font-bold mb-6">Write a Review</h3>
                  
                  <div className="mb-6">
                    <label className="block text-xs font-bold uppercase tracking-widest mb-2 text-foreground/70">Rating</label>
                    <div className="flex gap-2">
                      {[1,2,3,4,5].map(star => (
                        <button 
                          key={star} 
                          type="button" 
                          onClick={() => setRating(star)}
                          className="hover:scale-110 transition-transform"
                        >
                          <Star size={24} className={star <= rating ? "fill-accent text-accent" : "text-black/10"} />
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="mb-6">
                    <label className="block text-xs font-bold uppercase tracking-widest mb-2 text-foreground/70">Your Review</label>
                    <textarea 
                      required
                      rows={4}
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      placeholder="What did you love about this fabric? How was the quality and drape?"
                      className="w-full border border-black/10 px-4 py-3 bg-white outline-none focus:border-primary resize-none"
                    />
                  </div>

                  <button 
                    type="submit" 
                    disabled={submitting}
                    className="px-8 py-4 bg-primary text-white font-bold uppercase tracking-widest text-sm hover:bg-primary/90 transition-colors disabled:opacity-50"
                  >
                    {submitting ? "Submitting..." : "Submit Review"}
                  </button>
                </form>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="space-y-6">
            {loading ? (
              <div className="py-12 text-center text-foreground/50">Loading reviews...</div>
            ) : reviews.length === 0 ? (
              <div className="py-12 text-center border border-black/5 bg-secondary/10 rounded-sm">
                <MessageCircle className="mx-auto mb-4 text-black/10" size={32} />
                <p className="font-serif text-lg text-foreground/60">No reviews yet.</p>
                <p className="text-sm text-foreground/40 mt-1">Be the first to review this product!</p>
              </div>
            ) : (
              reviews.map(review => (
                <div key={review.id} className="p-6 border border-black/5 rounded-sm bg-white">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-secondary rounded-full flex items-center justify-center text-primary/40">
                        <UserIcon size={20} />
                      </div>
                      <div>
                        <p className="font-bold text-sm">{review.userName}</p>
                        <p className="text-xs text-foreground/50">{new Date(review.createdAt).toLocaleDateString()}</p>
                      </div>
                    </div>
                    <div className="flex text-accent">
                      {[1,2,3,4,5].map(star => (
                        <Star key={star} size={14} className={star <= review.rating ? "fill-accent" : "text-black/10"} />
                      ))}
                    </div>
                  </div>
                  <p className="text-sm font-light text-foreground/80 leading-relaxed">
                    {review.comment}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
