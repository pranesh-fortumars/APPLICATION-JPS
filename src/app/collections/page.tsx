"use client";

import { useState, useMemo, useEffect, Suspense } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSearchParams, useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import { Category, Material, Product } from "@/lib/mockData";
import { Filter, X, Search, Loader2 } from "lucide-react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase/config";

const CATEGORIES: Category[] = ["Womens Fabrics", "Lining Materials", "Falls", "New Arrivals", "Designer Collection"];
const MATERIALS: Material[] = ["Cotton", "Silk", "Rayon", "Chiffon", "Georgette", "Crepe"];

function CollectionsContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  
  const initialCategory = (searchParams.get("category") as Category) || "All";
  
  const [selectedCategory, setSelectedCategory] = useState<Category | "All">(initialCategory);
  const [selectedMaterial, setSelectedMaterial] = useState<Material | "All">("All");
  const [maxPrice, setMaxPrice] = useState<number>(10000);
  const [searchQuery, setSearchQuery] = useState("");
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch products from Firestore
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "products"));
        const fetchedProducts: Product[] = [];
        querySnapshot.forEach((doc) => {
          fetchedProducts.push({ id: doc.id, ...doc.data() } as Product);
        });
        setProducts(fetchedProducts);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Update URL when category changes, or sync state when URL changes
  useEffect(() => {
    const categoryFromUrl = (searchParams.get("category") as Category) || "All";
    if (categoryFromUrl !== selectedCategory) {
      setSelectedCategory(categoryFromUrl);
    }
  }, [searchParams]);

  const handleCategoryChange = (cat: Category | "All") => {
    setSelectedCategory(cat);
    // Update URL without reloading
    const newParams = new URLSearchParams(searchParams.toString());
    if (cat === "All") {
      newParams.delete("category");
    } else {
      newParams.set("category", cat);
    }
    router.push(`/collections?${newParams.toString()}`, { scroll: false });
  };

  // Instant filtering logic
  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchCategory = selectedCategory === "All" || product.category.includes(selectedCategory);
      const matchMaterial = selectedMaterial === "All" || product.material === selectedMaterial;
      const matchSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchPrice = product.price <= maxPrice;
      return matchCategory && matchMaterial && matchSearch && matchPrice;
    });
  }, [products, selectedCategory, selectedMaterial, searchQuery, maxPrice]);

  const FilterSidebar = () => (
    <div className="flex flex-col gap-8 w-full md:w-64 shrink-0">
      {/* Search */}
      <div className="relative">
        <input 
          type="text"
          placeholder="Search fabrics..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full bg-transparent border-b border-black/20 dark:border-white/20 pb-2 pl-8 outline-none focus:border-primary transition-colors text-sm"
        />
        <Search size={16} className="absolute left-0 top-0.5 text-foreground/50" />
      </div>

      {/* Categories */}
      <div>
        <h3 className="font-serif text-lg font-bold mb-4 text-primary">Categories</h3>
        <div className="flex flex-col gap-2">
          <label className="flex items-center gap-3 text-sm cursor-pointer hover:text-accent transition-colors">
            <input 
              type="radio" 
              name="category" 
              checked={selectedCategory === "All"}
              onChange={() => handleCategoryChange("All")}
              className="accent-primary w-4 h-4" 
            />
            All Collections
          </label>
          {CATEGORIES.map((cat) => (
            <label key={cat} className="flex items-center gap-3 text-sm cursor-pointer hover:text-accent transition-colors">
              <input 
                type="radio" 
                name="category"
                checked={selectedCategory === cat}
                onChange={() => handleCategoryChange(cat)}
                className="accent-primary w-4 h-4" 
              />
              {cat}
            </label>
          ))}
        </div>
      </div>

      {/* Materials */}
      <div>
        <h3 className="font-serif text-lg font-bold mb-4 text-primary">Materials</h3>
        <div className="flex flex-col gap-2">
          <label className="flex items-center gap-3 text-sm cursor-pointer hover:text-accent transition-colors">
            <input 
              type="radio" 
              name="material"
              checked={selectedMaterial === "All"}
              onChange={() => setSelectedMaterial("All")}
              className="accent-primary w-4 h-4" 
            />
            All Materials
          </label>
          {MATERIALS.map((mat) => (
            <label key={mat} className="flex items-center gap-3 text-sm cursor-pointer hover:text-accent transition-colors">
              <input 
                type="radio" 
                name="material"
                checked={selectedMaterial === mat}
                onChange={() => setSelectedMaterial(mat)}
                className="accent-primary w-4 h-4" 
              />
              {mat}
            </label>
          ))}
        </div>
      </div>

      {/* Price */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-serif text-lg font-bold text-primary">Max Price</h3>
          <span className="text-sm font-semibold text-accent">₹{maxPrice}</span>
        </div>
        <input 
          type="range"
          min="100"
          max="10000"
          step="100"
          value={maxPrice}
          onChange={(e) => setMaxPrice(Number(e.target.value))}
          className="w-full accent-primary"
        />
        <div className="flex justify-between text-xs text-foreground/50 mt-2">
          <span>₹100</span>
          <span>₹10,000+</span>
        </div>
      </div>
    </div>
  );

  return (
    <main className="flex flex-col min-h-screen bg-background pt-24">
      <Navbar />

      <div className="bg-dark text-secondary py-16 text-center px-6">
        <h1 className="text-4xl md:text-5xl font-serif mb-4 font-bold tracking-wide">
          Premium Fabric Collection
        </h1>
        <p className="text-secondary/70 font-sans max-w-2xl mx-auto font-light">
          Explore our curated selection of luxury materials tailored for elegant creations.
        </p>
      </div>

      <section className="max-w-[1400px] mx-auto w-full px-6 py-12 flex flex-col md:flex-row gap-12 items-start">
        {/* Mobile Filter Toggle */}
        <button 
          className="md:hidden flex items-center gap-2 border border-black/10 dark:border-white/10 px-4 py-2 w-full justify-center text-sm uppercase tracking-widest font-semibold text-primary"
          onClick={() => setIsMobileFilterOpen(true)}
        >
          <Filter size={16} /> Filters
        </button>

        {/* Desktop Sidebar */}
        <aside className="hidden md:block sticky top-32">
          <FilterSidebar />
        </aside>

        {/* Mobile Sidebar Modal */}
        <AnimatePresence>
          {isMobileFilterOpen && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 z-50 md:hidden flex justify-end"
            >
              <motion.div 
                initial={{ x: "100%" }}
                animate={{ x: 0 }}
                exit={{ x: "100%" }}
                transition={{ type: "tween", duration: 0.3 }}
                className="w-4/5 max-w-sm h-full bg-background p-6 overflow-y-auto"
              >
                <div className="flex justify-between items-center mb-8">
                  <h2 className="font-serif text-xl font-bold">Filters</h2>
                  <button onClick={() => setIsMobileFilterOpen(false)}><X size={24} /></button>
                </div>
                <FilterSidebar />
                
                <button 
                  onClick={() => setIsMobileFilterOpen(false)}
                  className="w-full mt-8 bg-primary text-white py-3 uppercase tracking-widest text-sm font-semibold"
                >
                  View Results ({filteredProducts.length})
                </button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Product Grid */}
        <div className="flex-1 w-full">
          <div className="flex justify-between items-center mb-8 pb-4 border-b border-black/10 dark:border-white/10">
            <p className="text-sm font-medium text-foreground/60 uppercase tracking-wider">
              {loading ? "Loading Products..." : `Showing ${filteredProducts.length} Products`}
            </p>
          </div>

          {loading ? (
            <div className="flex flex-col items-center justify-center py-32 text-center text-foreground/50">
              <Loader2 className="w-12 h-12 animate-spin mb-4 text-primary" />
              <p className="text-lg font-serif">Loading luxury fabrics from database...</p>
            </div>
          ) : filteredProducts.length > 0 ? (
            <motion.div 
              layout
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-6 gap-y-12"
            >
              <AnimatePresence>
                {filteredProducts.map(product => (
                  <motion.div
                    key={product.id}
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.3 }}
                  >
                    <ProductCard product={product} />
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          ) : (
            <div className="flex flex-col items-center justify-center py-32 text-center">
              <p className="text-2xl font-serif text-foreground/50 mb-4">No fabrics found matching your criteria.</p>
              <button 
                onClick={() => { handleCategoryChange("All"); setSelectedMaterial("All"); setSearchQuery(""); setMaxPrice(10000); }}
                className="text-accent underline hover:text-primary transition-colors uppercase tracking-widest text-sm font-bold"
              >
                Clear all filters
              </button>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </main>
  );
}

export default function CollectionsPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-background flex items-center justify-center">Loading collections...</div>}>
      <CollectionsContent />
    </Suspense>
  );
}
