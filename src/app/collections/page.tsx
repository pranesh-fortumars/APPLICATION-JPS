"use client";

import { useState, useMemo, useEffect, Suspense } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSearchParams, useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import { Category, Material, Product, mockProducts } from "@/lib/mockData";
import { Filter, X, Search, Loader2, ChevronDown } from "lucide-react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase/config";

const CATEGORIES: Category[] = ["Womens Fabrics", "Lining Materials", "Falls", "New Arrivals", "Designer Collection"];
const MATERIALS: Material[] = ["Cotton", "Silk", "Rayon", "Chiffon", "Georgette", "Crepe"];
const PATTERNS = ["Solid", "Floral", "Abstract", "Zari Work", "Printed"];
const COLORS = [
  { name: "White", hex: "#FFFFFF" },
  { name: "Black", hex: "#000000" },
  { name: "Red", hex: "#4A0D1A" },
  { name: "Green", hex: "#50C878" },
  { name: "Gold", hex: "#D4AF37" }
];

type SortOption = "featured" | "newest" | "price_asc" | "price_desc";

function CollectionsContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  
  const initialCategory = (searchParams.get("category") as Category) || "All";
  
  const [selectedCategory, setSelectedCategory] = useState<Category | "All">(initialCategory);
  const [selectedMaterial, setSelectedMaterial] = useState<Material | "All">("All");
  const [selectedPattern, setSelectedPattern] = useState<string>("All");
  const [selectedColor, setSelectedColor] = useState<string>("All");
  const [maxPrice, setMaxPrice] = useState<number>(10000);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<SortOption>("featured");
  
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch products
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "products"));
        const fetchedProducts: Product[] = [];
        querySnapshot.forEach((doc) => {
          fetchedProducts.push({ id: doc.id, ...doc.data() } as Product);
        });
        
        if (fetchedProducts.length === 0) {
          setProducts(mockProducts);
        } else {
          setProducts(fetchedProducts);
        }
      } catch (error) {
        console.error("Error fetching products:", error);
        setProducts(mockProducts);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  // Update URL when category changes
  useEffect(() => {
    const categoryFromUrl = (searchParams.get("category") as Category) || "All";
    if (categoryFromUrl !== selectedCategory) {
      setSelectedCategory(categoryFromUrl);
    }
  }, [searchParams]);

  const handleCategoryChange = (cat: Category | "All") => {
    setSelectedCategory(cat);
    const newParams = new URLSearchParams(searchParams.toString());
    if (cat === "All") {
      newParams.delete("category");
    } else {
      newParams.set("category", cat);
    }
    router.push(`/collections?${newParams.toString()}`, { scroll: false });
  };

  // Instant filtering & sorting logic
  const filteredProducts = useMemo(() => {
    let result = products.filter((product) => {
      const matchCategory = selectedCategory === "All" || product.category.includes(selectedCategory as any);
      const matchMaterial = selectedMaterial === "All" || product.material === selectedMaterial;
      const matchPattern = selectedPattern === "All" || (product.pattern && product.pattern.includes(selectedPattern));
      const matchSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchPrice = product.price <= maxPrice;
      
      let matchColor = true;
      if (selectedColor !== "All") {
        const selectedHex = COLORS.find(c => c.name === selectedColor)?.hex;
        matchColor = product.colors && selectedHex ? product.colors.includes(selectedHex) : false;
      }
      
      return matchCategory && matchMaterial && matchPattern && matchColor && matchSearch && matchPrice;
    });

    switch(sortBy) {
      case "price_asc":
        result = result.sort((a, b) => a.price - b.price);
        break;
      case "price_desc":
        result = result.sort((a, b) => b.price - a.price);
        break;
      case "newest":
        result = result.sort((a, b) => (b.isNewArrival ? 1 : 0) - (a.isNewArrival ? 1 : 0));
        break;
      default:
        // featured: keep original order
        break;
    }
    return result;
  }, [products, selectedCategory, selectedMaterial, selectedPattern, searchQuery, maxPrice, sortBy]);

  const FilterSidebar = () => (
    <div className="flex flex-col gap-8 w-full md:w-64 shrink-0 hide-scrollbar pb-12">
      {/* Search */}
      <div className="relative">
        <input 
          type="text"
          placeholder="Search within results..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full bg-transparent border-b border-black/20 dark:border-white/20 pb-2 pl-8 outline-none focus:border-primary transition-colors text-sm"
        />
        <Search size={16} className="absolute left-0 top-0.5 text-foreground/50" />
      </div>

      {/* Categories */}
      <div>
        <h3 className="font-serif text-lg font-bold mb-4 text-primary">Categories</h3>
        <div className="flex flex-col gap-2 max-h-48 overflow-y-auto pr-2">
          <label className="flex items-center gap-3 text-sm cursor-pointer hover:text-accent transition-colors">
            <input 
              type="radio" name="category" checked={selectedCategory === "All"}
              onChange={() => handleCategoryChange("All")}
              className="accent-primary w-4 h-4" 
            />
            All Collections
          </label>
          {CATEGORIES.map((cat) => (
            <label key={cat} className="flex items-center gap-3 text-sm cursor-pointer hover:text-accent transition-colors">
              <input 
                type="radio" name="category" checked={selectedCategory === cat}
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
        <div className="flex flex-col gap-2 max-h-48 overflow-y-auto pr-2">
          <label className="flex items-center gap-3 text-sm cursor-pointer hover:text-accent transition-colors">
            <input 
              type="radio" name="material" checked={selectedMaterial === "All"}
              onChange={() => setSelectedMaterial("All")}
              className="accent-primary w-4 h-4" 
            />
            All Materials
          </label>
          {MATERIALS.map((mat) => (
            <label key={mat} className="flex items-center gap-3 text-sm cursor-pointer hover:text-accent transition-colors">
              <input 
                type="radio" name="material" checked={selectedMaterial === mat}
                onChange={() => setSelectedMaterial(mat)}
                className="accent-primary w-4 h-4" 
              />
              {mat}
            </label>
          ))}
        </div>
      </div>

      {/* Patterns */}
      <div>
        <h3 className="font-serif text-lg font-bold mb-4 text-primary">Pattern</h3>
        <div className="flex flex-col gap-2 max-h-48 overflow-y-auto pr-2">
          <label className="flex items-center gap-3 text-sm cursor-pointer hover:text-accent transition-colors">
            <input 
              type="radio" name="pattern" checked={selectedPattern === "All"}
              onChange={() => setSelectedPattern("All")}
              className="accent-primary w-4 h-4" 
            />
            All Patterns
          </label>
          {PATTERNS.map((pat) => (
            <label key={pat} className="flex items-center gap-3 text-sm cursor-pointer hover:text-accent transition-colors">
              <input 
                type="radio" name="pattern" checked={selectedPattern === pat}
                onChange={() => setSelectedPattern(pat)}
                className="accent-primary w-4 h-4" 
              />
              {pat}
            </label>
          ))}
        </div>
      </div>

      {/* Colors */}
      <div>
        <h3 className="font-serif text-lg font-bold mb-4 text-primary">Colors</h3>
        <div className="flex flex-wrap gap-2 pr-2">
          <button 
            onClick={() => setSelectedColor("All")}
            className={`px-3 py-1 text-xs border rounded-sm transition-colors ${selectedColor === "All" ? 'bg-primary text-white border-primary' : 'bg-transparent text-primary hover:border-primary border-black/10'}`}
          >
            All
          </button>
          {COLORS.map((col) => (
            <button 
              key={col.name}
              onClick={() => setSelectedColor(col.name)}
              className={`w-6 h-6 rounded-full border shadow-sm transition-transform ${selectedColor === col.name ? 'scale-110 ring-2 ring-primary ring-offset-1 border-transparent' : 'border-black/10 hover:scale-110'}`}
              style={{ backgroundColor: col.hex }}
              title={col.name}
            />
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
          type="range" min="100" max="10000" step="100"
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
    <main className="flex flex-col min-h-screen bg-background pt-32">
      <Navbar />

      <div className="bg-primary text-secondary py-16 text-center px-6">
        <h1 className="text-4xl md:text-5xl font-serif mb-4 font-bold tracking-wide">
          {selectedCategory === "All" ? "Premium Fabric Collection" : selectedCategory}
        </h1>
        <p className="text-secondary/70 font-sans max-w-2xl mx-auto font-light text-sm md:text-base">
          Explore our curated selection of luxury materials tailored for elegant creations.
        </p>
      </div>

      <section className="max-w-[1440px] mx-auto w-full px-6 py-12 flex flex-col md:flex-row gap-12 items-start relative">
        {/* Mobile Filter Toggle */}
        <div className="md:hidden flex flex-col w-full gap-4">
          <div className="flex justify-between items-center">
            <span className="text-xs uppercase tracking-widest font-bold text-primary/50">{filteredProducts.length} Results</span>
            <div className="relative border border-black/10 px-3 py-2 flex items-center gap-2">
              <select 
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortOption)}
                className="bg-transparent text-sm uppercase tracking-widest font-bold outline-none appearance-none pr-6 cursor-pointer"
              >
                <option value="featured">Featured</option>
                <option value="newest">Newest</option>
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
              </select>
              <ChevronDown size={14} className="absolute right-3 pointer-events-none" />
            </div>
          </div>
          <button 
            className="flex items-center gap-2 border border-black/10 px-4 py-3 w-full justify-center text-sm uppercase tracking-widest font-bold text-primary bg-black/5"
            onClick={() => setIsMobileFilterOpen(true)}
          >
            <Filter size={16} /> Filters
          </button>
        </div>

        {/* Desktop Sidebar */}
        <aside className="hidden md:block sticky top-32 h-[calc(100vh-140px)] overflow-y-auto hide-scrollbar">
          <FilterSidebar />
        </aside>

        {/* Mobile Sidebar Modal */}
        <AnimatePresence>
          {isMobileFilterOpen && (
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 z-50 md:hidden flex justify-end"
            >
              <motion.div 
                initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }}
                transition={{ type: "tween", duration: 0.3 }}
                className="w-4/5 max-w-sm h-full bg-background p-6 overflow-y-auto flex flex-col"
              >
                <div className="flex justify-between items-center mb-8 sticky top-0 bg-background z-10 py-2 border-b border-black/5">
                  <h2 className="font-serif text-xl font-bold">Filters</h2>
                  <button onClick={() => setIsMobileFilterOpen(false)} className="p-2 bg-black/5 rounded-full"><X size={20} /></button>
                </div>
                
                <div className="flex-1">
                  <FilterSidebar />
                </div>
                
                <div className="sticky bottom-0 bg-background pt-4 border-t border-black/5 mt-auto">
                  <button 
                    onClick={() => setIsMobileFilterOpen(false)}
                    className="w-full bg-primary text-white py-4 uppercase tracking-widest text-sm font-bold shadow-lg"
                  >
                    View Results ({filteredProducts.length})
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Product Grid Area */}
        <div className="flex-1 w-full flex flex-col min-h-[500px]">
          {/* Desktop Top Bar (Sort) */}
          <div className="hidden md:flex justify-between items-center mb-8 pb-4 border-b border-black/10 dark:border-white/10">
            <p className="text-sm font-bold text-primary/60 uppercase tracking-widest">
              {loading ? "Loading..." : `${filteredProducts.length} Products`}
            </p>
            <div className="flex items-center gap-3">
              <span className="text-xs font-bold uppercase tracking-widest text-primary/40">Sort By:</span>
              <div className="relative">
                <select 
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as SortOption)}
                  className="bg-transparent border-b border-black/20 pb-1 text-sm uppercase tracking-widest font-bold outline-none appearance-none pr-6 cursor-pointer focus:border-primary"
                >
                  <option value="featured">Featured</option>
                  <option value="newest">Newest Arrivals</option>
                  <option value="price_asc">Price: Low to High</option>
                  <option value="price_desc">Price: High to Low</option>
                </select>
                <ChevronDown size={14} className="absolute right-0 top-1 pointer-events-none text-primary" />
              </div>
            </div>
          </div>

          {/* Grid */}
          {loading ? (
            <div className="flex flex-col items-center justify-center py-32 text-center text-foreground/50 m-auto">
              <Loader2 className="w-12 h-12 animate-spin mb-4 text-primary" />
              <p className="text-lg font-serif">Loading luxury fabrics...</p>
            </div>
          ) : filteredProducts.length > 0 ? (
            <motion.div 
              layout
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-12"
            >
              <AnimatePresence>
                {filteredProducts.map(product => (
                  <motion.div
                    key={product.id}
                    layout
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.3 }}
                  >
                    <ProductCard product={product} />
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          ) : (
            <div className="flex flex-col items-center justify-center py-32 text-center m-auto bg-black/5 rounded-sm p-8">
              <Filter size={48} className="text-primary/20 mb-4" />
              <p className="text-2xl font-serif text-primary/60 mb-2">No fabrics match your filters.</p>
              <p className="text-sm font-sans text-primary/40 mb-6">Try adjusting your price range or selecting different materials.</p>
              <button 
                onClick={() => { handleCategoryChange("All"); setSelectedMaterial("All"); setSelectedPattern("All"); setSearchQuery(""); setMaxPrice(10000); }}
                className="bg-white border border-black/10 px-6 py-3 text-primary uppercase tracking-widest text-xs font-bold hover:bg-primary hover:text-white transition-colors"
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
    <Suspense fallback={<div className="min-h-screen bg-background flex items-center justify-center"><Loader2 className="animate-spin text-primary" /></div>}>
      <CollectionsContent />
    </Suspense>
  );
}
