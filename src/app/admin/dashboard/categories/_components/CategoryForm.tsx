"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import { FormInput, FormSelect, FormTextarea } from "@/components/forms";
import { createCategory, updateCategory } from "../_actions/category-actions";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

// Form validation schema
const categorySchema = z.object({
  name: z.string().min(1, "Category name is required"),
  slug: z.string().min(1, "Slug is required"),
  description: z
    .string()
    .nullable()
    .transform((val) => val ?? "")
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
  sortOrder: z.number().min(0, "Sort order must be non-negative").optional(),
});

type CategoryFormData = z.infer<typeof categorySchema>;

interface CategoryFormProps {
  initialData?: {
    _id: string;
    name: string;
    slug: string;
    description?: string | null;
    imageUrl?: string | null;
    parent?: string | null;
    subject?: string | null;
    sortOrder?: number | null;
  };
  isEdit?: boolean;
}

export default function CategoryForm({
  initialData,
  isEdit = false,
}: CategoryFormProps) {
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<
    Array<{ value: string; label: string }>
  >([]);

  // Initialize form with React Hook Form
  const form = useForm<CategoryFormData>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      name: initialData?.name || "",
      slug: initialData?.slug || "",
      description: initialData?.description || "",
      imageUrl: initialData?.imageUrl || "",
      parent: initialData?.parent || "",
      subject: initialData?.subject || "",
      sortOrder: initialData?.sortOrder || 0,
    },
  });

  // Watch name field to generate slug
  const watchName = form.watch("name");

  // Fetch categories for parent selection
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch("/api/categories");
        const data = await response.json();
        if (response.ok && data.categories) {
          const categoryOptions = data.categories
            .filter((cat: any) =>
              isEdit ? cat._id !== initialData?._id : true
            ) // Exclude self when editing
            .map((cat: any) => ({
              value: cat._id,
              label: cat.name,
            }));
          setCategories(categoryOptions);
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategories();
  }, [isEdit, initialData?._id]);

  // Generate slug from name
  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9 -]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .trim();
  };

  // Auto-generate slug when name changes (only for new categories)
  useEffect(() => {
    if (!isEdit && watchName) {
      form.setValue("slug", generateSlug(watchName));
    }
  }, [watchName, isEdit, form]);

  const onSubmit = async (data: CategoryFormData) => {
    setLoading(true);

    try {
      // Convert data to FormData for server action
      const formData = new FormData();
      formData.append("name", data.name);
      formData.append("slug", data.slug);
      formData.append("description", data.description || "");
      formData.append("imageUrl", data.imageUrl || "");
      formData.append("parent", data.parent || "");
      formData.append("subject", data.subject || "");
      formData.append("sortOrder", data.sortOrder?.toString() || "0");

      if (isEdit && initialData) {
        await updateCategory(initialData._id, formData);
      } else {
        await createCategory(formData);
      }
      // Redirect happens in the action
    } catch (error) {
      console.error("Error submitting form:", error);
      if (error instanceof Error) {
        form.setError("root", { message: error.message });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl">
      <div className="mb-6">
        <Link href="/admin/dashboard/categories">
          <Button variant="ghost" className="pl-0">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Categories
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>
            {isEdit ? "Edit Category" : "Create New Category"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {form.formState.errors.root && (
                <div className="bg-destructive/15 text-destructive px-4 py-3 rounded-md">
                  {form.formState.errors.root.message}
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormInput
                  control={form.control}
                  name="name"
                  label="Category Name"
                  placeholder="Enter category name"
                  required
                />

                <FormInput
                  control={form.control}
                  name="slug"
                  label="Slug"
                  placeholder="category-slug"
                  description="URL-friendly version (auto-generated from name)"
                  required
                />
              </div>

              <FormTextarea
                control={form.control}
                name="description"
                label="Description"
                placeholder="Enter category description"
                rows={3}
              />

              <FormInput
                control={form.control}
                name="imageUrl"
                label="Image URL"
                type="url"
                placeholder="https://example.com/image.jpg"
                description="Optional: Add an image URL for the category"
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormSelect
                  control={form.control}
                  name="parent"
                  label="Parent Category"
                  placeholder="Select parent category (optional)"
                  description="Choose a parent to create a subcategory"
                  options={[
                    ...categories.map((category) => ({
                      value: category.value,
                      label: category.label,
                    })),
                  ]}
                />

                <FormInput
                  control={form.control}
                  name="sortOrder"
                  label="Sort Order"
                  type="number"
                  placeholder="0"
                  description="Lower numbers appear first"
                />
              </div>

              <FormInput
                control={form.control}
                name="subject"
                label="Subject"
                placeholder="e.g., Mathematics, Science, Language Arts"
                description="Educational subject this category belongs to"
              />

              <div className="flex gap-4 pt-4">
                <Button type="submit" disabled={loading}>
                  {loading
                    ? "Saving..."
                    : isEdit
                    ? "Update Category"
                    : "Create Category"}
                </Button>
                <Link href="/admin/dashboard/categories">
                  <Button type="button" variant="outline">
                    Cancel
                  </Button>
                </Link>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
