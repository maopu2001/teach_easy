import ProductFilter from "@/app/products/_components/ProductFilter";
import FilteredProducts from "@/app/products/_components/FilteredProducts";
import MobileFilter from "@/app/products/_components/MobileFilter";
import { products } from "@/lib/testProducts";
import { Suspense } from "react";

const ProductsPage = () => {
  const categories = Array.from(
    new Set(products.map((product) => product.category))
  );
  const classes = Array.from(
    new Set(products.map((product) => product.class).filter(Boolean))
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

      <Suspense
        fallback={
          <div className="h-10 w-20 bg-muted animate-pulse rounded lg:hidden mb-4" />
        }
      >
        <MobileFilter categories={categories} classes={classes} />
      </Suspense>

      <div className="flex gap-6">
        <div className="hidden lg:block">
          <Suspense
            fallback={
              <div className="w-64 h-96 bg-muted animate-pulse rounded-lg" />
            }
          >
            <ProductFilter categories={categories} classes={classes} />
          </Suspense>
        </div>

        <Suspense
          fallback={
            <div className="flex-1">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {Array.from({ length: 8 }).map((_, i) => (
                  <div
                    key={i}
                    className="w-80 h-96 bg-muted animate-pulse rounded-lg"
                  />
                ))}
              </div>
            </div>
          }
        >
          <FilteredProducts products={products} />
        </Suspense>
      </div>
    </div>
  );
};

export default ProductsPage;
