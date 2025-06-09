"use client";

import { Button } from "@/components/ui/button";

interface OrderActionButtonsProps {
  onBack: () => void;
  onPlaceOrder: () => void;
  isPlacingOrder: boolean;
}

export default function OrderActionButtons({
  onBack,
  onPlaceOrder,
  isPlacingOrder,
}: OrderActionButtonsProps) {
  return (
    <div className="flex justify-between pt-4">
      <Button type="button" variant="outline" onClick={onBack}>
        Back to Payment
      </Button>
      <Button onClick={onPlaceOrder} className="px-8" disabled={isPlacingOrder}>
        {isPlacingOrder ? (
          <>
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
            Processing...
          </>
        ) : (
          "Place Order"
        )}
      </Button>
    </div>
  );
}
