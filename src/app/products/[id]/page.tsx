type ProductPageParams = { params: Promise<{ id: string }> };

const ProductPage = async ({ params }: ProductPageParams) => {
  const { id } = await params;
  return <div>My Product: {id}</div>;
};

export default ProductPage;
