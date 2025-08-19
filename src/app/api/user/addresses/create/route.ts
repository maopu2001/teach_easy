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

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    const body = await request.json();
    const validatedData = addressSchema.parse(body);

    if (validatedData.isDefault) {
      await Address.updateMany(
        { user: session.user.id, isDefault: true },
        { $set: { isDefault: false } }
      );
    }

    const existingAddress = await Address.findOne({ user: session.user.id });

    const newAddress = new Address({
      user: session.user.id,
      ...validatedData,
      isDefault: existingAddress ? validatedData.isDefault : true,
    });

    await newAddress.save();

    return NextResponse.json({
      success: true,
      message: "Address added successfully",
      address: addressToObject(newAddress),
    });
  } catch (error: any) {
    console.error("Error adding address:", error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation failed", details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: error.message || "Failed to add address" },
      { status: 500 }
    );
  }
}