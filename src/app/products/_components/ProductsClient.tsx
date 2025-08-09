"use client";

import { useState, useEffect } from "react";
import ProductFilter from "./ProductFilter";
import FilteredProducts from "./FilteredProducts";
import MobileFilter from "./MobileFilter";

const ProductsClient = () => {
  const [categories, setCategories] = useState<string[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch categories
        const categoriesResponse = await fetch("/api/categories");
        const categoriesData = await categoriesResponse.json();

        // Fetch products
        const productsResponse = await fetch("/api/products?limit=100");
        const productsData = await productsResponse.json();

        if (categoriesResponse.ok && categoriesData.categories) {
          setCategories(categoriesData.categories.map((cat: any) => cat.name));
        }

        if (productsResponse.ok && productsData.products) {
          setProducts(productsData.products);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="container mx-auto p-4">
        <div className="mb-6">
          <div className="h-8 w-64 bg-muted animate-pulse rounded mb-2" />
          <div className="h-4 w-96 bg-muted animate-pulse rounded" />
        </div>
        <div className="flex gap-6">
          <div className="hidden lg:block w-64 h-96 bg-muted animate-pulse rounded-lg" />
          <div className="flex-1">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 8 }).map((_, i) => (
                <div
                  key={i}
                  className="w-full h-96 bg-muted animate-pulse rounded-lg"
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Extract unique classes from products (if this field exists)
  const classes = Array.from(
    new Set(products.map((product: any) => product.class).filter(Boolean))
  ) as string[];

  return (
    <div className="container mx-auto p-4">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Educational Products</h1>
        <p className="text-muted-foreground">
          Discover our comprehensive collection of educational materials and
          supplies
        </p>
      </div>

      <MobileFilter categories={categories} classes={classes} />

      <div className="flex gap-6">
        <div className="hidden lg:block">
          <ProductFilter categories={categories} classes={classes} />
        </div>

        <div className="flex-1">
          <FilteredProducts products={products} />
        </div>
      </div>
    </div>
  );
};

export default ProductsClient;
