"use client";
import {
  AddToCartButton,
  AddToWishlistButton,
  ShareButton,
} from "@/components/CustomButtons";

interface ProductActionsProps {
  productId: string;
  disabled?: boolean;
}

export default function ProductActions({
  productId,
  disabled = false,
}: ProductActionsProps) {
  return (
    <div className="flex gap-2 mb-6 h-12 text-base">
      <div className="flex-1">
        <AddToCartButton id={productId} disabled={disabled} />
      </div>
      <div className="flex-1">
        <AddToWishlistButton id={productId} />
      </div>
      <div className="w-12">
        <ShareButton />
      </div>
    </div>
  );
}
