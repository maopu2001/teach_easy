import config from "@/lib/config";
import { toast } from "sonner";
import { create } from "zustand";
import { persist, subscribeWithSelector } from "zustand/middleware";

interface Cart {
  cart: string[];
  _hasHydrated: boolean;
  addToCart: (id: string) => void;
  removeFromCart: (id: string) => void;
  clearCart: () => void;
  setHasHydrated: (hasHydrated: boolean) => void;
}

export const useCart = create<Cart>()(
  subscribeWithSelector(
    persist(
      (set) => ({
        cart: [],
        _hasHydrated: false,
        addToCart: (id) =>
          set((state) => {
            const itemCount = state.cart.filter((item) => item === id).length;
            if (itemCount >= config.app.maxItems) {
              toast.warning(
                `You can only add ${config.app.maxItems} of the same item to the cart.`
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
        setHasHydrated: (hasHydrated) => set({ _hasHydrated: hasHydrated }),
      }),
      {
        name: "cart-storage",
        onRehydrateStorage: () => (state) => {
          state?.setHasHydrated(true);
        },
      }
    )
  )
);
