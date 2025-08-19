import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/connectDb";
import { User } from "@/schema";
import { auth } from "@/lib/next-auth";
import { z } from "zod";

const profileSchema = z.object({
  fullName: z.string().min(2, "Full name must be at least 2 characters"),
  phone: z.string().optional(),
  dateOfBirth: z.string().optional(),
  gender: z.enum(["male", "female", "other", "prefer_not_to_say"]).optional(),
  bio: z.string().max(500, "Bio must be less than 500 characters").optional(),
});

const preferencesSchema = z.object({
  notifications: z.object({
    email: z.boolean(),
    sms: z.boolean(),
    push: z.boolean(),
    marketing: z.boolean(),
  }),
  newsletter: z.boolean(),
});

export async function PUT(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    const body = await request.json();
    const { type, ...data } = body;

    if (type === "profile") {
      const validatedData = profileSchema.parse(data);

      const updateData: any = {
        fullName: validatedData.fullName,
        bio: validatedData.bio,
      };

      if (validatedData.phone) updateData.phone = validatedData.phone;
      if (validatedData.dateOfBirth) updateData.dateOfBirth = new Date(validatedData.dateOfBirth);
      if (validatedData.gender) updateData.gender = validatedData.gender;

      const updatedUser = await User.findByIdAndUpdate(session.user.id, updateData, {
        new: true,
        runValidators: true,
      });

      if (!updatedUser) {
        return NextResponse.json(
          { error: "User not found" },
          { status: 404 }
        );
      }

      return NextResponse.json({
        success: true,
        message: "Profile updated successfully",
      });
    } else if (type === "preferences") {
      const validatedData = preferencesSchema.parse(data);

      const updatedUser = await User.findByIdAndUpdate(
        session.user.id,
        { preferences: validatedData },
        { new: true, runValidators: true }
      );

      if (!updatedUser) {
        return NextResponse.json(
          { error: "User not found" },
          { status: 404 }
        );
      }

      return NextResponse.json({
        success: true,
        message: "Preferences updated successfully",
      });
    } else {
      return NextResponse.json(
        { error: "Invalid update type" },
        { status: 400 }
      );
    }
  } catch (error: any) {
    console.error("Error updating profile:", error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation failed", details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: error.message || "Failed to update profile" },
      { status: 500 }
    );
  }
}