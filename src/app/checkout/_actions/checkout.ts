"use server";

import { z } from "zod";
import { checkoutSchema } from "@/app/checkout/_actions/checkout-schemas";
import { auth } from "@/lib/next-auth";
import { redirect } from "next/navigation";
import { Address } from "@/schema";
import { connectDB } from "@/lib/connectDb";
import { addressToObject } from "@/lib/mongoToObj";
import { revalidatePath } from "next/cache";

// User checkout action
export async function processUserCheckout(
  data: z.infer<typeof checkoutSchema>,
  selectedAddressId?: string,
  selectedPaymentId?: string
) {
  try {
    // Get authenticated user
    const session = await auth();
    if (!session?.user) {
      redirect("/auth/login?redirect=/checkout");
    }

    // Validate the input data
    const validatedData = checkoutSchema.parse(data);

    // TODO: Implement user checkout logic
    // 1. Create order record with user ID
    // 2. Save address if new
    // 3. Save payment method if new
    // 4. Process payment
    // 5. Send confirmation email
    // 6. Update inventory
    // 7. Add to user's order history

    console.log("Processing user checkout:", {
      userId: session.user.id,
      data: validatedData,
      selectedAddressId,
      selectedPaymentId,
    });

    // Simulate processing time
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Return success response
    return {
      success: true,
      message:
        "Order placed successfully! You can track your order in your profile.",
      orderId: `user-order-${Date.now()}`,
    };
  } catch (error) {
    console.error("User checkout error:", error);

    if (error instanceof z.ZodError) {
      return {
        success: false,
        message: "Please check your form data and try again.",
        errors: error.errors,
      };
    }

    return {
      success: false,
      message:
        "An error occurred while processing your order. Please try again.",
    };
  }
}

// Apply coupon action
export async function applyCoupon(code: string) {
  try {
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
      return {
        success: false,
        message: "Invalid coupon code. Please try again.",
      };
    }

    return {
      success: true,
      message: `Coupon applied! You saved ${
        coupon.type === "percentage"
          ? `${coupon.discount * 100}%`
          : `$${coupon.discount}`
      }`,
      discount: coupon.discount,
      type: coupon.type,
    };
  } catch (error) {
    console.error("Coupon application error:", error);
    return {
      success: false,
      message: "An error occurred while applying the coupon. Please try again.",
    };
  }
}

export async function addNewAddress(addressData: any) {
  try {
    const session = await auth();
    if (!session?.user)
      return { success: false, message: "User not authenticated" };

    await connectDB();

    if (addressData.isDefault)
      await Address.updateMany(
        { user: session.user.id, isDefault: true },
        { $set: { isDefault: false } }
      );

    const existingAddress = await Address.findOne({ user: session.user.id });

    const newAddress = new Address({
      user: session.user.id,
      ...addressData,
      isDefault: existingAddress ? addressData.isDefault : true,
    });

    await newAddress.save();

    revalidatePath("/checkout");

    return {
      success: true,
      message: "Address added successfully",
      address: addressToObject(newAddress),
    };
  } catch (error: any) {
    console.error("Error adding address:", error);
    return {
      success: false,
      message: error.message || "Failed to add address",
    };
  }
}
