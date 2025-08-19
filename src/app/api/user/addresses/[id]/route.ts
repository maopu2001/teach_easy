import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/connectDb";
import { Address } from "@/schema";
import { auth } from "@/lib/next-auth";
import { addressToObject } from "@/lib/mongoToObj";
import { z } from "zod";

const addressSchema = z.object({
  fullName: z.string().min(1, "Full name is required"),
  phone: z
    .string()
    .regex(
      /^(\+8801|01|\+8809)[3-9]\d{8}$/,
      "Please enter a valid Bangladeshi phone number"
    ),
  email: z.string().email("Invalid email address"),
  addressLine: z.string().min(1, "Address line is required"),
  division: z.string().min(1, "Division is required"),
  district: z.string().min(1, "District is required"),
  cityOrUpazila: z.string().min(1, "City/Upazila is required"),
  postalCode: z
    .string()
    .regex(/^[1-9]\d{3}$/, "Please enter a valid Bangladeshi postal code")
    .optional()
    .or(z.literal("")),
  alternatePhone: z
    .string()
    .regex(
      /^(\+8801|01|\+8809)[3-9]\d{8}$/,
      "Please enter a valid Bangladeshi phone number"
    )
    .optional()
    .or(z.literal("")),
  landmark: z
    .string()
    .min(1, "Landmark is required")
    .optional()
    .or(z.literal("")),
  bestTimeToDeliver: z.string().min(1, "Best time to deliver is required"),
  isDefault: z.boolean().optional(),
});

// PUT - Update address
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    await connectDB();

    const body = await request.json();
    const validatedData = addressSchema.parse(body);

    if (validatedData.isDefault) {
      await Address.updateMany(
        { user: session.user.id, isDefault: true },
        { $set: { isDefault: false } }
      );
    }

    const updatedAddress = await Address.findByIdAndUpdate(
      id,
      { ...validatedData },
      { new: true, runValidators: true }
    );

    if (!updatedAddress) {
      return NextResponse.json(
        { error: "Address not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Address updated successfully",
      address: addressToObject(updatedAddress),
    });
  } catch (error: any) {
    console.error("Error updating address:", error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation failed", details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: error.message || "Failed to update address" },
      { status: 500 }
    );
  }
}

// DELETE - Delete address
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    await connectDB();

    const deletedAddress = await Address.findByIdAndDelete(id);

    if (!deletedAddress) {
      return NextResponse.json(
        { error: "Address not found" },
        { status: 404 }
      );
    }

    const existingDefaultAddress = await Address.findOne({
      user: session.user.id,
      isDefault: true,
    });

    if (!existingDefaultAddress) {
      await Address.updateOne({ user: session.user.id }, { isDefault: true });
    }

    return NextResponse.json({
      success: true,
      message: "Address deleted successfully",
    });
  } catch (error: any) {
    console.error("Error deleting address:", error);
    return NextResponse.json(
      { error: error.message || "Failed to delete address" },
      { status: 500 }
    );
  }
}