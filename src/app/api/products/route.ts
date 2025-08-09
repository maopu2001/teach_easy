import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/connectDb";
import { Product } from "@/schema";

// GET - Fetch all products (public endpoint)
export async function GET(req: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "12");
    const search = searchParams.get("search") || "";
    const category = searchParams.get("category") || "";
    const minPrice = parseInt(searchParams.get("minPrice") || "0");
    const maxPrice = parseInt(searchParams.get("maxPrice") || "999999");
    const sortBy = searchParams.get("sortBy") || "createdAt";
    const sortOrder = searchParams.get("sortOrder") || "desc";

    const skip = (page - 1) * limit;

    // Build query
    const query: any = { isActive: true };

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { "description.short": { $regex: search, $options: "i" } },
      ];
    }

    if (category) {
      query.category = category;
    }

    query.price = { $gte: minPrice, $lte: maxPrice };

    // Build sort object
    const sort: any = {};
    sort[sortBy] = sortOrder === "desc" ? -1 : 1;

    const [products, total] = await Promise.all([
      Product.find(query)
        .select("-description.full")
        .sort(sort)
        .skip(skip)
        .limit(limit)
        .lean(),
      Product.countDocuments(query),
    ]);

    // Transform MongoDB documents to have proper id field and expected structure
    const transformedProducts = products.map((product: any) => ({
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

    return NextResponse.json({
      products: transformedProducts,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching products:", error);
    return NextResponse.json(
      { error: "Failed to fetch products" },
      { status: 500 }
    );
  }
}
