import ProductCard from "@/components/ProductCard";
import { products } from "@/lib/testProducts";

const ProductsPage = () => {
  return (
    <div className="container mx-auto p-4">
      {/* <h1>Products</h1>
      <p>Explore our range of products.</p> */}
      <div className="flex gap-4 flex-wrap justify-center sm:justify-start">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
};

export default ProductsPage;
