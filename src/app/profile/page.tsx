"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase/config";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Award, Package, Heart, LogOut, ChevronRight, Loader2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

const TIERS = [
  { name: "Bronze", threshold: 0, perks: ["Standard Shipping", "Basic Support"] },
  { name: "Silver", threshold: 5000, perks: ["Free Shipping", "Early Access to Sales"] },
  { name: "Gold", threshold: 15000, perks: ["Free Expedited Shipping", "Priority Support", "5% Cashback"] },
  { name: "Platinum", threshold: 30000, perks: ["Free Next-Day Shipping", "Dedicated Stylist", "10% Cashback"] },
];

export default function ProfilePage() {
  const { user, userProfile, loading, logout } = useAuth();
  const router = useRouter();
  const [totalSpend, setTotalSpend] = useState(0);
  const [fetchingStats, setFetchingStats] = useState(true);

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

  useEffect(() => {
    const fetchSpend = async () => {
      if (!user) return;
      try {
        const q = query(collection(db, "orders"), where("userId", "==", user.uid));
        const snap = await getDocs(q);
        let spend = 0;
        snap.docs.forEach(doc => {
          const data = doc.data();
          if (data.status !== "Cancelled") {
            spend += data.totalPrice || 0;
          }
        });
        setTotalSpend(spend);
      } catch (error) {
        console.error("Failed to fetch order history", error);
      } finally {
        setFetchingStats(false);
      }
    };
    fetchSpend();
  }, [user]);

  if (loading || !user) {
    return <div className="min-h-screen flex justify-center items-center"><Loader2 className="animate-spin text-primary w-8 h-8" /></div>;
  }

  // Calculate Tier
  let currentTierIndex = 0;
  for (let i = TIERS.length - 1; i >= 0; i--) {
    if (totalSpend >= TIERS[i].threshold) {
      currentTierIndex = i;
      break;
    }
  }

  const currentTier = TIERS[currentTierIndex];
  const nextTier = currentTierIndex < TIERS.length - 1 ? TIERS[currentTierIndex + 1] : null;
  const progressToNext = nextTier 
    ? ((totalSpend - currentTier.threshold) / (nextTier.threshold - currentTier.threshold)) * 100
    : 100;
  const amountToNext = nextTier ? nextTier.threshold - totalSpend : 0;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      
      <main className="flex-1 max-w-6xl w-full mx-auto px-6 py-32">
        <div className="flex flex-col md:flex-row gap-12">
          
          {/* Sidebar */}
          <aside className="w-full md:w-1/4 shrink-0">
            <div className="bg-secondary/30 border border-black/5 rounded-sm p-6 mb-6">
              <div className="w-16 h-16 bg-primary text-white rounded-full flex items-center justify-center text-xl font-bold mb-4">
                {userProfile?.displayName?.charAt(0) || user.email?.charAt(0) || "U"}
              </div>
              <h2 className="font-serif font-bold text-xl line-clamp-1">{userProfile?.displayName || "User"}</h2>
              <p className="text-xs text-foreground/50 truncate">{user.email}</p>
            </div>

            <nav className="flex flex-col gap-2">
              <Link href="/profile" className="flex items-center justify-between p-4 bg-primary text-white font-bold text-sm tracking-widest uppercase rounded-sm transition-colors">
                <span className="flex items-center gap-3"><Award size={18} /> JPS Club</span>
                <ChevronRight size={18} />
              </Link>
              <Link href="/profile/orders" className="flex items-center justify-between p-4 text-foreground/70 hover:bg-secondary/30 font-bold text-sm tracking-widest uppercase rounded-sm transition-colors">
                <span className="flex items-center gap-3"><Package size={18} /> Orders</span>
                <ChevronRight size={18} />
              </Link>
              <Link href="/profile/wishlist" className="flex items-center justify-between p-4 text-foreground/70 hover:bg-secondary/30 font-bold text-sm tracking-widest uppercase rounded-sm transition-colors">
                <span className="flex items-center gap-3"><Heart size={18} /> Wishlist</span>
                <ChevronRight size={18} />
              </Link>
              <button onClick={logout} className="flex items-center gap-3 p-4 text-red-500 hover:bg-red-50 font-bold text-sm tracking-widest uppercase rounded-sm transition-colors w-full text-left mt-4 border border-red-100">
                <LogOut size={18} /> Sign Out
              </button>
            </nav>
          </aside>

          {/* Main Content - Brand Club */}
          <div className="flex-1">
            <h1 className="font-serif text-4xl font-bold text-primary mb-2">JPS Brand Club</h1>
            <p className="text-foreground/60 mb-8">Your exclusive access to premium rewards and perks.</p>

            {fetchingStats ? (
              <div className="h-64 flex items-center justify-center bg-secondary/10 rounded-sm border border-black/5 animate-pulse">
                <p className="text-foreground/40 font-serif">Calculating your rewards...</p>
              </div>
            ) : (
              <div className="space-y-8">
                
                {/* Tier Card */}
                <div className={`p-8 rounded-lg shadow-xl relative overflow-hidden ${
                  currentTier.name === "Bronze" ? "bg-gradient-to-br from-amber-700/80 to-amber-900 text-white" :
                  currentTier.name === "Silver" ? "bg-gradient-to-br from-slate-300 to-slate-500 text-dark" :
                  currentTier.name === "Gold" ? "bg-gradient-to-br from-yellow-400 to-yellow-600 text-dark" :
                  "bg-gradient-to-br from-gray-800 to-black text-white"
                }`}>
                  <Award size={120} className="absolute -bottom-6 -right-6 opacity-10" />
                  
                  <div className="relative z-10">
                    <p className="text-xs uppercase tracking-widest font-bold opacity-80 mb-1">Current Tier</p>
                    <h2 className="font-serif text-5xl font-bold mb-8">{currentTier.name}</h2>
                    
                    {nextTier ? (
                      <div>
                        <div className="flex justify-between text-sm font-medium mb-2 opacity-90">
                          <span>Total Spend: ₹{totalSpend.toLocaleString()}</span>
                          <span>{nextTier.name} at ₹{nextTier.threshold.toLocaleString()}</span>
                        </div>
                        <div className="w-full h-2 bg-black/20 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-white transition-all duration-1000 ease-out" 
                            style={{ width: `${progressToNext}%` }}
                          />
                        </div>
                        <p className="text-xs font-medium mt-3 opacity-90">Spend ₹{amountToNext.toLocaleString()} more to unlock {nextTier.name} tier perks!</p>
                      </div>
                    ) : (
                      <div>
                        <p className="text-sm font-medium opacity-90 mb-2">Total Spend: ₹{totalSpend.toLocaleString()}</p>
                        <p className="text-sm font-bold">You have reached the highest tier!</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Active Perks */}
                <div>
                  <h3 className="font-serif text-2xl font-bold mb-6">Your Active Perks</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-12">
                    {currentTier.perks.map((perk, idx) => (
                      <div key={idx} className="p-4 bg-white border border-black/10 rounded-sm shadow-sm flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-green-100 text-green-600 flex items-center justify-center shrink-0">
                          <svg width="14" height="10" viewBox="0 0 14 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M1 5L4.5 8.5L13 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        </div>
                        <p className="font-medium text-sm">{perk}</p>
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* Personal Information */}
                <div className="border-t border-black/10 pt-12">
                  <h3 className="font-serif text-2xl font-bold mb-6">Personal Information</h3>
                  <form className="space-y-6 max-w-2xl" onSubmit={(e) => { e.preventDefault(); alert('Profile updated successfully!'); }}>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-xs font-bold uppercase tracking-widest text-primary/70 mb-2">Full Name</label>
                        <input type="text" defaultValue={userProfile?.displayName || ""} className="w-full p-4 border border-black/10 bg-transparent focus:border-primary outline-none" />
                      </div>
                      <div>
                        <label className="block text-xs font-bold uppercase tracking-widest text-primary/70 mb-2">Email Address</label>
                        <input type="email" defaultValue={user.email || ""} disabled className="w-full p-4 border border-black/5 bg-black/5 text-primary/60 outline-none cursor-not-allowed" />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-widest text-primary/70 mb-2">Phone Number</label>
                      <input type="tel" placeholder="+91" className="w-full p-4 border border-black/10 bg-transparent focus:border-primary outline-none" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-widest text-primary/70 mb-2">Default Shipping Address</label>
                      <textarea placeholder="House No, Street, Area" rows={3} className="w-full p-4 border border-black/10 bg-transparent focus:border-primary outline-none resize-none"></textarea>
                    </div>
                    <div className="grid grid-cols-2 gap-6">
                      <div>
                        <label className="block text-xs font-bold uppercase tracking-widest text-primary/70 mb-2">City</label>
                        <input type="text" className="w-full p-4 border border-black/10 bg-transparent focus:border-primary outline-none" />
                      </div>
                      <div>
                        <label className="block text-xs font-bold uppercase tracking-widest text-primary/70 mb-2">Pincode</label>
                        <input type="text" className="w-full p-4 border border-black/10 bg-transparent focus:border-primary outline-none" />
                      </div>
                    </div>
                    <button type="submit" className="px-8 py-4 bg-primary text-white font-bold uppercase tracking-widest text-sm hover:bg-primary/90 transition-colors shadow-ambient">
                      Save Changes
                    </button>
                  </form>
                </div>

              </div>
            )}
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}
