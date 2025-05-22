import { toast } from "sonner";
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface Wishlist {
  items: string[];
  addToWishlist: (id: string) => void;
  removeFromWishlist: (id: string) => void;
  clearWishlist: () => void;
}

const WISHLIST_STORAGE_KEY = "wishlist-storage";

export const useWishlist = create<Wishlist>()(
  persist(
    (set) => ({
      items: [],
      addToWishlist: (id) =>
        set((state) => {
          if (state.items.includes(id)) {
            toast.warning("Item is already in the wishlist.");
            return state;
          }
          return { items: [...state.items, id] };
        }),
      removeFromWishlist: (id) =>
        set((state) => ({
          items: state.items.filter((item) => item !== id),
        })),
      clearWishlist: () => set({ items: [] }),
    }),
    {
      name: WISHLIST_STORAGE_KEY,
    }
  )
);
