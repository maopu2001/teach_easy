import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/connectDb";
import { Product } from "@/schema";

// GET - Fetch related products by category (public endpoint)
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { searchParams } = new URL(req.url);
    const limit = parseInt(searchParams.get("limit") || "4");

    await connectDB();

    // First get the current product to know its category
    const currentProduct = await Product.findOne({
      _id: id,
      isActive: true,
    })
      .select("category")
      .lean();

    if (!currentProduct) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    // Fetch related products (same category, excluding current product)
    const relatedProducts = await Product.find({
      category: (currentProduct as any).category,
      _id: { $ne: id },
      isActive: true,
    })
      .limit(limit)
      .lean();

    // Transform MongoDB documents to expected structure
    const transformedProducts = relatedProducts.map((product: any) => ({
      id: product._id.toString(),
      name: product.name,
      price: product.price,
      discountInPercent: product.discount || 0,
      category: product.category,
      class: product.educationLevel,
      tag: product.tag,
      rating: product.rating?.average || 0,
      noOfRating: product.rating?.count || 0,
      imageUrl: product.imageGallery?.[0]?.url || "",
      description: product.description?.short || "",
      fullDescription: product.description?.full || "",
      keyFeatures: product.keyFeatures || [],
      stock: product.stock,
      isAvailable: product.isActive,
      isOutOfStock: product.stock <= 0,
      isLowStock: product.stock > 0 && product.stock <= 5,
    }));

    return NextResponse.json({ products: transformedProducts });
  } catch (error) {
    console.error("Error fetching related products:", error);
    return NextResponse.json(
      { error: "Failed to fetch related products" },
      { status: 500 }
    );
  }
}
