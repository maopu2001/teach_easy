import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/connectDb";
import { Product } from "@/schema";

// GET - Search products (public endpoint)
export async function GET(req: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const query = searchParams.get("q") || "";
    const limit = parseInt(searchParams.get("limit") || "10");

    if (!query) {
      return NextResponse.json({ products: [] });
    }

    const products = await Product.find({
      isActive: true,
      $or: [
        { name: { $regex: query, $options: "i" } },
        { "description.short": { $regex: query, $options: "i" } },
        { category: { $regex: query, $options: "i" } },
      ],
    })
      .select("name slug price imageGallery category")
      .limit(limit)
      .lean();

    return NextResponse.json({ products });
  } catch (error) {
    console.error("Error searching products:", error);
    return NextResponse.json(
      { error: "Failed to search products" },
      { status: 500 }
    );
  }
}
