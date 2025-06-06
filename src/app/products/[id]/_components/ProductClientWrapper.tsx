"use client";
import {
  ProductImageGallery,
  ProductDetails,
} from "@/app/products/[id]/_components";

export type Product = {
  id: string;
  name: string;
  price: number;
  discountInPercent: number;
  rating: number;
  noOfRating: number;
  category: string;
  class?: string;
  tag?: string;
  imageUrl: string;
  description: string;
  fullDescription: string;
  stock: number;
  isAvailable: boolean;
  isOutOfStock: boolean;
  isLowStock: boolean;
};

interface ProductClientWrapperProps {
  product: Product;
  keyFeatures: string[];
}

export default function ProductClientWrapper({
  product,
  keyFeatures,
}: ProductClientWrapperProps) {
  return (
    <div className="flex flex-col md:flex-row gap-8">
      <ProductImageGallery product={product} />
      <ProductDetails product={product} keyFeatures={keyFeatures} />
    </div>
  );
}
