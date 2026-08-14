"use client";

import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase/config";
import { Search, Loader2, Plus, Edit, Trash2 } from "lucide-react";
import Image from "next/image";

export default function AdminProductsPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const prodSnap = await getDocs(collection(db, "products"));
      const fetchedProducts = prodSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setProducts(fetchedProducts);
    } catch (error) {
      console.error("Failed to fetch products", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="flex justify-center p-12"><Loader2 className="animate-spin text-primary w-8 h-8" /></div>;

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8 flex justify-between items-end">
        <div>
          <h1 className="font-serif text-3xl font-bold text-dark">Product Catalog</h1>
          <p className="text-foreground/60 text-sm mt-1">Manage your inventory, pricing, and product details.</p>
        </div>
        <div className="flex gap-4">
          <div className="relative">
            <input 
              type="text" 
              placeholder="Search catalog..." 
              className="pl-10 pr-4 py-2 border border-black/10 text-sm focus:border-primary outline-none h-full"
            />
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-foreground/40" />
          </div>
          <button className="flex items-center gap-2 bg-primary text-white px-4 py-2 text-sm font-bold uppercase tracking-widest hover:bg-primary/90 transition-colors">
            <Plus size={16} /> Add Product
          </button>
        </div>
      </div>

      <div className="bg-white rounded-sm border border-black/10 shadow-sm overflow-hidden">
        <div className="overflow-x-auto min-h-[500px]">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-secondary/50 text-xs uppercase tracking-widest text-foreground/60 border-b border-black/10">
                <th className="p-4 font-bold">Product</th>
                <th className="p-4 font-bold">Category</th>
                <th className="p-4 font-bold">Price</th>
                <th className="p-4 font-bold min-w-[200px]">Warehouse Stock Distribution</th>
                <th className="p-4 font-bold">Status</th>
                <th className="p-4 font-bold text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.length === 0 ? (
                <tr><td colSpan={6} className="p-8 text-center text-foreground/50">No products found. Run the /seed route to populate.</td></tr>
              ) : (
                products.map(product => (
                  <tr key={product.id} className="border-b border-black/5 hover:bg-secondary/20 transition-colors text-sm">
                    <td className="p-4">
                      <div className="flex items-center gap-4">
                        <div className="relative w-12 h-16 bg-secondary border border-black/5 shrink-0">
                          {product.images?.[0] && (
                            <Image src={product.images[0]} alt={product.name} fill className="object-cover" />
                          )}
                        </div>
                        <div>
                          <p className="font-serif font-bold text-primary line-clamp-1">{product.name}</p>
                          <p className="text-xs text-foreground/50 mt-1 uppercase tracking-widest">{product.material}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 text-foreground/70">{product.category}</td>
                    <td className="p-4 font-medium">₹{product.price}</td>
                    <td className="p-4">
                      {/* Simulated Multi-Warehouse Data */}
                      <div className="space-y-2 text-xs">
                        <div className="flex justify-between items-center bg-black/5 p-1 rounded-sm">
                          <span className="font-bold opacity-60">Mumbai (Hub)</span>
                          <span className={product.availability === "In Stock" ? "text-green-700 font-bold" : "text-orange-600 font-bold"}>
                            {product.availability === "In Stock" ? "45m" : "5m"}
                          </span>
                        </div>
                        <div className="flex justify-between items-center bg-black/5 p-1 rounded-sm">
                          <span className="font-bold opacity-60">Delhi</span>
                          <span className={product.availability === "In Stock" ? "text-green-700 font-bold" : "text-red-600 font-bold"}>
                            {product.availability === "In Stock" ? "12m" : "0m"}
                          </span>
                        </div>
                        <div className="flex justify-between items-center bg-black/5 p-1 rounded-sm">
                          <span className="font-bold opacity-60">Bangalore</span>
                          <span className={product.availability === "In Stock" ? "text-green-700 font-bold" : "text-orange-600 font-bold"}>
                            {product.availability === "In Stock" ? "28m" : "2m"}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className="text-xs text-green-600 font-bold uppercase tracking-widest">Active</span>
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button className="p-2 hover:bg-black/5 rounded-sm text-foreground/60 hover:text-primary transition-colors">
                          <Edit size={16} />
                        </button>
                        <button className="p-2 hover:bg-red-50 rounded-sm text-foreground/60 hover:text-red-500 transition-colors">
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
    </div>
  );
}
