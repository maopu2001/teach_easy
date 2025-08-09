"use server";

import { connectDB } from "@/lib/connectDb";
import { Category } from "@/schema";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
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
    .string()
    .nullable()
    .transform((val) => val ?? "0")
    .optional(),
});

export async function createCategory(formData: FormData) {
  try {
    await connectDB();

    const data = {
      name: (formData.get("name") as string) || "",
      slug: (formData.get("slug") as string) || "",
      description: (formData.get("description") as string) || null,
      imageUrl: (formData.get("imageUrl") as string) || null,
      parent: (formData.get("parent") as string) || null,
      subject: (formData.get("subject") as string) || null,
      sortOrder: (formData.get("sortOrder") as string) || null,
    };

    const validatedData = categorySchema.parse(data);

    // Transform data for database
    const categoryData: any = {
      name: validatedData.name,
      slug: validatedData.slug,
      description: validatedData.description || undefined,
      imageUrl: validatedData.imageUrl || undefined,
      subject: validatedData.subject || undefined,
      sortOrder: validatedData.sortOrder
        ? parseInt(validatedData.sortOrder)
        : 0,
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
      throw new Error("Category with this slug already exists");
    }

    await Category.create(categoryData);

    revalidatePath("/admin/dashboard/categories");
    redirect("/admin/dashboard/categories");
  } catch (error) {
    console.error("Error creating category:", error);
    throw error;
  }
}

export async function updateCategory(id: string, formData: FormData) {
  try {
    await connectDB();

    const data = {
      name: (formData.get("name") as string) || "",
      slug: (formData.get("slug") as string) || "",
      description: (formData.get("description") as string) || null,
      imageUrl: (formData.get("imageUrl") as string) || null,
      parent: (formData.get("parent") as string) || null,
      subject: (formData.get("subject") as string) || null,
      sortOrder: (formData.get("sortOrder") as string) || null,
    };

    const validatedData = categorySchema.parse(data);

    // Transform data for database
    const categoryData: any = {
      name: validatedData.name,
      slug: validatedData.slug,
      description: validatedData.description || undefined,
      imageUrl: validatedData.imageUrl || undefined,
      subject: validatedData.subject || undefined,
      sortOrder: validatedData.sortOrder
        ? parseInt(validatedData.sortOrder)
        : 0,
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
      throw new Error("Category with this slug already exists");
    }

    await Category.findByIdAndUpdate(id, categoryData);

    revalidatePath("/admin/dashboard/categories");
    redirect("/admin/dashboard/categories");
  } catch (error) {
    console.error("Error updating category:", error);
    throw error;
  }
}

export async function deleteCategory(id: string) {
  try {
    await connectDB();

    // Get the category first to check its name
    const category = await Category.findById(id);
    if (!category) {
      throw new Error("Category not found");
    }

    // Check if category is being used by any products
    const { Product } = await import("@/schema");
    const productCount = await Product.countDocuments({
      category: (category as any).name,
    });

    if (productCount > 0) {
      throw new Error(
        `Cannot delete category. It is being used by ${productCount} product(s).`
      );
    }

    await Category.findByIdAndDelete(id);

    revalidatePath("/admin/dashboard/categories");
  } catch (error) {
    console.error("Error deleting category:", error);
    throw error;
  }
}
