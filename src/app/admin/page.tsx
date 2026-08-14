"use client";

import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase/config";
import { IndianRupee, ShoppingBag, Users } from "lucide-react";
import Link from "next/link";

interface KPI {
  totalRevenue: number;
  totalOrders: number;
  totalUsers: number;
}

export default function AdminDashboard() {
  const [kpis, setKpis] = useState<KPI>({ totalRevenue: 0, totalOrders: 0, totalUsers: 0 });
  const [recentOrders, setRecentOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Fetch Orders KPI
        const ordersSnap = await getDocs(collection(db, "orders"));
        let revenue = 0;
        const orders = ordersSnap.docs.map(doc => {
          const data = doc.data() as any;
          revenue += (data.totalPrice || 0);
          return { id: doc.id, ...data };
        });

        // Fetch Users KPI
        const usersSnap = await getDocs(collection(db, "users"));
        
        setKpis({
          totalRevenue: revenue,
          totalOrders: orders.length,
          totalUsers: usersSnap.docs.length
        });

        // Recent Orders
        orders.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        setRecentOrders(orders.slice(0, 5));

      } catch (error) {
        console.error("Failed to fetch dashboard data", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) return <div className="animate-pulse">Loading dashboard...</div>;

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8 flex justify-between items-end">
        <div>
          <h1 className="font-serif text-3xl font-bold text-dark">Dashboard Overview</h1>
          <p className="text-foreground/60 text-sm mt-1">Welcome back. Here's what's happening today.</p>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-sm border border-black/10 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 bg-green-100 text-green-600 rounded-full flex items-center justify-center">
            <IndianRupee size={24} />
          </div>
          <div>
            <p className="text-xs font-bold text-foreground/50 uppercase tracking-widest">Total Revenue</p>
            <h3 className="text-2xl font-bold font-sans">₹{kpis.totalRevenue.toLocaleString()}</h3>
          </div>
        </div>
        <div className="bg-white p-6 rounded-sm border border-black/10 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center">
            <ShoppingBag size={24} />
          </div>
          <div>
            <p className="text-xs font-bold text-foreground/50 uppercase tracking-widest">Total Orders</p>
            <h3 className="text-2xl font-bold font-sans">{kpis.totalOrders}</h3>
          </div>
        </div>
        <div className="bg-white p-6 rounded-sm border border-black/10 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center">
            <Users size={24} />
          </div>
          <div>
            <p className="text-xs font-bold text-foreground/50 uppercase tracking-widest">Active Users</p>
            <h3 className="text-2xl font-bold font-sans">{kpis.totalUsers}</h3>
          </div>
        </div>
      </div>

      {/* Recent Orders Table */}
      <div className="bg-white rounded-sm border border-black/10 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-black/10 flex justify-between items-center">
          <h2 className="font-serif text-xl font-bold">Recent Orders</h2>
          <Link href="/admin/orders" className="text-sm text-primary hover:underline font-medium">View All</Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-secondary/50 text-xs uppercase tracking-widest text-foreground/60 border-b border-black/10">
                <th className="p-4 font-bold">Order ID</th>
                <th className="p-4 font-bold">Customer</th>
                <th className="p-4 font-bold">Date</th>
                <th className="p-4 font-bold">Amount</th>
                <th className="p-4 font-bold">Status</th>
              </tr>
            </thead>
            <tbody>
              {recentOrders.length === 0 ? (
                <tr><td colSpan={5} className="p-8 text-center text-foreground/50">No orders found.</td></tr>
              ) : (
                recentOrders.map(order => (
                  <tr key={order.id} className="border-b border-black/5 hover:bg-secondary/20 transition-colors text-sm">
                    <td className="p-4 font-medium text-primary">{order.orderId}</td>
                    <td className="p-4">
                      <p className="font-medium">{order.contact?.firstName} {order.contact?.lastName}</p>
                      <p className="text-xs text-foreground/50">{order.contact?.email}</p>
                    </td>
                    <td className="p-4 text-foreground/70">{new Date(order.createdAt).toLocaleDateString()}</td>
                    <td className="p-4 font-medium">₹{order.totalPrice}</td>
                    <td className="p-4">
                      <span className="inline-block px-2 py-1 text-[10px] uppercase tracking-widest font-bold rounded-full bg-blue-100 text-blue-700">
                        {order.status}
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
