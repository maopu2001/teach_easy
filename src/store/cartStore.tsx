import { toast } from "sonner";
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface Cart {
  cart: string[];
  addToCart: (id: string) => void;
  removeFromCart: (id: string) => void;
  clearCart: () => void;
}

const MAX_ITEMS = 5;
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
          return { cart: [...state.cart, id] };
        }),
      removeFromCart: (id) =>
        set((state) => ({
          cart: state.cart.filter((item) => item !== id),
        })),
      clearCart: () => set({ cart: [] }),
    }),
    {
      name: CART_STORAGE_KEY,
    }
  )
);
