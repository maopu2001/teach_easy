import ProductCard from "@/components/ProductCard";

const products = [
  {
    id: 1,
    name: "Product 1",
    price: 3000,
    imageUrl: "https://placehold.co/400x400/png",
    category: "Category 1",
    stock: 100,
    rating: {
      rate: 4.5,
      count: 10,
    },
    description: "Description of Product 1",
  },
  {
    id: 2,
    name: "Product 2",
    price: 4000,
    imageUrl: "https://placehold.co/400x400/png",
    category: "Category 2",
    stock: 50,
    rating: {
      rate: 4.0,
      count: 5,
    },
    description: "Description of Product 2",
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
