import { NextResponse } from "next/server";
import { connectDB } from "@/lib/connectDb";
import { Address } from "@/schema";
import { auth } from "@/lib/next-auth";

// GET - Fetch current user's addresses (authenticated endpoint)
export async function GET() {
  try {
    await connectDB();

    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const addresses = await Address.find({ user: session.user.id })
      .sort({ isDefault: -1, createdAt: -1 })
      .lean();

    return NextResponse.json({ addresses });
  } catch (error) {
    console.error("Error fetching addresses:", error);
    return NextResponse.json(
      { error: "Failed to fetch addresses" },
      { status: 500 }
    );
  }
}
