import {
  Breadcrumb,
  RelatedProducts,
  ProductClientWrapper,
} from "@/app/products/[id]/_components";
import ProductTabs from "@/app/products/[id]/_components/ProductTabs";
import { notFound } from "next/navigation";

const ProductPage = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;

  // Fetch product from API
  const productResponse = await fetch(
    `${
      process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"
    }/api/products/${id}`,
    {
      cache: "no-store",
    }
  );

  if (!productResponse.ok) {
    notFound();
  }

  const { product } = await productResponse.json();

  // Fetch related products from API
  const relatedResponse = await fetch(
    `${
      process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"
    }/api/products/${id}/related?limit=4`,
    {
      cache: "no-store",
    }
  );

  let relatedProducts = [];
  if (relatedResponse.ok) {
    const relatedData = await relatedResponse.json();
    relatedProducts = relatedData.products;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <Breadcrumb product={product} />
      <ProductClientWrapper
        product={product}
        keyFeatures={product.keyFeatures || []}
      />
      <ProductTabs product={product} keyFeatures={product.keyFeatures || []} />
      <RelatedProducts products={relatedProducts} />
    </div>
  );
};

export default ProductPage;
