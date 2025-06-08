"use client";

import { useSearchParams } from "next/navigation";
import ProductCard from "@/components/ProductCard";
import { useMemo } from "react";

type Product = {
  id: string;
  name: string;
  price: number;
  discountInPercent: number;
  category: string;
  class?: string;
  tag?: string;
  rating: number;
  noOfRating: number;
  imageUrl: string;
  description: string;
  fullDescription: string;
  keyFeatures: string[];
  stock: number;
  isAvailable: boolean;
  isOutOfStock: boolean;
  isLowStock: boolean;
};

interface FilteredProductsProps {
  products: Product[];
}

export default function FilteredProducts({ products }: FilteredProductsProps) {
  const searchParams = useSearchParams();

  const filteredAndSortedProducts = useMemo(() => {
    const selectedCategory = searchParams.get("category");
    const selectedClass = searchParams.get("class");
    const searchQuery = searchParams.get("search");
    const sortBy = searchParams.get("sort") || "name-asc";

    // Filter products
    const filtered = products.filter((product) => {
      const categoryMatch =
        !selectedCategory || product.category === selectedCategory;
      const classMatch = !selectedClass || product.class === selectedClass;
      const searchMatch =
        !searchQuery ||
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.category.toLowerCase().includes(searchQuery.toLowerCase());

      return categoryMatch && classMatch && searchMatch;
    });

    // Sort products
    const sorted = [...filtered].sort((a, b) => {
      switch (sortBy) {
        case "name-asc":
          return a.name.localeCompare(b.name);
        case "name-desc":
          return b.name.localeCompare(a.name);
        case "price-asc":
          return a.price - b.price;
        case "price-desc":
          return b.price - a.price;
        case "rating-desc":
          return b.rating - a.rating;
        default:
          return a.name.localeCompare(b.name);
      }
    });

    return sorted;
  }, [products, searchParams]);

  return (
    <div className="flex-1">
      <div className="mb-4">
        <p className="text-sm text-muted-foreground">
          Showing {filteredAndSortedProducts.length} product
          {filteredAndSortedProducts.length !== 1 ? "s" : ""}
        </p>
      </div>

      {filteredAndSortedProducts.length === 0 ? (
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="text-6xl mb-4">📚</div>
            <h3 className="text-lg font-semibold text-muted-foreground mb-2">
              No products found
            </h3>
            <p className="text-sm text-muted-foreground">
              Try adjusting your filters to see more results.
            </p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAndSortedProducts.map((product) => (
            <div key={product.id} className="flex justify-center">
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
