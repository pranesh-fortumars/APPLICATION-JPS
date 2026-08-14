"use client";

import { useEffect, useState } from "react";
import { collection, getDocs, doc, setDoc, deleteDoc } from "firebase/firestore";
import { db } from "@/lib/firebase/config";
import { Search, Loader2, Plus, Edit, Trash2, Tag, Check, X } from "lucide-react";

interface Coupon {
  id: string; // The code itself e.g., WELCOME10
  value: number; // e.g., 0.10 for 10%
  maximumDiscount?: number;
  active: boolean;
  expiryDate: string;
}

export default function AdminCouponsPage() {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState<Coupon>({
    id: "",
    value: 0.10,
    maximumDiscount: 500,
    active: true,
    expiryDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] // +30 days
  });

  useEffect(() => {
    fetchCoupons();
  }, []);

  const fetchCoupons = async () => {
    try {
      const snap = await getDocs(collection(db, "coupons"));
      const fetched = snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Coupon));
      setCoupons(fetched);
    } catch (error) {
      console.error("Failed to fetch coupons", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const code = formData.id.toUpperCase().trim();
      await setDoc(doc(db, "coupons", code), {
        value: Number(formData.value),
        maximumDiscount: formData.maximumDiscount ? Number(formData.maximumDiscount) : null,
        active: formData.active,
        expiryDate: formData.expiryDate
      });
      setIsModalOpen(false);
      fetchCoupons();
    } catch (error) {
      console.error("Failed to save coupon", error);
      alert("Error saving coupon");
    }
  };

  const toggleStatus = async (coupon: Coupon) => {
    try {
      await setDoc(doc(db, "coupons", coupon.id), { active: !coupon.active }, { merge: true });
      fetchCoupons();
    } catch (error) {
      console.error("Failed to toggle", error);
    }
  };

  const deleteCoupon = async (id: string) => {
    if (!confirm(`Are you sure you want to delete coupon ${id}?`)) return;
    try {
      await deleteDoc(doc(db, "coupons", id));
      fetchCoupons();
    } catch (error) {
      console.error("Failed to delete", error);
    }
  };

  if (loading) return <div className="flex justify-center p-12"><Loader2 className="animate-spin text-primary w-8 h-8" /></div>;

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8 flex justify-between items-end">
        <div>
          <h1 className="font-serif text-3xl font-bold text-dark">Coupon Manager</h1>
          <p className="text-foreground/60 text-sm mt-1">Create and manage discount codes for marketing campaigns.</p>
        </div>
        <button 
          onClick={() => {
            setFormData({ id: "", value: 0.10, maximumDiscount: 500, active: true, expiryDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] });
            setIsModalOpen(true);
          }}
          className="flex items-center gap-2 bg-primary text-white px-4 py-2 text-sm font-bold uppercase tracking-widest hover:bg-primary/90 transition-colors"
        >
          <Plus size={16} /> Create Coupon
        </button>
      </div>

      <div className="bg-white rounded-sm border border-black/10 shadow-sm overflow-hidden">
        <div className="overflow-x-auto min-h-[500px]">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-secondary/50 text-xs uppercase tracking-widest text-foreground/60 border-b border-black/10">
                <th className="p-4 font-bold">Code</th>
                <th className="p-4 font-bold text-right">Discount Value</th>
                <th className="p-4 font-bold text-right">Max Discount</th>
                <th className="p-4 font-bold">Expiry Date</th>
                <th className="p-4 font-bold text-center">Status</th>
                <th className="p-4 font-bold text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {coupons.length === 0 ? (
                <tr><td colSpan={6} className="p-8 text-center text-foreground/50">No coupons active. Create one to run a promotion.</td></tr>
              ) : (
                coupons.map(coupon => (
                  <tr key={coupon.id} className="border-b border-black/5 hover:bg-secondary/20 transition-colors text-sm">
                    <td className="p-4 font-bold tracking-wider text-primary">
                      <div className="flex items-center gap-2">
                        <Tag size={16} className="text-foreground/40" />
                        {coupon.id}
                      </div>
                    </td>
                    <td className="p-4 text-right font-medium">{coupon.value * 100}%</td>
                    <td className="p-4 text-right text-foreground/60">
                      {coupon.maximumDiscount ? `₹${coupon.maximumDiscount}` : 'No Limit'}
                    </td>
                    <td className="p-4">
                      {new Date(coupon.expiryDate) < new Date() ? (
                        <span className="text-red-500 font-bold">{coupon.expiryDate} (Expired)</span>
                      ) : (
                        <span>{coupon.expiryDate}</span>
                      )}
                    </td>
                    <td className="p-4 text-center">
                      <button 
                        onClick={() => toggleStatus(coupon)}
                        className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest transition-colors ${
                          coupon.active ? 'bg-green-100 text-green-700 hover:bg-green-200' : 'bg-red-100 text-red-700 hover:bg-red-200'
                        }`}
                      >
                        {coupon.active ? 'Active' : 'Disabled'}
                      </button>
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button 
                          onClick={() => {
                            setFormData(coupon);
                            setIsModalOpen(true);
                          }}
                          className="p-2 hover:bg-black/5 rounded-sm text-foreground/60 hover:text-primary transition-colors"
                        >
                          <Edit size={16} />
                        </button>
                        <button 
                          onClick={() => deleteCoupon(coupon.id)}
                          className="p-2 hover:bg-red-50 rounded-sm text-foreground/60 hover:text-red-500 transition-colors"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white w-full max-w-md p-6 rounded-sm shadow-xl border border-black/10">
            <div className="flex justify-between items-center mb-6">
              <h2 className="font-serif text-2xl font-bold">Coupon Settings</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-foreground/50 hover:text-dark">
                <X size={24} />
              </button>
            </div>
            
            <form onSubmit={handleSaveCoupon} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest mb-1 text-foreground/70">Coupon Code</label>
                <input 
                  required type="text" 
                  value={formData.id} 
                  onChange={e => setFormData({...formData, id: e.target.value.toUpperCase()})}
                  placeholder="e.g., FESTIVE20"
                  className="w-full border border-black/10 px-4 py-2 text-sm outline-none focus:border-primary uppercase"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest mb-1 text-foreground/70">Discount (%)</label>
                  <input 
                    required type="number" step="0.01" max="1" min="0.01"
                    value={formData.value} 
                    onChange={e => setFormData({...formData, value: parseFloat(e.target.value)})}
                    placeholder="0.10"
                    className="w-full border border-black/10 px-4 py-2 text-sm outline-none focus:border-primary"
                  />
                  <p className="text-[10px] text-foreground/50 mt-1">Format: 0.10 = 10%</p>
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest mb-1 text-foreground/70">Max Cap (₹)</label>
                  <input 
                    type="number" 
                    value={formData.maximumDiscount || ''} 
                    onChange={e => setFormData({...formData, maximumDiscount: parseFloat(e.target.value)})}
                    placeholder="500"
                    className="w-full border border-black/10 px-4 py-2 text-sm outline-none focus:border-primary"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest mb-1 text-foreground/70">Expiry Date</label>
                <input 
                  required type="date" 
                  value={formData.expiryDate} 
                  onChange={e => setFormData({...formData, expiryDate: e.target.value})}
                  className="w-full border border-black/10 px-4 py-2 text-sm outline-none focus:border-primary"
                />
              </div>

              <label className="flex items-center gap-2 cursor-pointer mt-2">
                <input 
                  type="checkbox" 
                  checked={formData.active}
                  onChange={e => setFormData({...formData, active: e.target.checked})}
                  className="w-4 h-4 text-primary rounded-sm border-black/20 focus:ring-primary"
                />
                <span className="text-sm font-bold text-foreground/70">Active on Storefront</span>
              </label>

              <button 
                type="submit" 
                className="w-full mt-6 bg-primary text-white py-3 text-sm font-bold uppercase tracking-widest hover:bg-primary/90 transition-colors"
              >
                Save Coupon
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
