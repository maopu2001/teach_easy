"use server";

import { z } from "zod";
import { auth } from "@/lib/next-auth";
import { connectDB } from "@/lib/connectDb";
import { Order } from "@/schema";
import { revalidatePath } from "next/cache";

// Types for the action results
interface ActionResult {
  success: boolean;
  data?: any;
  message?: string;
  errors?: Record<string, string[] | undefined>;
}

// Zod schema for order update validation
const updateOrderSchema = z.object({
  status: z.string().optional(),
  trackingNumber: z.string().optional(),
  adminNotes: z.string().optional(),
});

type UpdateOrderData = z.infer<typeof updateOrderSchema>;

/**
 * Update order status and details
 */
export async function updateOrder(
  orderId: string,
  data: UpdateOrderData
): Promise<ActionResult> {
  try {
    // Validate input data
    const validatedData = updateOrderSchema.parse(data);

    // Check authentication
    const session = await auth();
    if (!session?.user || session.user.role !== "admin") {
      return {
        success: false,
        message: "Unauthorized access",
      };
    }

    // Connect to database
    await connectDB();

    // Prepare update data
    const updateData: any = {};
    if (validatedData.status) updateData.status = validatedData.status;
    if (validatedData.trackingNumber)
      updateData.trackingNumber = validatedData.trackingNumber;
    if (validatedData.adminNotes)
      updateData.adminNotes = validatedData.adminNotes;

    // Add status history entry if status is being updated
    if (validatedData.status) {
      updateData.$push = {
        statusHistory: {
          status: validatedData.status,
          timestamp: new Date(),
          updatedBy: session.user.id,
          notes: validatedData.adminNotes,
        },
      };
    }

    // Update the order
    const updatedOrder = await Order.findByIdAndUpdate(orderId, updateData, {
      new: true,
      runValidators: true,
    })
      .populate("user", "fullName email")
      .populate("shippingAddress")
      .populate("billingAddress")
      .populate("items.product", "name price imageGallery");

    if (!updatedOrder) {
      return {
        success: false,
        message: "Order not found",
      };
    }

    // Revalidate the orders pages
    revalidatePath("/admin/dashboard/orders");
    revalidatePath(`/admin/dashboard/orders/${orderId}`);

    return {
      success: true,
      data: updatedOrder,
      message: "Order updated successfully",
    };
  } catch (error) {
    console.error("Error updating order:", error);

    if (error instanceof z.ZodError) {
      return {
        success: false,
        message: "Invalid data provided",
        errors: error.flatten().fieldErrors,
      };
    }

    return {
      success: false,
      message: "Failed to update order",
    };
  }
}
