import { NextResponse } from "next/server";
import { connectDB } from "@/lib/connectDb";
import { Cart } from "@/schema";
import { auth } from "@/lib/next-auth";

// GET - Fetch current user's cart (authenticated endpoint)
export async function GET() {
  try {
    await connectDB();

    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const cart = await Cart.findOne({ user: session.user.id })
      .populate({
        path: "items.product",
        select: "name price imageGallery stock isActive discount",
      })
      .lean();

    if (!cart) {
      return NextResponse.json({
        cart: {
          items: [],
          total: 0,
          subtotal: 0,
          discount: 0,
        },
      });
    }

    // Filter out inactive products and calculate totals
    const activeItems = (cart as any).items.filter(
      (item: any) => item.product && item.product.isActive
    );

    let subtotal = 0;
    let discount = 0;

    activeItems.forEach((item: any) => {
      const itemPrice = item.product.price;
      const itemDiscount = item.product.discount || 0;
      const discountedPrice = itemPrice - (itemPrice * itemDiscount) / 100;

      subtotal += itemPrice * item.quantity;
      discount += (itemPrice - discountedPrice) * item.quantity;
    });

    const total = subtotal - discount;

    return NextResponse.json({
      cart: {
        _id: (cart as any)._id,
        items: activeItems,
        subtotal,
        discount,
        total,
        updatedAt: (cart as any).updatedAt,
      },
    });
  } catch (error) {
    console.error("Error fetching cart:", error);
    return NextResponse.json(
      { error: "Failed to fetch cart" },
      { status: 500 }
    );
  }
}
