import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/connectDb";
import { Order } from "@/schema";
import { auth } from "@/lib/next-auth";

// GET - Fetch single user order (authenticated endpoint)
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();

    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    const order = await Order.findOne({
      _id: id,
      user: session.user.id,
    })
      .populate("items.product", "name price imageGallery")
      .populate("shippingAddress")
      .populate("billingAddress")
      .lean();

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    return NextResponse.json({ order });
  } catch (error) {
    console.error("Error fetching order:", error);
    return NextResponse.json(
      { error: "Failed to fetch order" },
      { status: 500 }
    );
  }
}
