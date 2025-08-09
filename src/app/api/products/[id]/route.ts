import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/connectDb";
import { Product } from "@/schema";

// GET - Fetch single product by ID (public endpoint)
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await connectDB();

    const product = await Product.findOne({
      _id: id,
      isActive: true,
    }).lean();

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    // Transform MongoDB document to expected structure
    const transformedProduct = {
      id: (product as any)._id.toString(),
      name: (product as any).name,
      slug: (product as any).slug,
      price: (product as any).price,
      discountInPercent: (product as any).discount || 0,
      category: (product as any).category,
      class: (product as any).educationLevel,
      tag: (product as any).tag,
      rating: (product as any).rating?.average || 0,
      noOfRating: (product as any).rating?.count || 0,
      imageUrl: (product as any).imageGallery?.[0]?.url || "",
      imageGallery: (product as any).imageGallery || [],
      description: (product as any).description?.short || "",
      fullDescription: (product as any).description?.full || "",
      keyFeatures: (product as any).keyFeatures || [],
      specifications: (product as any).specifications || [],
      stock: (product as any).stock,
      isAvailable: (product as any).isActive,
      isOutOfStock: (product as any).stock <= 0,
      isLowStock: (product as any).stock > 0 && (product as any).stock <= 5,
      brand: (product as any).brand,
      sku: (product as any).sku,
      weight: (product as any).weight,
      dimensions: (product as any).dimensions,
      tags: (product as any).tags || [],
      seoMeta: (product as any).seoMeta,
      createdAt: (product as any).createdAt,
      updatedAt: (product as any).updatedAt,
    };

    return NextResponse.json({ product: transformedProduct });
  } catch (error) {
    console.error("Error fetching product:", error);
    return NextResponse.json(
      { error: "Failed to fetch product" },
      { status: 500 }
    );
  }
}
