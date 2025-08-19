import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/lib/next-auth";
import { connectDB } from "@/lib/connectDb";
import { Order } from "@/schema";

// Zod schema for order update validation
const updateOrderSchema = z.object({
  status: z.string().optional(),
  trackingNumber: z.string().optional(),
  adminNotes: z.string().optional(),
});

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    
    // Validate input data
    const validatedData = updateOrderSchema.parse(body);

    // Check authentication
    const session = await auth();
    if (!session?.user || session.user.role !== "admin") {
      return NextResponse.json(
        { error: "Unauthorized access" },
        { status: 401 }
      );
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
    const updatedOrder = await Order.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    })
      .populate("user", "fullName email")
      .populate("shippingAddress")
      .populate("billingAddress")
      .populate("items.product", "name price imageGallery");

    if (!updatedOrder) {
      return NextResponse.json(
        { error: "Order not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: updatedOrder,
      message: "Order updated successfully",
    });
  } catch (error) {
    console.error("Error updating order:", error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid data provided", details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Failed to update order" },
      { status: 500 }
    );
  }
}