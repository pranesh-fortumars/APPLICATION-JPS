export type Category = "Womens Fabrics" | "Lining Materials" | "Falls" | "New Arrivals" | "Designer Collection";
export type Material = "Cotton" | "Silk" | "Rayon" | "Chiffon" | "Georgette" | "Crepe";

export interface Product {
  id: string;
  name: string;
  category: Category[];
  material: Material;
  price: number;
  images: string[];
  colors: string[];
  width: string;
  gsm?: number;
  pattern: string;
  availability: "In Stock" | "Low Stock" | "Out of Stock";
  isNewArrival?: boolean;
}

export const mockProducts: Product[] = [
  {
    id: "p-001",
    name: "Royal Burgundy Pure Silk Banarasi",
    category: ["Womens Fabrics", "Designer Collection"],
    material: "Silk",
    price: 4500,
    images: [
      "https://images.unsplash.com/photo-1605518216938-7c31b7b14ad0?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1584916201218-f4242ceb4809?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
    ],
    colors: ["#4A0D1A", "#D4AF37", "#000000"],
    width: "44 inches",
    gsm: 80,
    pattern: "Floral Zari Work",
    availability: "Low Stock",
    isNewArrival: true,
  },
  {
    id: "p-002",
    name: "Ivory White Premium Rayon",
    category: ["Womens Fabrics", "New Arrivals"],
    material: "Rayon",
    price: 850,
    images: [
      "https://images.unsplash.com/photo-1528360983277-13d401cdc186?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1620799140188-3b2a02fd9a77?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
    ],
    colors: ["#F7F3ED", "#FFFFFF"],
    width: "58 inches",
    gsm: 120,
    pattern: "Solid",
    availability: "In Stock",
  },
  {
    id: "p-003",
    name: "Emerald Green Georgette",
    category: ["Womens Fabrics"],
    material: "Georgette",
    price: 1200,
    images: [
      "https://images.unsplash.com/photo-1596464716127-f2a82984de30?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1584916201218-f4242ceb4809?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
    ],
    colors: ["#50C878", "#000000"],
    width: "44 inches",
    gsm: 60,
    pattern: "Abstract Print",
    availability: "In Stock",
  },
  {
    id: "p-004",
    name: "Premium Cotton Lining",
    category: ["Lining Materials"],
    material: "Cotton",
    price: 150,
    images: [
      "https://images.unsplash.com/photo-1620799140188-3b2a02fd9a77?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1528360983277-13d401cdc186?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
    ],
    colors: ["#FFFFFF", "#000000", "#F7F3ED", "#4A0D1A"],
    width: "36 inches",
    gsm: 100,
    pattern: "Solid",
    availability: "In Stock",
  },
  {
    id: "p-005",
    name: "Designer Saree Fall",
    category: ["Falls"],
    material: "Cotton",
    price: 80,
    images: [
      "https://images.unsplash.com/photo-1584916201218-f4242ceb4809?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1605518216938-7c31b7b14ad0?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
    ],
    colors: ["#D4AF37", "#4A0D1A", "#50C878"],
    width: "5 inches",
    pattern: "Solid",
    availability: "In Stock",
  }
];
