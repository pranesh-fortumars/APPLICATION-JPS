"use client";

import { useEffect, useState } from "react";
import { collection, getDocs, doc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase/config";
import { Search, Loader2 } from "lucide-react";

const STATUSES = ["Paid & Processing", "Packed", "Shipped", "Out for Delivery", "Delivered", "Cancelled"];

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<string | null>(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const ordersSnap = await getDocs(collection(db, "orders"));
      const fetchedOrders = ordersSnap.docs.map(doc => ({ id: doc.id, ...doc.data() } as any));
      fetchedOrders.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      setOrders(fetchedOrders);
    } catch (error) {
      console.error("Failed to fetch orders", error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    setUpdating(orderId);
    try {
      await updateDoc(doc(db, "orders", orderId), { status: newStatus });
      setOrders(orders.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
    } catch (error) {
      console.error("Failed to update order status", error);
      alert("Failed to update order status.");
    } finally {
      setUpdating(null);
    }
  };

  if (loading) return <div className="flex justify-center p-12"><Loader2 className="animate-spin text-primary w-8 h-8" /></div>;

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8 flex justify-between items-end">
        <div>
          <h1 className="font-serif text-3xl font-bold text-dark">Order Management</h1>
          <p className="text-foreground/60 text-sm mt-1">Manage all customer orders and update their fulfillment statuses.</p>
        </div>
        <div className="relative">
          <input 
            type="text" 
            placeholder="Search orders..." 
            className="pl-10 pr-4 py-2 border border-black/10 text-sm focus:border-primary outline-none"
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
                <th className="p-4 font-bold">Customer</th>
                <th className="p-4 font-bold">Date</th>
                <th className="p-4 font-bold">Items</th>
                <th className="p-4 font-bold">Amount</th>
                <th className="p-4 font-bold w-48">Status</th>
              </tr>
            </thead>
            <tbody>
              {orders.length === 0 ? (
                <tr><td colSpan={6} className="p-8 text-center text-foreground/50">No orders found.</td></tr>
              ) : (
                orders.map(order => (
                  <tr key={order.id} className="border-b border-black/5 hover:bg-secondary/20 transition-colors text-sm">
                    <td className="p-4 font-medium text-primary">{order.orderId}</td>
                    <td className="p-4">
                      <p className="font-medium">{order.contact?.firstName} {order.contact?.lastName}</p>
                      <p className="text-xs text-foreground/50">{order.contact?.email}</p>
                    </td>
                    <td className="p-4 text-foreground/70">{new Date(order.createdAt).toLocaleDateString()}</td>
                    <td className="p-4 text-foreground/70">{order.totalItems} Items</td>
                    <td className="p-4 font-medium">₹{order.totalPrice}</td>
                    <td className="p-4">
                      <select 
                        value={order.status}
                        onChange={(e) => handleStatusChange(order.id, e.target.value)}
                        disabled={updating === order.id}
                        className={`text-xs uppercase tracking-widest font-bold rounded-sm border outline-none py-2 px-2 w-full ${
                          order.status === "Delivered" ? "bg-green-50 text-green-700 border-green-200" :
                          order.status === "Cancelled" ? "bg-red-50 text-red-700 border-red-200" :
                          "bg-blue-50 text-blue-700 border-blue-200"
                        } ${updating === order.id ? 'opacity-50' : ''}`}
                      >
                        {STATUSES.map(status => (
                          <option key={status} value={status}>{status}</option>
                        ))}
                      </select>
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
