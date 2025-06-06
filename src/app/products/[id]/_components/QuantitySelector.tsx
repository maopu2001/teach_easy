"use client";
import { Button } from "@/components/ui/button";
import { useCart } from "@/store/cartStore";
import { MAX_ITEMS } from "@/store/cartStore";

interface QuantitySelectorProps {
  productId: string;
  disabled?: boolean;
  maxStock?: number;
}

export default function QuantitySelector({
  productId,
  disabled = false,
  maxStock = MAX_ITEMS,
}: QuantitySelectorProps) {
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
          disabled={disabled || itemQuantity <= 0}
          aria-label="Decrease quantity"
        >
          -
        </Button>
        <span className="w-6 text-center select-none">{itemQuantity}</span>
        <Button
          variant="outline"
          size="icon"
          className="h-7 w-7 px-0"
          disabled={disabled || itemQuantity >= Math.min(MAX_ITEMS, maxStock)}
          onClick={() => addToCart(productId)}
          aria-label="Increase quantity"
        >
          +
        </Button>
      </div>
      {disabled && (
        <span className="text-sm text-muted-foreground ml-2">
          (Out of stock)
        </span>
      )}
      {!disabled && itemQuantity >= maxStock && maxStock < MAX_ITEMS && (
        <span className="text-sm text-orange-600 ml-2">
          (Max stock: {maxStock})
        </span>
      )}
    </div>
  );
}
