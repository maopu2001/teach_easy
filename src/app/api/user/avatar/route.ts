import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/connectDb";
import { User } from "@/schema";
import { auth } from "@/lib/next-auth";
import { z } from "zod";

const avatarSchema = z.object({
  avatarUrl: z.string().url("Invalid avatar URL"),
});

// PUT - Upload avatar
export async function PUT(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    const body = await request.json();
    const { avatarUrl } = avatarSchema.parse(body);

    const updatedUser = await User.findByIdAndUpdate(
      session.user.id,
      { avatar: avatarUrl },
      { new: true }
    );

    if (!updatedUser) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Avatar updated successfully",
    });
  } catch (error: any) {
    console.error("Error updating avatar:", error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid avatar URL" },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: error.message || "Failed to update avatar" },
      { status: 500 }
    );
  }
}

// DELETE - Delete avatar
export async function DELETE(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    const user = await User.findById(session.user.id);

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    const currentAvatar = user.avatar;

    await User.findByIdAndUpdate(session.user.id, { $unset: { avatar: "" } });

    if (!currentAvatar) {
      return NextResponse.json({
        success: true,
        message: "No avatar to delete",
      });
    }

    return NextResponse.json({
      success: true,
      message: "Avatar deleted successfully",
    });
  } catch (error: any) {
    console.error("Error deleting avatar:", error);
    return NextResponse.json(
      { error: error.message || "Failed to delete avatar" },
      { status: 500 }
    );
  }
}