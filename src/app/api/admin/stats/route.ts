import { NextResponse } from "next/server";
import { connectDB } from "@/lib/connectDb";
import { Product, Order, User } from "@/schema";
import { auth } from "@/lib/next-auth";

// GET - Fetch dashboard statistics
export async function GET() {
  try {
    await connectDB();

    const session = await auth();
    if (!session?.user || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get counts and revenue in parallel
    const [totalProducts, totalOrders, totalUsers, revenueData] =
      await Promise.all([
        Product.countDocuments({ isActive: true }),
        Order.countDocuments(),
        User.countDocuments(),
        Order.aggregate([
          { $match: { status: { $in: ["completed", "delivered"] } } },
          { $group: { _id: null, total: { $sum: "$total" } } },
        ]),
      ]);

    const totalRevenue = revenueData[0]?.total || 0;

    return NextResponse.json({
      totalProducts,
      totalOrders,
      totalUsers,
      totalRevenue,
    });
  } catch (error) {
    console.error("Error fetching dashboard stats:", error);
    return NextResponse.json(
      { error: "Failed to fetch dashboard stats" },
      { status: 500 }
    );
  }
}
