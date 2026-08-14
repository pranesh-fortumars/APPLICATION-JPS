"use client";

import { useEffect, useState } from "react";
import { collection, getDocs, query, where, doc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase/config";
import { useAuth } from "@/context/AuthContext";
import { Search, Loader2 } from "lucide-react";

export default function SellerOrdersPage() {
  const { user } = useAuth();
  const [vendorOrders, setVendorOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const fetchOrders = async () => {
      try {
        // First get all the seller's product IDs
        const prodQ = query(collection(db, "products"), where("sellerId", "==", user.uid));
        const prodSnap = await getDocs(prodQ);
        const sellerProducts = prodSnap.docs.map(doc => doc.id);

        // Then get all orders and filter them locally
        const ordersSnap = await getDocs(collection(db, "orders"));
        
        const relevantOrders: any[] = [];

        ordersSnap.docs.forEach(doc => {
          const orderData = doc.data() as any;
          // Filter to only include items that belong to THIS seller
          const myItems = orderData.items?.filter((item: any) => 
            sellerProducts.includes(item.product.id) || item.product.sellerId === user.uid
          ) || [];

          if (myItems.length > 0) {
            // Calculate the subtotal for just this seller's portion of the order
            const myRevenue = myItems.reduce((acc: number, item: any) => acc + (item.product.price * item.quantity), 0);
            
            relevantOrders.push({
              id: doc.id,
              ...orderData,
              myItems,
              myRevenue
            });
          }
        });

        relevantOrders.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        setVendorOrders(relevantOrders);

      } catch (error) {
        console.error("Failed to fetch seller orders", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [user]);

  if (loading) return <div className="flex justify-center p-12"><Loader2 className="animate-spin text-primary w-8 h-8" /></div>;

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8 flex justify-between items-end">
        <div>
          <h1 className="font-serif text-3xl font-bold text-dark">Order Fulfillment</h1>
          <p className="text-foreground/60 text-sm mt-1">View the portions of customer orders that contain your products.</p>
        </div>
      </div>

      <div className="bg-white rounded-sm border border-black/10 shadow-sm overflow-hidden">
        <div className="overflow-x-auto min-h-[500px]">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-secondary/50 text-xs uppercase tracking-widest text-foreground/60 border-b border-black/10">
                <th className="p-4 font-bold">Order ID</th>
                <th className="p-4 font-bold">Date</th>
                <th className="p-4 font-bold">Your Items to Ship</th>
                <th className="p-4 font-bold">Your Payout</th>
                <th className="p-4 font-bold w-48">Overall Order Status</th>
              </tr>
            </thead>
            <tbody>
              {vendorOrders.length === 0 ? (
                <tr><td colSpan={5} className="p-8 text-center text-foreground/50">You have no orders to fulfill yet.</td></tr>
              ) : (
                vendorOrders.map(order => (
                  <tr key={order.id} className="border-b border-black/5 hover:bg-secondary/20 transition-colors text-sm">
                    <td className="p-4">
                      <p className="font-medium text-primary">{order.orderId}</p>
                      <p className="text-xs text-foreground/50 mt-1">Ship to: {order.contact?.firstName} {order.contact?.lastName}</p>
                    </td>
                    <td className="p-4 text-foreground/70">{new Date(order.createdAt).toLocaleDateString()}</td>
                    <td className="p-4">
                      <ul className="list-disc pl-4 text-xs text-foreground/70 space-y-1">
                        {order.myItems.map((item: any, idx: number) => (
                          <li key={idx}>
                            <span className="font-medium text-dark">{item.quantity}x</span> {item.product.name}
                          </li>
                        ))}
                      </ul>
                    </td>
                    <td className="p-4 font-medium text-green-700">₹{order.myRevenue}</td>
                    <td className="p-4">
                      <span className={`inline-block px-2 py-1 text-[10px] uppercase tracking-widest font-bold rounded-full ${
                        order.status === "Delivered" ? "bg-green-100 text-green-700" :
                        order.status === "Cancelled" ? "bg-red-100 text-red-700" :
                        "bg-blue-100 text-blue-700"
                      }`}>
                        {order.status || "Processing"}
                      </span>
                      {order.status !== "Delivered" && order.status !== "Cancelled" && (
                        <p className="text-[10px] mt-2 text-foreground/40 italic">Note: Only admins can mark the master order as shipped.</p>
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
