"use client";

import { useState } from "react";
import { collection, doc, setDoc } from "firebase/firestore";
import { db } from "@/lib/firebase/config";
import { mockProducts } from "@/lib/mockData";

export default function SeedPage() {
  const [status, setStatus] = useState("Idle");
  const [loading, setLoading] = useState(false);

  const handleSeed = async () => {
    setLoading(true);
    setStatus("Seeding products...");
    let count = 0;

    try {
      for (const product of mockProducts) {
        // Use the product ID as the document ID
        const productRef = doc(collection(db, "products"), product.id);
        
        // Remove undefined fields if any, as Firestore rejects them
        const cleanProduct = JSON.parse(JSON.stringify(product));
        
        // Add a createdAt timestamp
        cleanProduct.createdAt = new Date().toISOString();
        cleanProduct.updatedAt = new Date().toISOString();
        
        await setDoc(productRef, cleanProduct);
        count++;
        setStatus(`Seeded ${count}/${mockProducts.length}: ${product.name}`);
      }
      
      setStatus(`Success! Seeded ${count} products.`);
    } catch (error: any) {
      console.error(error);
      setStatus(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-32 px-10">
      <h1 className="text-3xl font-bold mb-6">Database Seeder</h1>
      <p className="mb-4">This will upload all mockProducts from local data to the Firestore "products" collection.</p>
      
      <button 
        onClick={handleSeed}
        disabled={loading}
        className="px-6 py-3 bg-primary text-white rounded-md disabled:opacity-50 mb-6"
      >
        {loading ? "Seeding..." : "Start Seeding"}
      </button>

      <div className="p-4 bg-gray-100 rounded-md text-sm font-mono whitespace-pre-wrap">
        {status}
      </div>
    </div>
  );
}
