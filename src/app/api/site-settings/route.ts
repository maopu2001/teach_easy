import { NextResponse } from "next/server";

// FIXME: Implement proper fetching of site settings
// GET - Fetch public site settings (public endpoint)
export async function GET() {
  try {
    return NextResponse.json({ settings: "siteSettings" });
  } catch (error) {
    console.error("Error fetching site settings:", error);
    return NextResponse.json(
      { error: "Failed to fetch site settings" },
      { status: 500 }
    );
  }
}
