import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const couponSchema = z.object({
  code: z.string().min(1, "Coupon code is required"),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { code } = couponSchema.parse(body);

    // Simulate coupon validation
    await new Promise((resolve) => setTimeout(resolve, 500));

    // Mock coupon validation
    const validCoupons = {
      SAVE10: { discount: 0.1, type: "percentage" },
      WELCOME20: { discount: 0.2, type: "percentage" },
      FLAT50: { discount: 50, type: "fixed" },
    };

    const coupon =
      validCoupons[code.toUpperCase() as keyof typeof validCoupons];

    if (!coupon) {
      return NextResponse.json(
        { error: "Invalid coupon code. Please try again." },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      message: `Coupon applied! You saved ${
        coupon.type === "percentage"
          ? `${coupon.discount * 100}%`
          : `$${coupon.discount}`
      }`,
      discount: coupon.discount,
      type: coupon.type,
    });
  } catch (error) {
    console.error("Coupon application error:", error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid coupon code" },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "An error occurred while applying the coupon. Please try again." },
      { status: 500 }
    );
  }
}