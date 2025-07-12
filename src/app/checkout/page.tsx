"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useCart } from "@/store/cartStore";
import { Button } from "@/components/ui/button";
import { ShoppingCart } from "lucide-react";
import { toast } from "sonner";

import { CheckoutForm } from "./_components/CheckoutForm";

export default function CheckoutPage() {
  const { status } = useSession();
  const { cart, _hasHydrated } = useCart();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!_hasHydrated) return;

    if (cart.length === 0) {
      console.log("Cart is empty:", cart);
      toast.error("Your cart is empty. Please add items to checkout.");
      router.push("/products");
      return;
    }

    setIsLoading(false);
  }, [cart, status, router, _hasHydrated]);

  if (isLoading || status === "loading" || !_hasHydrated) {
    return;
  }

  if (cart.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <ShoppingCart className="mx-auto h-24 w-24 text-gray-400 mb-4" />
          <h2 className="text-2xl font-bold mb-2">Your cart is empty</h2>
          <p className="text-gray-600 mb-6">
            Add some items to your cart to proceed with checkout.
          </p>
          <Button onClick={() => router.push("/products")}>
            Continue Shopping
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Checkout</h1>
        <p className="text-gray-600">Complete your purchase</p>
      </div>

      <div className="space-y-6">
        <CheckoutForm />
      </div>
    </div>
  );
}
