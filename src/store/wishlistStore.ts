import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Product } from "@/lib/mockData";

interface WishlistState {
  items: Product[];
  addItem: (product: Product) => void;
  removeItem: (productId: string) => void;
  toggleItem: (product: Product) => void;
  isInWishlist: (productId: string) => boolean;
  setWishlist: (items: Product[]) => void;
  clearWishlist: () => void;
}

export const useWishlistStore = create<WishlistState>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (product) => {
        const { items } = get();
        if (!items.find((item) => item.id === product.id)) {
          set({ items: [...items, product] });
        }
      },

      removeItem: (productId) => {
        set((state) => ({
          items: state.items.filter((item) => item.id !== productId),
        }));
      },

      toggleItem: (product) => {
        const { items, addItem, removeItem } = get();
        const exists = items.find((item) => item.id === product.id);
        if (exists) {
          removeItem(product.id);
        } else {
          addItem(product);
        }
      },

      isInWishlist: (productId) => {
        return get().items.some((item) => item.id === productId);
      },

      setWishlist: (items) => set({ items }),

      clearWishlist: () => set({ items: [] }),
    }),
    {
      name: "jps-wishlist-storage",
    }
  )
);
