import ProductCard from "@/components/ProductCard";

const products = [
  {
    id: "1",
    name: "Product 1",
    price: 3000,
    discountInPercent: 0,
    rating: 3,
    imageUrl: "/95443.png",
    category: "Category 1",
  },
  {
    id: "2",
    name: "long name of the product that is very long",
    price: 4000,
    discountInPercent: 90,
    rating: 4,
    imageUrl: "/95443.png",
    category: "Category 2",
  },
];

const ProductsPage = () => {
  return (
    <div className="container mx-auto p-4">
      {/* <h1>Products</h1>
      <p>Explore our range of products.</p> */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
};

export default ProductsPage;
