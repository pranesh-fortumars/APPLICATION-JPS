import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Product } from "@/lib/mockData";

export interface CartItem {
  product: Product;
  quantity: number;
  selectedColor?: string;
  selectedLength?: number; // In meters
}

interface CartState {
  items: CartItem[];
  isOpen: boolean;
  addItem: (item: CartItem) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  toggleCart: () => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
}

const calculateTotals = (items: CartItem[]) => {
  return {
    totalItems: items.reduce((total, item) => total + item.quantity, 0),
    totalPrice: items.reduce((total, item) => total + item.product.price * item.quantity, 0),
  };
};

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,
      totalItems: 0,
      totalPrice: 0,

      addItem: (item) => {
        set((state) => {
          const existingItemIndex = state.items.findIndex(
            (i) => i.product.id === item.product.id
          );

          let newItems;
          if (existingItemIndex > -1) {
            newItems = [...state.items];
            newItems[existingItemIndex].quantity += item.quantity;
          } else {
            newItems = [...state.items, item];
          }

          return { 
            items: newItems, 
            isOpen: true,
            ...calculateTotals(newItems)
          };
        });
      },

      removeItem: (productId) =>
        set((state) => {
          const newItems = state.items.filter((item) => item.product.id !== productId);
          return { items: newItems, ...calculateTotals(newItems) };
        }),

      updateQuantity: (productId, quantity) =>
        set((state) => {
          const newItems = state.items.map((item) =>
            item.product.id === productId ? { ...item, quantity } : item
          );
          return { items: newItems, ...calculateTotals(newItems) };
        }),

      toggleCart: () => set((state) => ({ isOpen: !state.isOpen })),

      clearCart: () => set({ items: [], totalItems: 0, totalPrice: 0 }),
    }),
    {
      name: "jps-cart-storage",
      partialize: (state) => ({ 
        items: state.items,
        totalItems: state.totalItems,
        totalPrice: state.totalPrice 
      }),
    }
  )
);
