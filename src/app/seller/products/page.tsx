"use client";

import { useEffect, useState } from "react";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "@/lib/firebase/config";
import { useAuth } from "@/context/AuthContext";
import { Search, Loader2, Plus, Edit, Trash2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function SellerProductsPage() {
  const { user } = useAuth();
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    
    const fetchProducts = async () => {
      try {
        const prodQ = query(collection(db, "products"), where("sellerId", "==", user.uid));
        const prodSnap = await getDocs(prodQ);
        const fetchedProducts = prodSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setProducts(fetchedProducts);
      } catch (error) {
        console.error("Failed to fetch products", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [user]);

  if (loading) return <div className="flex justify-center p-12"><Loader2 className="animate-spin text-primary w-8 h-8" /></div>;

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="font-serif text-3xl font-bold text-dark">My Catalog</h1>
          <p className="text-foreground/60 text-sm mt-1">Manage the products you are selling on JPS.</p>
        </div>
        <div className="flex gap-4">
          <div className="relative flex-1 md:flex-none">
            <input 
              type="text" 
              placeholder="Search my products..." 
              className="w-full pl-10 pr-4 py-2 border border-black/10 text-sm focus:border-primary outline-none h-full"
            />
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-foreground/40" />
          </div>
          <Link href="/seller/products/new" className="flex items-center gap-2 bg-primary text-white px-4 py-2 text-sm font-bold uppercase tracking-widest hover:bg-primary/90 transition-colors shrink-0">
            <Plus size={16} /> Add Product
          </Link>
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
                <th className="p-4 font-bold">Stock</th>
                <th className="p-4 font-bold text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-12 text-center text-foreground/50">
                    <p className="mb-4 text-lg font-serif">You haven't listed any products yet.</p>
                    <Link href="/seller/products/new" className="inline-flex items-center gap-2 bg-primary text-white px-6 py-3 text-sm font-bold uppercase tracking-widest hover:bg-primary/90 transition-colors">
                      <Plus size={16} /> Create Your First Listing
                    </Link>
                  </td>
                </tr>
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
                      <span className={`inline-block px-2 py-1 text-[10px] uppercase tracking-widest font-bold rounded-full ${
                        product.availability === "In Stock" ? "bg-green-100 text-green-700" :
                        product.availability === "Low Stock" ? "bg-orange-100 text-orange-700" :
                        "bg-red-100 text-red-700"
                      }`}>
                        {product.availability || "In Stock"}
                      </span>
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
