import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/connectDb";
import { Category, Product } from "@/schema";

// GET - Fetch single category by ID or slug (public endpoint)
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();

    const { id } = await params;
    const { searchParams } = new URL(req.url);
    const includeProducts = searchParams.get("includeProducts") === "true";
    const productPage = parseInt(searchParams.get("productPage") || "1");
    const productLimit = parseInt(searchParams.get("productLimit") || "12");

    // Find category by ID or slug
    const category = await Category.findOne({
      $or: [{ _id: id }, { slug: id }],
    }).lean();

    if (!category) {
      return NextResponse.json(
        { error: "Category not found" },
        { status: 404 }
      );
    }

    if (includeProducts) {
      const skip = (productPage - 1) * productLimit;
      const categoryId = (category as any)._id;

      const [products, totalProducts] = await Promise.all([
        Product.find({ category: categoryId, isActive: true })
          .select("name slug price imageGallery description.short discount")
          .sort({ createdAt: -1 })
          .skip(skip)
          .limit(productLimit)
          .lean(),
        Product.countDocuments({ category: categoryId, isActive: true }),
      ]);

      return NextResponse.json({
        category,
        products,
        pagination: {
          page: productPage,
          limit: productLimit,
          total: totalProducts,
          pages: Math.ceil(totalProducts / productLimit),
        },
      });
    }

    return NextResponse.json({ category });
  } catch (error) {
    console.error("Error fetching category:", error);
    return NextResponse.json(
      { error: "Failed to fetch category" },
      { status: 500 }
    );
  }
}
