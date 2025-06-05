"use client";
import { Button } from "@/components/ui/button";
import { Share2 } from "lucide-react";
import {
  AddToCartButton,
  AddToWishlistButton,
} from "@/components/CustomButtons";

interface ProductActionsProps {
  productId: string;
}

export default function ProductActions({ productId }: ProductActionsProps) {
  return (
    <div className="flex gap-2 mb-6 h-12 text-base">
      <div className="flex-1">
        <AddToCartButton id={productId} />
      </div>
      <div className="flex-1">
        <AddToWishlistButton id={productId} />
      </div>
      <Button variant="outline" className="h-full w-12 p-0">
        <Share2 className="w-5 h-5" />
      </Button>
    </div>
  );
}
