"use client";
import { Button } from "@/components/ui/button";
import { useCart } from "@/store/cartStore";
import { MAX_ITEMS } from "@/store/cartStore";

interface QuantitySelectorProps {
  productId: string;
}

export default function QuantitySelector({ productId }: QuantitySelectorProps) {
  const { cart, addToCart, removeFromCart } = useCart();
  const itemQuantity = cart.filter((item) => item === productId).length;

  return (
    <div className="flex items-center gap-2 mb-4">
      <span className="font-medium">Quantity:</span>
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="icon"
          className="h-7 w-7 px-0"
          onClick={() => removeFromCart(productId)}
          disabled={itemQuantity <= 0}
          aria-label="Decrease quantity"
        >
          -
        </Button>
        <span className="w-6 text-center select-none">{itemQuantity}</span>
        <Button
          variant="outline"
          size="icon"
          className="h-7 w-7 px-0"
          disabled={itemQuantity >= MAX_ITEMS}
          onClick={() => addToCart(productId)}
          aria-label="Increase quantity"
        >
          +
        </Button>
      </div>
    </div>
  );
}
