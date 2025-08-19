import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/connectDb";
import { Category } from "@/schema";
import { auth } from "@/lib/next-auth";
import { z } from "zod";

const categorySchema = z.object({
  name: z
    .string()
    .min(1, "Category name is required")
    .max(100, "Name too long"),
  slug: z.string().min(1, "Slug is required").max(100, "Slug too long"),
  description: z
    .string()
    .nullable()
    .transform((val) => val ?? "")
    .refine((val) => val.length <= 500, "Description too long")
    .optional(),
  imageUrl: z
    .string()
    .nullable()
    .transform((val) => val ?? "")
    .refine((val) => val === "" || z.string().url().safeParse(val).success, {
      message: "Invalid URL",
    })
    .optional(),
  parent: z
    .string()
    .nullable()
    .transform((val) => val ?? "")
    .optional(),
  subject: z
    .string()
    .nullable()
    .transform((val) => val ?? "")
    .optional(),
  sortOrder: z
    .number()
    .min(0, "Sort order must be non-negative")
    .optional(),
});

// POST - Create category
export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    const body = await request.json();
    const validatedData = categorySchema.parse(body);

    // Transform data for database
    const categoryData: any = {
      name: validatedData.name,
      slug: validatedData.slug,
      description: validatedData.description || undefined,
      imageUrl: validatedData.imageUrl || undefined,
      subject: validatedData.subject || undefined,
      sortOrder: validatedData.sortOrder || 0,
    };

    // Handle parent category
    if (validatedData.parent && validatedData.parent.trim()) {
      categoryData.parent = validatedData.parent;
    }

    // Check if slug already exists
    const existingCategory = await Category.findOne({
      slug: validatedData.slug,
    });
    if (existingCategory) {
      return NextResponse.json(
        { error: "Category with this slug already exists" },
        { status: 400 }
      );
    }

    const category = await Category.create(categoryData);

    return NextResponse.json({
      success: true,
      message: "Category created successfully",
      category,
    });
  } catch (error) {
    console.error("Error creating category:", error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation failed", details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Failed to create category" },
      { status: 500 }
    );
  }
}