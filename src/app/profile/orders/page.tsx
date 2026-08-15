"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { collection, query, where, getDocs, orderBy } from "firebase/firestore";
import { db } from "@/lib/firebase/config";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Loader2, Package, Clock, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { mockProducts } from "@/lib/mockData";

export default function OrdersPage() {
  const { user, loading: authLoading } = useAuth();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    if (authLoading) return;
    
    if (!user) {
      router.push("/login");
      return;
    }

    const fetchOrders = async () => {
      try {
        const q = query(
          collection(db, "orders"),
          where("userId", "==", user.uid),
          // orderBy("createdAt", "desc") // Requires an index in Firestore, skipping for simplicity in mock
        );
        const querySnapshot = await getDocs(q);
        const fetchedOrders = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as any));
        if (fetchedOrders.length === 0) {
          setOrders([{
            id: "mock-order-user-1",
            orderId: "JPS-10293",
            createdAt: new Date().toISOString(),
            totalPrice: 12500,
            status: "Processing",
            shipping: { city: "Mumbai", state: "Maharashtra", pincode: "400001" },
            items: [
              { product: mockProducts[0], quantity: 2, selectedColor: "Red" },
              { product: mockProducts[1], quantity: 1, selectedColor: "Blue" }
            ]
          }]);
        } else {
          // Sort manually to avoid needing a composite index
          fetchedOrders.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
          setOrders(fetchedOrders);
        }
      } catch (error) {
        console.error("Error fetching orders:", error);
        setOrders([{
            id: "mock-order-user-1",
            orderId: "JPS-10293",
            createdAt: new Date().toISOString(),
            totalPrice: 12500,
            status: "Processing",
            shipping: { city: "Mumbai", state: "Maharashtra", pincode: "400001" },
            items: [
              { product: mockProducts[0], quantity: 2, selectedColor: "Red" },
              { product: mockProducts[1], quantity: 1, selectedColor: "Blue" }
            ]
        }]);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [user, authLoading, router]);

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Navbar />
        <div className="flex-1 flex flex-col items-center justify-center text-foreground/50">
          <Loader2 className="w-10 h-10 animate-spin mb-4 text-primary" />
          <p className="font-serif">Loading your orders...</p>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      
      <main className="flex-1 max-w-[1000px] w-full mx-auto px-6 py-32">
        <div className="flex items-center gap-4 mb-12 border-b border-black/10 pb-6">
          <Package className="text-primary w-8 h-8" />
          <h1 className="font-serif text-3xl font-bold text-primary">My Orders</h1>
        </div>

        {orders.length === 0 ? (
          <div className="text-center py-20 bg-secondary/30 rounded-sm border border-black/5">
            <h2 className="font-serif text-2xl mb-4 text-foreground/60">No orders found</h2>
            <p className="text-sm font-sans mb-8">You haven't placed any orders with us yet.</p>
            <Link href="/collections" className="px-8 py-4 bg-primary text-white font-bold uppercase tracking-widest text-sm hover:bg-primary/90 transition-colors">
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="space-y-12">
            {orders.map(order => (
              <div key={order.id} className="border border-black/10 rounded-sm overflow-hidden shadow-sm">
                
                {/* Order Header */}
                <div className="bg-secondary/50 p-6 border-b border-black/10 flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex flex-col gap-1">
                    <span className="text-xs uppercase tracking-widest font-bold text-foreground/60">Order Number</span>
                    <span className="font-serif text-lg text-primary">{order.orderId}</span>
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="text-xs uppercase tracking-widest font-bold text-foreground/60">Date Placed</span>
                    <span className="font-sans text-sm">{new Date(order.createdAt).toLocaleDateString("en-IN", { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="text-xs uppercase tracking-widest font-bold text-foreground/60">Total Amount</span>
                    <span className="font-sans text-sm font-bold">₹{order.totalPrice}</span>
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="text-xs uppercase tracking-widest font-bold text-foreground/60">Status</span>
                    <span className="inline-flex items-center gap-1 text-sm text-green-700 bg-green-100 px-3 py-1 rounded-full font-medium">
                      <Clock size={14} /> {order.status}
                    </span>
                  </div>
                </div>

                {/* Order Items */}
                <div className="p-6">
                  <div className="space-y-6">
                    {order.items.map((item: any, idx: number) => (
                      <div key={idx} className="flex gap-6 items-center">
                        <div className="relative w-20 h-24 bg-secondary shrink-0 border border-black/5">
                          <Image src={item.product.images[0]} alt={item.product.name} fill className="object-cover" />
                        </div>
                        <div className="flex-1">
                          <Link href={`/collections/${item.product.id}`} className="font-serif font-bold text-lg hover:text-primary transition-colors">
                            {item.product.name}
                          </Link>
                          <p className="text-sm text-foreground/60 mt-1">Color: {item.selectedColor || 'Default'} • {item.quantity} meters</p>
                        </div>
                        <div className="text-right">
                          <p className="font-sans font-medium">₹{item.product.price * item.quantity}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-8 pt-6 border-t border-black/10 flex items-center justify-between">
                    <div className="text-sm text-foreground/60 flex items-center gap-2">
                      <ShieldCheck size={16} className="text-primary" />
                      Shipped to: {order.shipping.city}, {order.shipping.state} - {order.shipping.pincode}
                    </div>
                    <div className="flex items-center gap-4">
                      <button 
                        onClick={() => alert(`Return/Exchange requested for order ${order.orderId}. Our team will contact you shortly.`)}
                        className="text-sm border border-black/10 px-4 py-2 hover:bg-black/5 transition-colors font-bold uppercase tracking-widest text-primary/70"
                      >
                        Return / Exchange
                      </button>
                      <Link href={`/contact?order=${order.orderId}`} className="text-sm text-primary font-bold hover:underline">
                        Need Help?
                      </Link>
                    </div>
                  </div>
                </div>

              </div>
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
