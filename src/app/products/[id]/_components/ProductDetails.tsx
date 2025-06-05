"use client";
import ProductInfo from "./ProductInfo";
import QuantitySelector from "./QuantitySelector";
import ProductActions from "./ProductActions";
import ProductInfoSection from "./ProductInfoSection";
import { Product } from "./ProductClientWrapper";

interface ProductDetailsProps {
  product: Product;
  keyFeatures: string[];
}

export default function ProductDetails({
  product,
  keyFeatures,
}: ProductDetailsProps) {
  return (
    <div className="flex-1 max-w-2xl">
      <ProductInfo product={product} keyFeatures={keyFeatures} />
      <QuantitySelector productId={product.id} />
      <ProductActions productId={product.id} />
      <ProductInfoSection />
    </div>
  );
}
