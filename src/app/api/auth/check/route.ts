import { auth } from "@/lib/next-auth";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const session = await auth();

    console.log("Auth check session:", session);

    return NextResponse.json({
      authenticated: !!session,
      user: session?.user || null,
    });
  } catch (error) {
    console.error("Auth check error:", error);
    return NextResponse.json(
      { authenticated: false, user: null },
      { status: 500 }
    );
  }
}
