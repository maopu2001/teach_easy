import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/connectDb";
import { Category, Product } from "@/schema";
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

// PUT - Update category
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
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

    // Check if slug already exists (excluding current category)
    const existingCategory = await Category.findOne({
      slug: validatedData.slug,
      _id: { $ne: id },
    });
    if (existingCategory) {
      return NextResponse.json(
        { error: "Category with this slug already exists" },
        { status: 400 }
      );
    }

    const category = await Category.findByIdAndUpdate(id, categoryData, {
      new: true,
    });

    if (!category) {
      return NextResponse.json(
        { error: "Category not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Category updated successfully",
      category,
    });
  } catch (error) {
    console.error("Error updating category:", error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation failed", details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Failed to update category" },
      { status: 500 }
    );
  }
}

// DELETE - Delete category
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    await connectDB();

    // Get the category first to check its name
    const category = await Category.findById(id);
    if (!category) {
      return NextResponse.json(
        { error: "Category not found" },
        { status: 404 }
      );
    }

    // Check if category is being used by any products
    const productCount = await Product.countDocuments({
      category: (category as any).name,
    });

    if (productCount > 0) {
      return NextResponse.json(
        {
          error: `Cannot delete category. It is being used by ${productCount} product(s).`,
        },
        { status: 400 }
      );
    }

    await Category.findByIdAndDelete(id);

    return NextResponse.json({
      success: true,
      message: "Category deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting category:", error);
    return NextResponse.json(
      { error: "Failed to delete category" },
      { status: 500 }
    );
  }
}