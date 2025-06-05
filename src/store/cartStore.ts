import { toast } from "sonner";
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface Cart {
  cart: string[];
  addToCart: (id: string) => void;
  removeFromCart: (id: string) => void;
  clearCart: () => void;
}

export const MAX_ITEMS = parseInt(process.env.NEXT_PUBLIC_MAX_ITEMS || "1");
const CART_STORAGE_KEY = "cart-storage";

export const useCart = create<Cart>()(
  persist(
    (set) => ({
      cart: [],
      addToCart: (id) =>
        set((state) => {
          const itemCount = state.cart.filter((item) => item === id).length;
          if (itemCount >= MAX_ITEMS) {
            toast.warning(
              `You can only add ${MAX_ITEMS} of the same item to the cart.`
            );
            return state;
          }
          toast.success("Item added to the cart.");
          return { cart: [...state.cart, id] };
        }),
      removeFromCart: (id) =>
        set((state) => {
          const index = state.cart.findIndex((item) => item === id);
          if (index === -1) return state;
          const newCart = [...state.cart];
          newCart.splice(index, 1);
          toast.success("Item removed from the cart.");
          return { cart: newCart };
        }),
      clearCart: () => set({ cart: [] }),
    }),
    {
      name: CART_STORAGE_KEY,
    }
  )
);
