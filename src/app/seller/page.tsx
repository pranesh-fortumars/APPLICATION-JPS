"use client";

import { useEffect, useState } from "react";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "@/lib/firebase/config";
import { useAuth } from "@/context/AuthContext";
import { IndianRupee, Package, ShoppingCart } from "lucide-react";

export default function SellerDashboard() {
  const { user } = useAuth();
  const [kpis, setKpis] = useState({ revenue: 0, products: 0, orders: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const fetchSellerData = async () => {
      try {
        // Fetch Seller's Products
        const prodQ = query(collection(db, "products"), where("sellerId", "==", user.uid));
        const prodSnap = await getDocs(prodQ);
        const sellerProducts = prodSnap.docs.map(doc => doc.id);

        // Fetch Orders that contain seller's products
        // In a real noSQL schema we might duplicate sellerId on the order document for easier querying
        // But for mock complexity, we will fetch all orders and filter locally
        const ordersSnap = await getDocs(collection(db, "orders"));
        let revenue = 0;
        let orderCount = 0;

        ordersSnap.docs.forEach(doc => {
          const order = doc.data();
          let hasMyProduct = false;
          
          order.items?.forEach((item: any) => {
            if (sellerProducts.includes(item.product.id) || item.product.sellerId === user.uid) {
              hasMyProduct = true;
              revenue += (item.product.price * item.quantity);
            }
          });

          if (hasMyProduct) {
            orderCount++;
          }
        });

        setKpis({
          revenue,
          products: sellerProducts.length,
          orders: orderCount
        });

      } catch (error) {
        console.error("Failed to fetch seller dashboard data", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSellerData();
  }, [user]);

  if (loading) return <div className="animate-pulse">Loading vendor data...</div>;

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="font-serif text-3xl font-bold text-dark">Vendor Dashboard</h1>
        <p className="text-foreground/60 text-sm mt-1">Track your product performance and recent sales.</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-sm border border-black/10 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 bg-green-100 text-green-600 rounded-full flex items-center justify-center">
            <IndianRupee size={24} />
          </div>
          <div>
            <p className="text-xs font-bold text-foreground/50 uppercase tracking-widest">My Revenue</p>
            <h3 className="text-2xl font-bold font-sans">₹{kpis.revenue.toLocaleString()}</h3>
          </div>
        </div>
        <div className="bg-white p-6 rounded-sm border border-black/10 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 bg-accent/20 text-accent rounded-full flex items-center justify-center">
            <Package size={24} />
          </div>
          <div>
            <p className="text-xs font-bold text-foreground/50 uppercase tracking-widest">Active Listings</p>
            <h3 className="text-2xl font-bold font-sans">{kpis.products}</h3>
          </div>
        </div>
        <div className="bg-white p-6 rounded-sm border border-black/10 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center">
            <ShoppingCart size={24} />
          </div>
          <div>
            <p className="text-xs font-bold text-foreground/50 uppercase tracking-widest">Orders Received</p>
            <h3 className="text-2xl font-bold font-sans">{kpis.orders}</h3>
          </div>
        </div>
      </div>
      
      <div className="p-12 text-center border border-black/5 rounded-sm bg-secondary/30">
        <p className="font-serif text-xl text-foreground/60 mb-2">Welcome to JPS Seller Central</p>
        <p className="text-sm font-sans text-foreground/50">Upload your first product to start selling to our premium audience.</p>
      </div>
    </div>
  );
}
