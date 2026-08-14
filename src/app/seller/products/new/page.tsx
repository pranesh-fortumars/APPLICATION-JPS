"use client";

import { useState } from "react";
import { doc, writeBatch } from "firebase/firestore";
import { db } from "@/lib/firebase/config";
import { useAuth } from "@/context/AuthContext";
import { ArrowLeft, Loader2, Plus, Trash2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import ImageUpload from "@/components/ImageUpload";

interface VariantInput {
  sku: string;
  color: string;
  size: string;
  price: number;
  stock: number;
  status: "Active" | "Inactive";
}

export default function AddProductPage() {
  const { user, userProfile } = useAuth();
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    material: "",
    category: "Fabrics",
    imageUrl1: "",
    imageUrl2: ""
  });

  const [variants, setVariants] = useState<VariantInput[]>([
    { sku: "", color: "Default", size: "Standard", price: 1000, stock: 10, status: "Active" }
  ]);

  const addVariant = () => {
    setVariants([...variants, { sku: "", color: "", size: "", price: 0, stock: 0, status: "Active" }]);
  };

  const removeVariant = (index: number) => {
    if (variants.length === 1) return;
    setVariants(variants.filter((_, i) => i !== index));
  };

  const updateVariant = (index: number, field: keyof VariantInput, value: any) => {
    const newVariants = [...variants];
    newVariants[index] = { ...newVariants[index], [field]: value };
    setVariants(newVariants);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    
    // Validate SKUs are provided and unique
    const skus = variants.map(v => v.sku.trim());
    if (skus.some(sku => !sku)) {
      alert("All variants must have a unique SKU");
      return;
    }
    if (new Set(skus).size !== skus.length) {
      alert("All SKUs must be unique");
      return;
    }

    setSubmitting(true);

    try {
      const newProductId = `p-ven-${Math.floor(Math.random() * 100000)}`;
      const images: string[] = [];
      if (formData.imageUrl1) images.push(formData.imageUrl1);
      if (formData.imageUrl2) images.push(formData.imageUrl2);

      const batch = writeBatch(db);

      // Create Product Document
      const productRef = doc(db, "products", newProductId);
      batch.set(productRef, {
        id: newProductId,
        name: formData.name,
        description: formData.description,
        material: formData.material,
        category: formData.category,
        images: images.length > 0 ? images : ["https://images.unsplash.com/photo-1620799140188-3b2a02fd9a77?w=800"], // fallback image
        sellerId: user.uid,
        sellerName: userProfile?.displayName || "Independent Vendor",
        availability: variants.some(v => v.stock > 0) ? "In Stock" : "Out of Stock",
        isNewArrival: true,
        createdAt: new Date().toISOString()
      });

      // Create Variant Documents
      variants.forEach(variant => {
        const variantRef = doc(db, "variants", variant.sku);
        batch.set(variantRef, {
          id: variant.sku,
          productId: newProductId,
          sku: variant.sku,
          color: variant.color,
          size: variant.size,
          price: Number(variant.price),
          stock: Number(variant.stock),
          status: variant.status,
          images: images // For now, variants share product images
        });
      });

      await batch.commit();
      
      // Trigger Search Index Synchronization securely in the background
      fetch('/api/products/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'index', productId: newProductId })
      }).catch(err => console.error("Failed to sync search index", err));

      alert("Product successfully listed with variants!");
      router.push("/seller/products");
    } catch (error) {
      console.error("Failed to add product", error);
      alert("Failed to list product. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto pb-12">
      <div className="mb-8">
        <Link href="/seller/products" className="inline-flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-foreground/50 hover:text-primary transition-colors mb-4">
          <ArrowLeft size={16} /> Back to Catalog
        </Link>
        <h1 className="font-serif text-3xl font-bold text-dark">Add New Product</h1>
        <p className="text-foreground/60 text-sm mt-1">Create a new listing and manage inventory variants.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        
        {/* Core Details */}
        <div className="bg-white rounded-sm border border-black/10 shadow-sm p-8 space-y-6">
          <h2 className="font-serif text-xl font-bold border-b border-black/10 pb-4">Core Information</h2>
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

          <div>
            <label className="block text-xs font-bold uppercase tracking-widest mb-2 text-foreground/70">Description *</label>
            <textarea 
              required rows={4} value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})}
              placeholder="Describe the fabric's drape, feel, and best use cases..."
              className="w-full border border-black/10 px-4 py-3 text-sm outline-none focus:border-primary resize-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-widest mb-2 text-foreground/70">Material *</label>
            <input 
              required type="text" value={formData.material} onChange={e => setFormData({...formData, material: e.target.value})}
              placeholder="e.g., 100% Pure Silk"
              className="w-full border border-black/10 px-4 py-3 text-sm outline-none focus:border-primary"
            />
          </div>
        </div>

        {/* Variants */}
        <div className="bg-white rounded-sm border border-black/10 shadow-sm p-8 space-y-6">
          <div className="flex justify-between items-center border-b border-black/10 pb-4">
            <div>
              <h2 className="font-serif text-xl font-bold">Product Variants</h2>
              <p className="text-xs text-foreground/60 mt-1">Define sizes, colors, independent pricing, and stock (SKUs).</p>
            </div>
            <button 
              type="button" 
              onClick={addVariant}
              className="flex items-center gap-2 bg-secondary/30 text-dark px-3 py-2 text-xs font-bold uppercase tracking-widest hover:bg-secondary/50 transition-colors rounded-sm"
            >
              <Plus size={14} /> Add Variant
            </button>
          </div>

          <div className="space-y-4">
            {variants.map((variant, index) => (
              <div key={index} className="grid grid-cols-1 md:grid-cols-7 gap-4 items-end bg-secondary/10 p-4 rounded-sm border border-black/5">
                <div className="col-span-2">
                  <label className="block text-[10px] font-bold uppercase tracking-widest mb-1 text-foreground/70">SKU *</label>
                  <input required type="text" placeholder="SILK-RED-M" value={variant.sku} onChange={e => updateVariant(index, 'sku', e.target.value)} className="w-full border border-black/10 px-3 py-2 text-sm outline-none focus:border-primary" />
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-widest mb-1 text-foreground/70">Color *</label>
                  <input required type="text" placeholder="Red" value={variant.color} onChange={e => updateVariant(index, 'color', e.target.value)} className="w-full border border-black/10 px-3 py-2 text-sm outline-none focus:border-primary" />
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-widest mb-1 text-foreground/70">Size *</label>
                  <input required type="text" placeholder="M" value={variant.size} onChange={e => updateVariant(index, 'size', e.target.value)} className="w-full border border-black/10 px-3 py-2 text-sm outline-none focus:border-primary" />
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-widest mb-1 text-foreground/70">Price (₹) *</label>
                  <input required type="number" min="1" value={variant.price} onChange={e => updateVariant(index, 'price', e.target.value)} className="w-full border border-black/10 px-3 py-2 text-sm outline-none focus:border-primary" />
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-widest mb-1 text-foreground/70">Stock *</label>
                  <input required type="number" min="0" value={variant.stock} onChange={e => updateVariant(index, 'stock', e.target.value)} className="w-full border border-black/10 px-3 py-2 text-sm outline-none focus:border-primary" />
                </div>
                <div className="flex justify-end">
                  <button type="button" onClick={() => removeVariant(index)} disabled={variants.length === 1} className="p-2 bg-red-50 text-red-500 rounded-sm hover:bg-red-100 disabled:opacity-50">
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Images */}
        <div className="bg-white rounded-sm border border-black/10 shadow-sm p-8">
          <h2 className="font-serif text-xl font-bold border-b border-black/10 pb-4 mb-6">Product Images</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <ImageUpload 
              label="Main Image *" 
              currentUrl={formData.imageUrl1} 
              onUploadSuccess={(url) => setFormData({...formData, imageUrl1: url})} 
              onRemove={() => setFormData({...formData, imageUrl1: ""})} 
            />
            <ImageUpload 
              label="Hover/Alternate Image" 
              currentUrl={formData.imageUrl2} 
              onUploadSuccess={(url) => setFormData({...formData, imageUrl2: url})} 
              onRemove={() => setFormData({...formData, imageUrl2: ""})} 
            />
          </div>
        </div>

        <div className="pt-4 flex justify-end gap-4">
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
