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

      <div className="mb-4">
        {product.isOutOfStock ? (
          <div className="bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 rounded-lg p-3">
            <p className="text-red-600 dark:text-red-400 font-medium">
              ❌ Out of Stock
            </p>
            <p className="text-sm text-primary dark:text-red-400 mt-1">
              This item is currently unavailable
            </p>
          </div>
        ) : product.isLowStock ? (
          <div className="bg-orange-50 dark:bg-orange-950/30 border border-orange-200 dark:border-orange-800 rounded-lg p-3">
            <p className="text-orange-600 dark:text-orange-400 font-medium">
              ⚠️ Only {product.stock} left in stock!
            </p>
            <p className="text-sm text-orange-500 dark:text-orange-400 mt-1">
              Order soon to secure your item
            </p>
          </div>
        ) : (
          <div className="bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800 rounded-lg p-3">
            <p className="text-green-600 dark:text-green-400 font-medium">
              ✅ In Stock ({product.stock} available)
            </p>
          </div>
        )}
      </div>

      <QuantitySelector
        productId={product.id}
        disabled={product.isOutOfStock}
        maxStock={product.stock}
      />
      <ProductActions productId={product.id} disabled={product.isOutOfStock} />
      <ProductInfoSection />
    </div>
  );
}
