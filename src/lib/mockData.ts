export type Category = "Womens Fabrics" | "Lining Materials" | "Falls" | "New Arrivals" | "Designer Collection";
export type Material = "Cotton" | "Silk" | "Rayon" | "Chiffon" | "Georgette" | "Crepe" | "Organza" | "Banarasi" | "Linen" | "Velvet";

export interface FabricSpecs {
  softness: number; // 1-5 rating
  drape: number; // 1-5 rating
  weight: number; // 1-5 rating
  transparency: number; // 1-5 rating
  sheen: number; // 1-5 rating
}

export interface ColorVariant {
  name: string;
  hex: string;
  imageIndex: number; // maps to the index in the images array
}

export interface Product {
  id: string;
  name: string;
  sku: string;
  category: Category[];
  material: Material;
  price: number;
  salePrice?: number;
  images: string[];
  colors: string[]; // Keeping this for backward compatibility for now
  colorVariants: ColorVariant[];
  width: string;
  gsm?: number;
  pattern: string;
  availability: "In Stock" | "Low Stock" | "Out of Stock";
  isNewArrival?: boolean;
  
  // Advanced Details
  fabricSpecs: FabricSpecs;
  careInstructions: string;
  bestFor: string[];
  relatedProducts: string[]; // array of product IDs
  description: string;
}

export const mockProducts: Product[] = [
  {
    id: "p-001",
    name: "Royal Burgundy Pure Silk Banarasi",
    sku: "SILK-BAN-001",
    category: ["Womens Fabrics", "Designer Collection"],
    material: "Silk",
    price: 4500,
    images: [
      "https://images.unsplash.com/photo-1605518216938-7c31b7b14ad0?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1584916201218-f4242ceb4809?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
    ],
    colors: ["#4A0D1A", "#D4AF37", "#000000"],
    colorVariants: [
      { name: "Royal Burgundy", hex: "#4A0D1A", imageIndex: 0 },
      { name: "Antique Gold", hex: "#D4AF37", imageIndex: 1 }
    ],
    width: "44 inches",
    gsm: 80,
    pattern: "Floral Zari Work",
    availability: "Low Stock",
    isNewArrival: true,
    fabricSpecs: {
      softness: 4,
      drape: 3,
      weight: 3,
      transparency: 1,
      sheen: 5
    },
    careInstructions: "Dry Clean Only. Iron on reverse side using silk setting.",
    bestFor: ["Bridal Wear", "Sarees", "Festive Lehengas"],
    relatedProducts: ["p-004", "p-005"],
    description: "An exquisite pure silk Banarasi fabric featuring intricate floral zari work. Woven by master artisans, this fabric offers a rich, tactile experience with a brilliant sheen, making it the perfect choice for statement bridal and festive wear."
  },
  {
    id: "p-002",
    name: "Ivory White Premium Rayon",
    sku: "RAY-IVR-002",
    category: ["Womens Fabrics", "New Arrivals"],
    material: "Rayon",
    price: 850,
    images: [
      "https://images.unsplash.com/photo-1528360983277-13d401cdc186?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1620799140188-3b2a02fd9a77?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
    ],
    colors: ["#F7F3ED", "#FFFFFF"],
    colorVariants: [
      { name: "Ivory", hex: "#F7F3ED", imageIndex: 0 },
      { name: "Pure White", hex: "#FFFFFF", imageIndex: 1 }
    ],
    width: "58 inches",
    gsm: 120,
    pattern: "Solid",
    availability: "In Stock",
    fabricSpecs: {
      softness: 5,
      drape: 5,
      weight: 2,
      transparency: 2,
      sheen: 1
    },
    careInstructions: "Machine wash cold on gentle cycle. Do not bleach. Tumble dry low.",
    bestFor: ["Kurtis", "Summer Dresses", "Palazzos"],
    relatedProducts: ["p-003", "p-004"],
    description: "A buttery-soft premium rayon that offers an exceptionally fluid drape. Highly breathable and comfortable for all-day wear, this ivory fabric is a versatile staple for your contemporary wardrobe."
  },
  {
    id: "p-003",
    name: "Emerald Green Georgette",
    sku: "GEO-EMR-003",
    category: ["Womens Fabrics"],
    material: "Georgette",
    price: 1200,
    images: [
      "https://images.unsplash.com/photo-1596464716127-f2a82984de30?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1584916201218-f4242ceb4809?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
    ],
    colors: ["#50C878", "#000000"],
    colorVariants: [
      { name: "Emerald Green", hex: "#50C878", imageIndex: 0 },
      { name: "Midnight Black", hex: "#000000", imageIndex: 1 }
    ],
    width: "44 inches",
    gsm: 60,
    pattern: "Abstract Print",
    availability: "In Stock",
    fabricSpecs: {
      softness: 3,
      drape: 5,
      weight: 1,
      transparency: 4,
      sheen: 2
    },
    careInstructions: "Hand wash gently in cold water or dry clean. Do not wring.",
    bestFor: ["Drape Dresses", "Sarees", "Scarves"],
    relatedProducts: ["p-004", "p-002"],
    description: "A lightweight, semi-sheer georgette with a beautiful bouncy drape. Featuring a subtle abstract print, this fabric creates stunning silhouettes full of movement and grace."
  },
  {
    id: "p-004",
    name: "Premium Cotton Lining",
    sku: "LIN-COT-004",
    category: ["Lining Materials"],
    material: "Cotton",
    price: 150,
    images: [
      "https://images.unsplash.com/photo-1620799140188-3b2a02fd9a77?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1528360983277-13d401cdc186?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
    ],
    colors: ["#FFFFFF", "#000000", "#F7F3ED", "#4A0D1A"],
    colorVariants: [
      { name: "White", hex: "#FFFFFF", imageIndex: 0 },
      { name: "Black", hex: "#000000", imageIndex: 1 }
    ],
    width: "36 inches",
    gsm: 100,
    pattern: "Solid",
    availability: "In Stock",
    fabricSpecs: {
      softness: 4,
      drape: 2,
      weight: 2,
      transparency: 1,
      sheen: 1
    },
    careInstructions: "Pre-wash recommended before stitching. Machine wash normal.",
    bestFor: ["Inner Lining", "Undergarments", "Petticoats"],
    relatedProducts: ["p-001", "p-003"],
    description: "High-quality, breathable 100% cotton lining material. Designed to provide comfort and structure to your primary garments without adding unnecessary bulk."
  },
  {
    id: "p-005",
    name: "Designer Saree Fall",
    sku: "FAL-COT-005",
    category: ["Falls"],
    material: "Cotton",
    price: 80,
    images: [
      "https://images.unsplash.com/photo-1584916201218-f4242ceb4809?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1605518216938-7c31b7b14ad0?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
    ],
    colors: ["#D4AF37", "#4A0D1A", "#50C878"],
    colorVariants: [
      { name: "Gold", hex: "#D4AF37", imageIndex: 0 },
      { name: "Burgundy", hex: "#4A0D1A", imageIndex: 1 }
    ],
    width: "5 inches",
    pattern: "Solid",
    availability: "In Stock",
    fabricSpecs: {
      softness: 2,
      drape: 1,
      weight: 4,
      transparency: 1,
      sheen: 1
    },
    careInstructions: "Wash with similar colors. Do not bleach.",
    bestFor: ["Saree Borders"],
    relatedProducts: ["p-001"],
    description: "Durable, high-quality cotton fall designed to protect the hem of your expensive sarees. Carefully woven to ensure it doesn't shrink after washing, maintaining the pristine drape of your saree."
  }
];
