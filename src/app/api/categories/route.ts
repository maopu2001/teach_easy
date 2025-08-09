import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/connectDb";
import { Category } from "@/schema";

// GET - Fetch all categories (public endpoint)
export async function GET(req: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const includeProductCount =
      searchParams.get("includeProductCount") === "true";

    let categories;

    if (includeProductCount) {
      // Aggregate to include product counts
      categories = await Category.aggregate([
        {
          $lookup: {
            from: "products",
            localField: "_id",
            foreignField: "category",
            as: "products",
          },
        },
        {
          $addFields: {
            productCount: {
              $size: {
                $filter: {
                  input: "$products",
                  as: "product",
                  cond: { $eq: ["$$product.isActive", true] },
                },
              },
            },
          },
        },
        {
          $project: {
            products: 0,
          },
        },
        {
          $sort: { name: 1 },
        },
      ]);
    } else {
      // Simple category fetch
      categories = await Category.find({})
        .select("name slug description imageUrl")
        .sort({ name: 1 })
        .lean();
    }

    return NextResponse.json({ categories });
  } catch (error) {
    console.error("Error fetching categories:", error);
    return NextResponse.json(
      { error: "Failed to fetch categories" },
      { status: 500 }
    );
  }
}
