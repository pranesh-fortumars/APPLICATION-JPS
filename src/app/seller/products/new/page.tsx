"use client";

import { useState } from "react";
import { collection, doc, setDoc } from "firebase/firestore";
import { db } from "@/lib/firebase/config";
import { useAuth } from "@/context/AuthContext";
import { ArrowLeft, Loader2, Upload } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function AddProductPage() {
  const { user, userProfile } = useAuth();
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    material: "",
    width: "44 inches",
    category: "Fabrics",
    colors: "",
    imageUrl1: "",
    imageUrl2: ""
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setSubmitting(true);

    try {
      const newProductId = `p-ven-${Math.floor(Math.random() * 100000)}`;
      const images = [];
      if (formData.imageUrl1) images.push(formData.imageUrl1);
      if (formData.imageUrl2) images.push(formData.imageUrl2);

      const colorArray = formData.colors.split(",").map(c => c.trim()).filter(c => c);

      const productDoc = {
        id: newProductId,
        name: formData.name,
        description: formData.description,
        price: Number(formData.price),
        material: formData.material,
        width: formData.width,
        category: formData.category,
        colors: colorArray.length > 0 ? colorArray : ["Multicolor"],
        images: images.length > 0 ? images : ["https://images.unsplash.com/photo-1620799140188-3b2a02fd9a77?w=800"], // fallback image
        sellerId: user.uid,
        sellerName: userProfile?.displayName || "Independent Vendor",
        availability: "In Stock",
        isNewArrival: true,
        createdAt: new Date().toISOString()
      };

      await setDoc(doc(db, "products", newProductId), productDoc);
      alert("Product successfully listed!");
      router.push("/seller/products");
    } catch (error) {
      console.error("Failed to add product", error);
      alert("Failed to list product. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto pb-12">
      <div className="mb-8">
        <Link href="/seller/products" className="inline-flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-foreground/50 hover:text-primary transition-colors mb-4">
          <ArrowLeft size={16} /> Back to Catalog
        </Link>
        <h1 className="font-serif text-3xl font-bold text-dark">Add New Product</h1>
        <p className="text-foreground/60 text-sm mt-1">Create a new listing for your fabric on the JPS Marketplace.</p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-sm border border-black/10 shadow-sm p-8">
        
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-bold uppercase tracking-widest mb-2 text-foreground/70">Product Name *</label>
              <input 
                required type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})}
                placeholder="e.g., Premium Royal Silk"
                className="w-full border border-black/10 px-4 py-3 text-sm outline-none focus:border-primary"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-widest mb-2 text-foreground/70">Price (₹) per meter *</label>
              <input 
                required type="number" min="1" value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})}
                placeholder="e.g., 1499"
                className="w-full border border-black/10 px-4 py-3 text-sm outline-none focus:border-primary"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-widest mb-2 text-foreground/70">Description *</label>
            <textarea 
              required rows={4} value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})}
              placeholder="Describe the fabric's drape, feel, and best use cases..."
              className="w-full border border-black/10 px-4 py-3 text-sm outline-none focus:border-primary resize-none"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-bold uppercase tracking-widest mb-2 text-foreground/70">Material *</label>
              <input 
                required type="text" value={formData.material} onChange={e => setFormData({...formData, material: e.target.value})}
                placeholder="e.g., 100% Pure Silk"
                className="w-full border border-black/10 px-4 py-3 text-sm outline-none focus:border-primary"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-widest mb-2 text-foreground/70">Category *</label>
              <select 
                value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})}
                className="w-full border border-black/10 px-4 py-3 text-sm outline-none focus:border-primary bg-white"
              >
                <option value="Fabrics">Fabrics</option>
                <option value="Sarees">Sarees</option>
                <option value="Unstitched Suits">Unstitched Suits</option>
                <option value="Bridal">Bridal</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-bold uppercase tracking-widest mb-2 text-foreground/70">Available Colors (Comma Separated)</label>
              <input 
                type="text" value={formData.colors} onChange={e => setFormData({...formData, colors: e.target.value})}
                placeholder="Red, Blue, #FF0000"
                className="w-full border border-black/10 px-4 py-3 text-sm outline-none focus:border-primary"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-widest mb-2 text-foreground/70">Width</label>
              <input 
                type="text" value={formData.width} onChange={e => setFormData({...formData, width: e.target.value})}
                placeholder="44 inches"
                className="w-full border border-black/10 px-4 py-3 text-sm outline-none focus:border-primary"
              />
            </div>
          </div>

          <div className="p-6 border border-black/10 bg-secondary/20 rounded-sm">
            <h3 className="font-serif font-bold text-lg mb-4 flex items-center gap-2"><Upload size={18} /> Product Images</h3>
            <p className="text-xs text-foreground/60 mb-4">For the beta, please provide public image URLs (e.g., from Unsplash or Imgur). We will add direct file uploads in a future phase.</p>
            
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest mb-2 text-foreground/70">Main Image URL *</label>
                <input 
                  required type="url" value={formData.imageUrl1} onChange={e => setFormData({...formData, imageUrl1: e.target.value})}
                  placeholder="https://..."
                  className="w-full border border-black/10 px-4 py-3 text-sm outline-none focus:border-primary bg-white"
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest mb-2 text-foreground/70">Hover/Alternate Image URL</label>
                <input 
                  type="url" value={formData.imageUrl2} onChange={e => setFormData({...formData, imageUrl2: e.target.value})}
                  placeholder="https://..."
                  className="w-full border border-black/10 px-4 py-3 text-sm outline-none focus:border-primary bg-white"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-black/10 flex justify-end gap-4">
          <Link href="/seller/products" className="px-6 py-4 font-bold uppercase tracking-widest text-sm text-foreground/60 hover:text-dark transition-colors">
            Cancel
          </Link>
          <button 
            type="submit" 
            disabled={submitting}
            className="px-8 py-4 bg-primary text-white font-bold uppercase tracking-widest text-sm hover:bg-primary/90 transition-colors disabled:opacity-50 flex items-center gap-2"
          >
            {submitting && <Loader2 size={16} className="animate-spin" />}
            {submitting ? "Publishing..." : "Publish Product"}
          </button>
        </div>

      </form>
    </div>
  );
}
