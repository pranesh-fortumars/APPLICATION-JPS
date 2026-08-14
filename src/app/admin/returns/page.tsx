"use client";

import { useEffect, useState } from "react";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "@/lib/firebase/config";
import { Loader2, RefreshCcw, Search, CheckCircle, XCircle } from "lucide-react";

export default function AdminReturnsPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState<string | null>(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      // Fetch PAID, DELIVERED, and REFUNDED orders for the RMA view
      // In production, you might want pagination here
      const snap = await getDocs(collection(db, "orders"));
      const fetched = snap.docs
        .map(doc => ({ id: doc.id, ...doc.data() }))
        .filter((o: any) => ["PAID", "DELIVERED", "REFUND_REQUESTED", "REFUNDED"].includes(o.status))
        .sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        
      setOrders(fetched);
    } catch (error) {
      console.error("Failed to fetch orders", error);
    } finally {
      setLoading(false);
    }
  };

  const handleRefund = async (orderId: string) => {
    if (!confirm("Are you sure you want to refund this order? Inventory will be restored automatically.")) return;
    
    setProcessingId(orderId);
    try {
      const response = await fetch('/api/orders/refund', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId, reason: 'Admin Approved RMA' })
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Failed to process refund");
      }

      alert("Refund processed successfully!");
      fetchOrders();
    } catch (error: any) {
      console.error("Refund error:", error);
      alert(error.message);
    } finally {
      setProcessingId(null);
    }
  };

  if (loading) return <div className="flex justify-center p-12"><Loader2 className="animate-spin text-primary w-8 h-8" /></div>;

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8 flex justify-between items-end">
        <div>
          <h1 className="font-serif text-3xl font-bold text-dark">Returns & Refunds</h1>
          <p className="text-foreground/60 text-sm mt-1">Manage Return Merchandise Authorizations (RMA) and issue refunds.</p>
        </div>
        <div className="relative">
          <input 
            type="text" 
            placeholder="Search Order ID..." 
            className="pl-10 pr-4 py-2 border border-black/10 text-sm focus:border-primary outline-none h-full"
          />
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-foreground/40" />
        </div>
      </div>

      <div className="bg-white rounded-sm border border-black/10 shadow-sm overflow-hidden">
        <div className="overflow-x-auto min-h-[500px]">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-secondary/50 text-xs uppercase tracking-widest text-foreground/60 border-b border-black/10">
                <th className="p-4 font-bold">Order ID</th>
                <th className="p-4 font-bold">Date</th>
                <th className="p-4 font-bold">Customer</th>
                <th className="p-4 font-bold text-right">Amount</th>
                <th className="p-4 font-bold text-center">Status</th>
                <th className="p-4 font-bold text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {orders.length === 0 ? (
                <tr><td colSpan={6} className="p-8 text-center text-foreground/50">No eligible orders found.</td></tr>
              ) : (
                orders.map(order => (
                  <tr key={order.id} className="border-b border-black/5 hover:bg-secondary/20 transition-colors text-sm">
                    <td className="p-4 font-bold text-primary">{order.orderId}</td>
                    <td className="p-4 text-foreground/70">{new Date(order.createdAt).toLocaleDateString()}</td>
                    <td className="p-4">
                      <p className="font-medium">{order.contact?.firstName} {order.contact?.lastName}</p>
                      <p className="text-xs text-foreground/50">{order.contact?.email}</p>
                    </td>
                    <td className="p-4 text-right font-medium">₹{order.totalPrice?.toLocaleString()}</td>
                    <td className="p-4 text-center">
                      <span className={`px-2 py-1 text-xs font-bold uppercase tracking-widest rounded-sm ${
                        order.status === "REFUNDED" ? "bg-purple-100 text-purple-700" :
                        order.status === "REFUND_REQUESTED" ? "bg-orange-100 text-orange-700" :
                        "bg-green-100 text-green-700"
                      }`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      {order.status === "REFUNDED" ? (
                        <div className="flex items-center justify-end gap-1 text-purple-600 font-bold text-xs uppercase tracking-widest">
                          <CheckCircle size={14} /> Refunded
                        </div>
                      ) : (
                        <button 
                          onClick={() => handleRefund(order.id)}
                          disabled={processingId === order.id}
                          className="flex items-center gap-2 ml-auto bg-dark text-white px-3 py-2 text-xs font-bold uppercase tracking-widest hover:bg-black transition-colors disabled:opacity-50"
                        >
                          {processingId === order.id ? <Loader2 size={14} className="animate-spin" /> : <RefreshCcw size={14} />}
                          Issue Refund
                        </button>
                      )}
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
