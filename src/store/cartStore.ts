import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Product } from "@/lib/mockData";

export interface CartItem {
  product: Product;
  quantity: number;
  selectedVariant?: any; // The full variant document
}

interface CartState {
  items: CartItem[];
  isOpen: boolean;
  addItem: (item: CartItem) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  setCart: (items: CartItem[]) => void;
  toggleCart: () => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
}

const calculateTotals = (items: CartItem[]) => {
  return {
    totalItems: items.reduce((total, item) => total + item.quantity, 0),
    totalPrice: items.reduce((total, item) => {
      const price = item.selectedVariant ? item.selectedVariant.price : item.product.price;
      return total + price * item.quantity;
    }, 0),
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
            (i) => i.product.id === item.product.id && (i.selectedVariant?.id === item.selectedVariant?.id)
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

      removeItem: (skuId) =>
        set((state) => {
          const newItems = state.items.filter((item) => (item.selectedVariant ? item.selectedVariant.sku : item.product.id) !== skuId);
          return { items: newItems, ...calculateTotals(newItems) };
        }),

      updateQuantity: (skuId, quantity) =>
        set((state) => {
          const newItems = state.items.map((item) =>
            (item.selectedVariant ? item.selectedVariant.sku : item.product.id) === skuId ? { ...item, quantity } : item
          );
          return { items: newItems, ...calculateTotals(newItems) };
        }),

      setCart: (items) => set({ items, ...calculateTotals(items) }),

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
