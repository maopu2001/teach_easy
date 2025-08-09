import { NextResponse } from "next/server";
import { connectDB } from "@/lib/connectDb";
import { User } from "@/schema";
import { auth } from "@/lib/next-auth";

// GET - Fetch current user profile (authenticated endpoint)
export async function GET() {
  try {
    await connectDB();

    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await User.findById(session.user.id)
      .select("-password")
      .populate("addresses")
      .lean();

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ user });
  } catch (error) {
    console.error("Error fetching user profile:", error);
    return NextResponse.json(
      { error: "Failed to fetch user profile" },
      { status: 500 }
    );
  }
}
