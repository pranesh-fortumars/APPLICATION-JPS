"use client";

import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase/config";
import { useAuth } from "@/context/AuthContext";
import { Loader2, IndianRupee, TrendingUp, AlertCircle } from "lucide-react";

interface Settlement {
  id: string;
  orderId: string;
  date: string;
  grossAmount: number;
  commission: number; // e.g. 10%
  netPayout: number;
  status: "Pending" | "Settled";
}

export default function SellerSettlementsPage() {
  const { user } = useAuth();
  const [settlements, setSettlements] = useState<Settlement[]>([]);
  const [loading, setLoading] = useState(true);

  // Hardcoded commission rate for the platform
  const COMMISSION_RATE = 0.10; // 10%

  useEffect(() => {
    if (!user) return;

    const fetchSettlements = async () => {
      try {
        // In a fully normalized production DB, we would query a `settlements` collection directly.
        // For this remediation, we calculate the ledger dynamically from `orders` and `products`.
        
        // 1. Get seller's products
        const productsSnap = await getDocs(collection(db, "products"));
        const sellerProductIds = productsSnap.docs
          .filter(doc => doc.data().sellerId === user.uid)
          .map(doc => doc.id);

        if (sellerProductIds.length === 0) {
          setSettlements([]);
          setLoading(false);
          return;
        }

        // 2. Get orders containing these products
        const ordersSnap = await getDocs(collection(db, "orders"));
        const newSettlements: Settlement[] = [];

        ordersSnap.docs.forEach(doc => {
          const order = doc.data();
          if (order.status !== "PAID") return; // Only settle PAID orders

          let sellerGross = 0;
          order.items?.forEach((item: any) => {
            if (sellerProductIds.includes(item.product.id)) {
              sellerGross += (item.product.price * item.quantity);
            }
          });

          if (sellerGross > 0) {
            const commission = sellerGross * COMMISSION_RATE;
            const netPayout = sellerGross - commission;

            // Simple heuristic: if older than 7 days, it's settled. Otherwise pending.
            const orderDate = new Date(order.createdAt);
            const daysSinceOrder = (new Date().getTime() - orderDate.getTime()) / (1000 * 3600 * 24);
            
            newSettlements.push({
              id: `set_${doc.id}`,
              orderId: order.orderId,
              date: order.createdAt,
              grossAmount: sellerGross,
              commission: commission,
              netPayout: netPayout,
              status: daysSinceOrder > 7 ? "Settled" : "Pending"
            });
          }
        });

        // Sort by newest
        newSettlements.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        setSettlements(newSettlements);

      } catch (error) {
        console.error("Error calculating settlements", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSettlements();
  }, [user]);

  if (loading) {
    return <div className="flex justify-center p-12"><Loader2 className="animate-spin text-primary w-8 h-8" /></div>;
  }

  const totalPending = settlements.filter(s => s.status === "Pending").reduce((sum, s) => sum + s.netPayout, 0);
  const totalSettled = settlements.filter(s => s.status === "Settled").reduce((sum, s) => sum + s.netPayout, 0);

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="font-serif text-3xl font-bold text-dark">Financial Ledger & Settlements</h1>
        <p className="text-foreground/60 text-sm mt-1">Track your earnings, platform fees, and bank payouts.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-white p-6 rounded-sm border border-black/10 shadow-sm flex items-center gap-4 border-l-4 border-l-orange-500">
          <div className="w-12 h-12 bg-orange-50 text-orange-600 rounded-full flex items-center justify-center shrink-0">
            <AlertCircle size={24} />
          </div>
          <div>
            <p className="text-xs font-bold text-foreground/50 uppercase tracking-widest">Pending Payout</p>
            <h3 className="text-2xl font-bold font-sans">₹{totalPending.toLocaleString(undefined, { minimumFractionDigits: 2 })}</h3>
            <p className="text-xs text-foreground/40 mt-1">Clears 7 days after delivery</p>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-sm border border-black/10 shadow-sm flex items-center gap-4 border-l-4 border-l-green-500">
          <div className="w-12 h-12 bg-green-50 text-green-600 rounded-full flex items-center justify-center shrink-0">
            <IndianRupee size={24} />
          </div>
          <div>
            <p className="text-xs font-bold text-foreground/50 uppercase tracking-widest">Total Settled (Lifetime)</p>
            <h3 className="text-2xl font-bold font-sans">₹{totalSettled.toLocaleString(undefined, { minimumFractionDigits: 2 })}</h3>
            <p className="text-xs text-foreground/40 mt-1">Transferred to registered bank account</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-sm border border-black/10 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-black/10 bg-secondary/30 flex justify-between items-center">
          <h2 className="font-serif font-bold flex items-center gap-2"><TrendingUp size={18} /> Recent Transactions</h2>
        </div>
        
        <div className="overflow-x-auto min-h-[400px]">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-secondary/50 text-xs uppercase tracking-widest text-foreground/60 border-b border-black/10">
                <th className="p-4 font-bold">Order ID</th>
                <th className="p-4 font-bold">Date</th>
                <th className="p-4 font-bold text-right">Gross Sales</th>
                <th className="p-4 font-bold text-right text-red-500">Platform Fee (10%)</th>
                <th className="p-4 font-bold text-right text-green-700">Net Payout</th>
                <th className="p-4 font-bold text-center">Status</th>
              </tr>
            </thead>
            <tbody>
              {settlements.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-foreground/50">No paid orders found yet.</td>
                </tr>
              ) : (
                settlements.map(settlement => (
                  <tr key={settlement.id} className="border-b border-black/5 hover:bg-secondary/20 transition-colors text-sm">
                    <td className="p-4 font-medium text-primary">{settlement.orderId}</td>
                    <td className="p-4 text-foreground/70">{new Date(settlement.date).toLocaleDateString()}</td>
                    <td className="p-4 text-right">₹{settlement.grossAmount.toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                    <td className="p-4 text-right text-red-500">-₹{settlement.commission.toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                    <td className="p-4 text-right font-bold text-green-700">₹{settlement.netPayout.toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                    <td className="p-4 text-center">
                      <span className={`px-2 py-1 text-xs font-bold uppercase tracking-widest rounded-sm ${
                        settlement.status === "Settled" ? "bg-green-100 text-green-700" : "bg-orange-100 text-orange-700"
                      }`}>
                        {settlement.status}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
