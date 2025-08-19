import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/connectDb";
import { Product } from "@/schema";
import { auth } from "@/lib/next-auth";
import { deleteFile } from "@/lib/s3-service";
import { z } from "zod";

// Zod schema for product validation
const productSchema = z.object({
  name: z
    .string()
    .min(1, "Product name is required")
    .max(200, "Product name must be less than 200 characters"),
  slug: z
    .string()
    .min(1, "Slug is required")
    .regex(
      /^[a-z0-9-]+$/,
      "Slug must contain only lowercase letters, numbers, and hyphens"
    ),
  description: z.object({
    short: z
      .string()
      .min(1, "Short description is required")
      .max(2000, "Short description must be less than 2000 characters"),
    full: z
      .string()
      .min(1, "Full description is required")
      .max(5000, "Full description must be less than 5000 characters"),
  }),
  price: z.number().min(0, "Price must be greater than or equal to 0"),
  discount: z
    .number()
    .min(0, "Discount must be greater than or equal to 0")
    .max(100, "Discount cannot exceed 100%"),
  category: z.string().min(1, "Category is required"),
  subcategory: z.string().optional(),
  tags: z.array(z.string()).default([]),
  stock: z.number().min(0, "Stock must be greater than or equal to 0"),
  sku: z.string().optional(),
  weightInGrams: z.number().optional(),
  dimensionsInCM: z
    .object({
      length: z.number().optional(),
      width: z.number().optional(),
      height: z.number().optional(),
    })
    .optional(),
  specifications: z
    .array(
      z.object({
        name: z.string().min(1, "Specification name is required"),
        value: z.string().min(1, "Specification value is required"),
      })
    )
    .default([]),
  features: z.array(z.string()).default([]),
  isActive: z.boolean(),
  isFeatured: z.boolean().default(false),
  isOnSale: z.boolean().default(false),
  saleStartDate: z.string().optional(),
  saleEndDate: z.string().optional(),
  minOrderQuantity: z.number().default(1),
  maxOrderQuantity: z.number().optional(),
  seoMeta: z
    .object({
      title: z.string().optional(),
      description: z.string().optional(),
      keywords: z.array(z.string()).default([]),
    })
    .optional(),
  imageGallery: z
    .array(
      z.object({
        url: z.string().min(1, "Image URL is required"),
        alt: z.string(),
        isPrimary: z.boolean(),
      })
    )
    .default([]),
});

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
    const validatedData = productSchema.parse(body);

    // First fetch the existing product to get current images
    const existingProduct = await Product.findById(id);

    if (!existingProduct) {
      return NextResponse.json(
        { error: "Product not found" },
        { status: 404 }
      );
    }

    // Handle image cleanup if imageGallery is being updated
    if (validatedData.imageGallery && existingProduct.imageGallery) {
      const newImageUrls = validatedData.imageGallery.map(
        (img: any) => img.url
      );
      const existingImageUrls = existingProduct.imageGallery.map(
        (img: any) => img.url
      );

      // Find images that need to be deleted (exist in current but not in new)
      const imagesToDelete = existingImageUrls.filter(
        (url: string) => !newImageUrls.includes(url)
      );

      // Delete removed images from S3
      if (imagesToDelete.length > 0) {
        const deletePromises = imagesToDelete.map(async (imageUrl: string) => {
          try {
            await deleteFile(imageUrl);
          } catch (error) {
            console.error(`Failed to delete image ${imageUrl}:`, error);
            // Continue with other deletions even if one fails
          }
        });

        // Wait for all image deletions to complete
        await Promise.allSettled(deletePromises);
      }
    }

    // Now update the product with new data
    const product = await Product.findByIdAndUpdate(id, validatedData, {
      new: true,
      runValidators: true,
    });

    return NextResponse.json({
      success: true,
      message: "Product updated successfully",
      product,
    });
  } catch (error: any) {
    console.error("Error updating product:", error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation failed", details: error.errors },
        { status: 400 }
      );
    }

    if (error.code === 11000) {
      return NextResponse.json(
        { error: "Product with this slug already exists" },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Failed to update product" },
      { status: 500 }
    );
  }
}

// DELETE - Delete product
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

    // First fetch the product to get image URLs
    const product = await Product.findById(id);

    if (!product) {
      return NextResponse.json(
        { error: "Product not found" },
        { status: 404 }
      );
    }

    // Delete all images from S3 if they exist
    if (product.imageGallery && product.imageGallery.length > 0) {
      const deletePromises = product.imageGallery.map(async (image: any) => {
        if (image.url) {
          try {
            await deleteFile(image.url);
          } catch (error) {
            console.error(`Failed to delete image ${image.url}:`, error);
            // Continue with other deletions even if one fails
          }
        }
      });

      // Wait for all image deletions to complete
      await Promise.allSettled(deletePromises);
    }

    // Now delete the product from database
    await Product.findByIdAndDelete(id);

    return NextResponse.json({
      success: true,
      message: "Product and all associated images deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting product:", error);
    return NextResponse.json(
      { error: "Failed to delete product" },
      { status: 500 }
    );
  }
}