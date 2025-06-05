import { products } from "@/lib/testProducts";
import {
  Breadcrumb,
  RelatedProducts,
  ProductClientWrapper,
} from "@/app/products/[id]/_components";
import ProductTabs from "@/app/products/[id]/_components/ProductTabs";

const ProductPage = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;
  const product = products.find((p) => p.id === id) || products[0];

  // For demo, related products are all except the current one
  const relatedProducts = products.filter((p) => p.id !== product.id);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <Breadcrumb product={product} />
      <ProductClientWrapper
        product={product}
        keyFeatures={product.keyFeatures}
      />
      <ProductTabs product={product} keyFeatures={product.keyFeatures} />
      <RelatedProducts products={relatedProducts} />
    </div>
  );
};

export default ProductPage;
