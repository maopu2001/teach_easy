"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  FormInput,
  FormTextarea,
  FormCheckbox,
  FormSelect,
} from "@/components/forms";
import { toast } from "sonner";
import { ArrowLeft, Save, Plus, X, Upload, Star, CircleX } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import getPublicUrl from "@/lib/getPublicUrl";
import { createProduct, updateProduct } from "../_actions/product-actions";

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
  price: z.string().min(0, "Price must be greater than or equal to 0"),
  discount: z
    .string()
    .min(0, "Discount must be greater than or equal to 0")
    .max(100, "Discount cannot exceed 100%"),
  category: z.string().min(1, "Category is required"),
  subcategory: z.string().optional(),
  tags: z.array(z.string()).default([]),
  stock: z.string().min(0, "Stock must be greater than or equal to 0"),
  sku: z.string().optional(),
  weightInGrams: z.string().optional(),
  dimensionsInCM: z
    .object({
      length: z.string().optional(),
      width: z.string().optional(),
      height: z.string().optional(),
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
  minOrderQuantity: z.string().default("1"),
  maxOrderQuantity: z.string().optional(),
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

type ProductFormData = z.infer<typeof productSchema>;

interface ProductFormProps {
  initialData?: Partial<ProductFormData>;
  isEditing?: boolean;
  productId?: string;
}

export default function ProductForm({
  initialData,
  isEditing = false,
  productId,
}: ProductFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<
    Array<{ value: string; label: string }>
  >([]);

  // Initialize form with react-hook-form and zod validation
  const form = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: initialData?.name || "",
      slug: initialData?.slug || "",
      description: {
        short: initialData?.description?.short || "",
        full: initialData?.description?.full || "",
      },
      price: initialData?.price?.toString() || "",
      discount: initialData?.discount?.toString() || "",
      category: initialData?.category || "",
      subcategory: initialData?.subcategory || "",
      tags: initialData?.tags || [],
      stock: initialData?.stock?.toString() || "",
      sku: initialData?.sku || "",
      weightInGrams: initialData?.weightInGrams?.toString() || "",
      dimensionsInCM: {
        length: initialData?.dimensionsInCM?.length?.toString() || "",
        width: initialData?.dimensionsInCM?.width?.toString() || "",
        height: initialData?.dimensionsInCM?.height?.toString() || "",
      },
      specifications: initialData?.specifications || [],
      features: initialData?.features || [],
      isActive: initialData?.isActive ?? true,
      isFeatured: initialData?.isFeatured ?? false,
      isOnSale: initialData?.isOnSale ?? false,
      saleStartDate: initialData?.saleStartDate || "",
      saleEndDate: initialData?.saleEndDate || "",
      minOrderQuantity: initialData?.minOrderQuantity?.toString() || "1",
      maxOrderQuantity: initialData?.maxOrderQuantity?.toString() || "",
      seoMeta: {
        title: initialData?.seoMeta?.title || "",
        description: initialData?.seoMeta?.description || "",
        keywords: initialData?.seoMeta?.keywords || [],
      },
      imageGallery: initialData?.imageGallery || [],
    },
  });

  // Watch form values for reactive updates
  const nameValue = form.watch("name");
  const imageGallery = form.watch("imageGallery");

  // Fetch categories from API
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch("/api/categories");
        const data = await response.json();
        if (response.ok && data.categories) {
          const categoryOptions = data.categories.map((cat: any) => ({
            value: cat.name,
            label: cat.name,
          }));
          setCategories(categoryOptions);
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
        toast.error("Failed to load categories");
      }
    };

    fetchCategories();
  }, []);

  // Auto-generate slug when name changes
  useEffect(() => {
    if (nameValue && (!isEditing || !form.getValues("slug"))) {
      form.setValue("slug", generateSlug(nameValue));
    }
  }, [nameValue, form, isEditing]);

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
  };

  const addImage = () => {
    const currentImages = form.getValues("imageGallery");
    const newImage = {
      url: "",
      alt: "",
      isPrimary: currentImages.length === 0, // First image is primary by default
    };
    form.setValue("imageGallery", [...currentImages, newImage]);
  };

  const removeImage = async (index: number) => {
    const currentImages = form.getValues("imageGallery");
    const imageToRemove = currentImages[index];

    // Only try to delete from server if it's not a blob URL (i.e., it's been uploaded)
    if (imageToRemove.url && !imageToRemove.url.startsWith("blob:")) {
      try {
        await fetch("/api/upload/image", {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ url: imageToRemove.url }),
        });
      } catch (error) {
        console.error("Error deleting image from server:", error);
        // Continue with local removal even if server deletion fails
      }
    }

    const newGallery = currentImages.filter((_, i) => i !== index);
    // If we removed the primary image, make the first remaining image primary
    if (currentImages[index].isPrimary && newGallery.length > 0) {
      newGallery[0].isPrimary = true;
    }
    form.setValue("imageGallery", newGallery);
  };

  const updateImage = (
    index: number,
    field: keyof (typeof imageGallery)[0],
    value: any
  ) => {
    const currentImages = form.getValues("imageGallery");
    const newGallery = [...currentImages];

    if (field === "isPrimary" && value) {
      // Set all images to not primary first
      newGallery.forEach((img) => (img.isPrimary = false));
    }

    newGallery[index] = { ...newGallery[index], [field]: value };
    form.setValue("imageGallery", newGallery);
  };

  const handleImageUpload = async (index: number, file: File) => {
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("folder", "products");

      const response = await fetch("/api/upload/image", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (response.ok) {
        updateImage(index, "url", data.url);
        updateImage(index, "alt", file.name.split(".")[0]);
        toast.success("Image uploaded successfully");
      } else {
        throw new Error(data.error || "Failed to upload image");
      }
    } catch (error) {
      console.error("Error uploading image:", error);
      toast.error("Failed to upload image");
    }
  };

  // Array management functions
  const addTag = (tag: string) => {
    if (tag.trim()) {
      const currentTags = form.getValues("tags");
      if (!currentTags.includes(tag.trim())) {
        form.setValue("tags", [...currentTags, tag.trim()]);
      }
    }
  };

  const removeTag = (index: number) => {
    const currentTags = form.getValues("tags");
    form.setValue(
      "tags",
      currentTags.filter((_, i) => i !== index)
    );
  };

  const addSpecification = () => {
    const currentSpecs = form.getValues("specifications");
    form.setValue("specifications", [...currentSpecs, { name: "", value: "" }]);
  };

  const removeSpecification = (index: number) => {
    const currentSpecs = form.getValues("specifications");
    form.setValue(
      "specifications",
      currentSpecs.filter((_, i) => i !== index)
    );
  };

  const addFeature = (feature: string) => {
    if (feature.trim()) {
      const currentFeatures = form.getValues("features");
      if (!currentFeatures.includes(feature.trim())) {
        form.setValue("features", [...currentFeatures, feature.trim()]);
      }
    }
  };

  const removeFeature = (index: number) => {
    const currentFeatures = form.getValues("features");
    form.setValue(
      "features",
      currentFeatures.filter((_, i) => i !== index)
    );
  };

  const addSEOKeyword = (keyword: string) => {
    if (keyword.trim()) {
      const currentKeywords = form.getValues("seoMeta.keywords") || [];
      if (!currentKeywords.includes(keyword.trim())) {
        form.setValue("seoMeta.keywords", [...currentKeywords, keyword.trim()]);
      }
    }
  };

  const removeSEOKeyword = (index: number) => {
    const currentKeywords = form.getValues("seoMeta.keywords") || [];
    form.setValue(
      "seoMeta.keywords",
      currentKeywords.filter((_, i) => i !== index)
    );
  };

  const handleSubmit = async (data: ProductFormData) => {
    setLoading(true);

    try {
      const transformedData = {
        ...data,
        price: parseFloat(data.price),
        discount: parseFloat(data.discount) || 0,
        stock: parseInt(data.stock),
        weightInGrams: data.weightInGrams
          ? parseFloat(data.weightInGrams)
          : undefined,
        dimensionsInCM: data.dimensionsInCM
          ? {
              length: data.dimensionsInCM.length
                ? parseFloat(data.dimensionsInCM.length)
                : undefined,
              width: data.dimensionsInCM.width
                ? parseFloat(data.dimensionsInCM.width)
                : undefined,
              height: data.dimensionsInCM.height
                ? parseFloat(data.dimensionsInCM.height)
                : undefined,
            }
          : undefined,
        minOrderQuantity: parseInt(data.minOrderQuantity),
        maxOrderQuantity: data.maxOrderQuantity
          ? parseInt(data.maxOrderQuantity)
          : undefined,
        saleStartDate: data.saleStartDate || undefined,
        saleEndDate: data.saleEndDate || undefined,
      };

      let result;

      if (isEditing && productId) {
        result = await updateProduct(productId, transformedData);
      } else {
        result = await createProduct(transformedData);
      }

      if (result.success) {
        toast.success(
          isEditing
            ? "Product updated successfully!"
            : "Product created successfully!"
        );
        router.push("/admin/dashboard/products");
      } else {
        if (result.errors) {
          // Handle field-specific errors
          Object.entries(result.errors).forEach(([field, messages]) => {
            if (messages) {
              form.setError(field as keyof ProductFormData, {
                message: Array.isArray(messages) ? messages[0] : messages,
              });
            }
          });
        } else {
          toast.error(result.message || "An error occurred");
        }
      }
    } catch (error) {
      console.error("Submit error:", error);
      toast.error("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <div className="flex items-center justify-between">
          <Button type="button" variant="ghost" asChild>
            <Link href="/admin/dashboard/products">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Products
            </Link>
          </Button>
          <Button type="submit" disabled={loading}>
            <Save className="mr-2 h-4 w-4" />
            {loading
              ? "Saving..."
              : isEditing
              ? "Update Product"
              : "Create Product"}
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Product Information */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Basic Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 px-4">
                <FormInput
                  control={form.control}
                  name="name"
                  label="Product Name"
                  placeholder="Enter product name"
                  required
                />

                <FormInput
                  control={form.control}
                  name="slug"
                  label="Slug"
                  placeholder="product-slug"
                  required
                  description="URL-friendly version of the product name"
                />

                <FormSelect
                  control={form.control}
                  name="category"
                  label="Category"
                  placeholder="Select a category"
                  options={categories}
                  required
                />

                <FormInput
                  control={form.control}
                  name="subcategory"
                  label="Subcategory"
                  placeholder="Enter subcategory (optional)"
                />

                <FormInput
                  control={form.control}
                  name="sku"
                  label="SKU"
                  placeholder="Enter product SKU (optional)"
                  description="Stock Keeping Unit - unique product identifier"
                />

                <FormTextarea
                  control={form.control}
                  name="description.short"
                  label="Short Description"
                  placeholder="Brief description of the product"
                  rows={3}
                  required
                />

                <FormTextarea
                  control={form.control}
                  name="description.full"
                  label="Full Description"
                  placeholder="Detailed description of the product"
                  rows={6}
                  required
                />
              </CardContent>
            </Card>
            {/* Image Gallery Section */}
            <Card className="bg-gradient-to-br from-card to-muted border-border shadow-lg">
              <CardHeader className="border-b bg-gradient-to-r from-muted to-secondary">
                <CardTitle className="flex items-center justify-between text-card-foreground">
                  <span className="flex items-center gap-2">
                    <Upload className="h-5 w-5 text-primary" />
                    Product Images
                  </span>
                  <Button
                    type="button"
                    onClick={addImage}
                    size="sm"
                    className="bg-primary hover:bg-primary/90"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Image
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                {imageGallery.length === 0 ? (
                  <div className="text-center py-12 text-muted-foreground bg-gradient-to-br from-muted/20 to-accent/10 rounded-lg border border-border">
                    <Upload className="h-16 w-16 mx-auto mb-4 opacity-50 text-chart-1" />
                    <p className="text-lg font-medium mb-2">
                      No images added yet
                    </p>
                    <p className="text-sm">
                      Click &quot;Add Image&quot; to get started with your
                      product gallery
                    </p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {imageGallery.map((image, index) => (
                      <div
                        key={index}
                        className="bg-gradient-to-br from-card to-secondary/20 border border-border rounded-xl p-6 space-y-4 hover:shadow-md transition-all duration-300"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-semibold text-card-foreground flex items-center gap-2">
                            <div className="w-2 h-2 bg-chart-2 rounded-full"></div>
                            Image - {index + 1}
                            {image.isPrimary && (
                              <span className="ml-2 px-3 py-1 bg-primary/20 text-primary text-xs rounded-full border border-primary/30 font-medium">
                                ✨ Primary
                              </span>
                            )}
                          </span>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => removeImage(index)}
                            className="text-destructive hover:text-destructive hover:bg-destructive/20 rounded-full size-8 transition-all duration-200"
                          >
                            <CircleX className="size-6" />
                          </Button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="space-y-3">
                            <Label
                              htmlFor={`image-url-${index}`}
                              className="text-card-foreground font-medium"
                            >
                              Image URL
                            </Label>
                            <div className="flex gap-3">
                              <Input
                                id={`image-url-${index}`}
                                type="text"
                                placeholder="Enter image URL or upload file"
                                value={image.url}
                                onChange={(e) =>
                                  updateImage(index, "url", e.target.value)
                                }
                                className="flex-1 bg-card border-border"
                                disabled
                              />
                              <Label
                                htmlFor={`image-file-${index}`}
                                className="cursor-pointer"
                              >
                                <div className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-border bg-secondary hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2">
                                  <Upload className="h-4 w-4 text-chart-1" />
                                </div>
                                <input
                                  id={`image-file-${index}`}
                                  type="file"
                                  accept="image/*"
                                  className="hidden"
                                  onChange={(e) => {
                                    const file = e.target.files?.[0];
                                    if (file) {
                                      handleImageUpload(index, file);
                                    }
                                  }}
                                />
                              </Label>
                            </div>
                          </div>

                          <div className="space-y-3">
                            <Label
                              htmlFor={`image-alt-${index}`}
                              className="text-card-foreground font-medium"
                            >
                              Alt Text
                            </Label>
                            <Input
                              id={`image-alt-${index}`}
                              type="text"
                              placeholder="Describe the image"
                              value={image.alt}
                              onChange={(e) =>
                                updateImage(index, "alt", e.target.value)
                              }
                              className="bg-card border-border"
                            />
                          </div>
                        </div>

                        {/* Image Preview */}
                        {image.url && (
                          <div className="space-y-3">
                            <Label className="text-card-foreground font-medium">
                              Preview
                            </Label>
                            <div className="relative w-36 h-36 border border-border rounded-xl overflow-hidden bg-gradient-to-br from-muted to-accent/20 shadow-md">
                              <Image
                                src={getPublicUrl(image.url) || image.url}
                                alt={image.alt || `Product image ${index + 1}`}
                                fill
                                className="object-cover hover:scale-105 transition-transform duration-300"
                                onError={() => {
                                  toast.error(
                                    `Failed to load image ${index + 1}`
                                  );
                                }}
                              />
                              {image.isPrimary && (
                                <div className="absolute top-2 right-2 bg-primary text-primary-foreground rounded-full p-1">
                                  <Star className="h-3 w-3 fill-current" />
                                </div>
                              )}
                            </div>
                          </div>
                        )}

                        {/* Primary Image Toggle */}
                        <div className="flex items-center space-x-3 p-3 bg-gradient-to-r from-accent/20 to-secondary/30 rounded-lg border border-border">
                          <Checkbox
                            id={`primary-${index}`}
                            checked={image.isPrimary}
                            onCheckedChange={(checked) =>
                              updateImage(index, "isPrimary", checked)
                            }
                            className="border-border data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                          />
                          <Label
                            htmlFor={`primary-${index}`}
                            className="flex items-center cursor-pointer text-card-foreground"
                          >
                            <Star className="h-4 w-4 mr-2 text-chart-2" />
                            Set as primary image
                          </Label>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Tags Section */}
            <Card>
              <CardHeader>
                <CardTitle>Tags</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-wrap gap-2 mb-4">
                  {form.watch("tags").map((tag, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-2 bg-primary/10 text-primary px-3 py-1 rounded-full text-sm"
                    >
                      <span>{tag}</span>
                      <button
                        type="button"
                        onClick={() => removeTag(index)}
                        className="hover:bg-primary/20 rounded-full p-1"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                </div>
                <div className="flex gap-2">
                  <Input
                    placeholder="Add a tag"
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        const input = e.target as HTMLInputElement;
                        addTag(input.value);
                        input.value = "";
                      }
                    }}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={(e) => {
                      const input = e.currentTarget
                        .previousElementSibling as HTMLInputElement;
                      addTag(input.value);
                      input.value = "";
                    }}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Features Section */}
            <Card>
              <CardHeader>
                <CardTitle>Key Features</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  {form.watch("features").map((feature, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-2 p-2 bg-muted rounded"
                    >
                      <span className="flex-1">{feature}</span>
                      <button
                        type="button"
                        onClick={() => removeFeature(index)}
                        className="hover:bg-destructive/20 rounded p-1"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
                <div className="flex gap-2">
                  <Input
                    placeholder="Add a feature"
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        const input = e.target as HTMLInputElement;
                        addFeature(input.value);
                        input.value = "";
                      }
                    }}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={(e) => {
                      const input = e.currentTarget
                        .previousElementSibling as HTMLInputElement;
                      addFeature(input.value);
                      input.value = "";
                    }}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Specifications Section */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Specifications</span>
                  <Button
                    type="button"
                    onClick={addSpecification}
                    size="sm"
                    variant="outline"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Spec
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {form.watch("specifications").map((spec, index) => (
                  <div key={index} className="flex gap-2 items-start">
                    <Input
                      placeholder="Name"
                      value={spec.name}
                      onChange={(e) => {
                        const currentSpecs = form.getValues("specifications");
                        const newSpecs = [...currentSpecs];
                        newSpecs[index] = {
                          ...newSpecs[index],
                          name: e.target.value,
                        };
                        form.setValue("specifications", newSpecs);
                      }}
                    />
                    <Input
                      placeholder="Value"
                      value={spec.value}
                      onChange={(e) => {
                        const currentSpecs = form.getValues("specifications");
                        const newSpecs = [...currentSpecs];
                        newSpecs[index] = {
                          ...newSpecs[index],
                          value: e.target.value,
                        };
                        form.setValue("specifications", newSpecs);
                      }}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => removeSpecification(index)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
                {form.watch("specifications").length === 0 && (
                  <p className="text-muted-foreground text-sm">
                    No specifications added yet.
                  </p>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Pricing and Inventory */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Pricing</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 px-4">
                <FormInput
                  control={form.control}
                  name="price"
                  label="Price ($)"
                  type="number"
                  placeholder="0.00"
                  required
                />

                <FormInput
                  control={form.control}
                  name="discount"
                  label="Discount (%)"
                  type="number"
                  placeholder="0"
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Inventory</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 px-4">
                <FormInput
                  control={form.control}
                  name="stock"
                  label="Stock Quantity"
                  type="number"
                  placeholder="0"
                  required
                />

                <FormInput
                  control={form.control}
                  name="minOrderQuantity"
                  label="Minimum Order Quantity"
                  type="number"
                  placeholder="1"
                />

                <FormInput
                  control={form.control}
                  name="maxOrderQuantity"
                  label="Maximum Order Quantity"
                  type="number"
                  placeholder="Leave empty for no limit"
                />

                <FormCheckbox
                  className="hover:bg-primary/30 rounded-md p-2"
                  control={form.control}
                  name="isActive"
                  label="Product is active"
                />

                <FormCheckbox
                  className="hover:bg-primary/30 rounded-md p-2"
                  control={form.control}
                  name="isFeatured"
                  label="Featured product"
                />
              </CardContent>
            </Card>

            {/* Physical Details */}
            <Card>
              <CardHeader>
                <CardTitle>Physical Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 px-4">
                <FormInput
                  control={form.control}
                  name="weightInGrams"
                  label="Weight (grams)"
                  type="number"
                  placeholder="0"
                />

                <div className="space-y-2">
                  <Label>Dimensions (cm)</Label>
                  <div className="grid grid-cols-3 gap-2">
                    <FormInput
                      control={form.control}
                      name="dimensionsInCM.length"
                      placeholder="Length"
                      type="number"
                    />
                    <FormInput
                      control={form.control}
                      name="dimensionsInCM.width"
                      placeholder="Width"
                      type="number"
                    />
                    <FormInput
                      control={form.control}
                      name="dimensionsInCM.height"
                      placeholder="Height"
                      type="number"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Sales & Promotion */}
            <Card>
              <CardHeader>
                <CardTitle>Sales & Promotion</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 px-4">
                <FormCheckbox
                  className="hover:bg-primary/30 rounded-md p-2"
                  control={form.control}
                  name="isOnSale"
                  label="Product is on sale"
                />

                <FormInput
                  control={form.control}
                  name="saleStartDate"
                  label="Sale Start Date"
                  placeholder="YYYY-MM-DD or leave empty"
                />

                <FormInput
                  control={form.control}
                  name="saleEndDate"
                  label="Sale End Date"
                  placeholder="YYYY-MM-DD or leave empty"
                />
              </CardContent>
            </Card>

            {/* SEO */}
            <Card>
              <CardHeader>
                <CardTitle>SEO Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 px-4">
                <FormInput
                  control={form.control}
                  name="seoMeta.title"
                  label="SEO Title"
                  placeholder="Custom page title for search engines"
                />

                <FormTextarea
                  control={form.control}
                  name="seoMeta.description"
                  label="SEO Description"
                  placeholder="Meta description for search engines"
                  rows={3}
                />

                <div className="space-y-2">
                  <Label>SEO Keywords</Label>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {(form.watch("seoMeta.keywords") || []).map(
                      (keyword, index) => (
                        <div
                          key={index}
                          className="flex items-center gap-2 bg-secondary text-secondary-foreground px-2 py-1 rounded text-sm"
                        >
                          <span>{keyword}</span>
                          <button
                            type="button"
                            onClick={() => removeSEOKeyword(index)}
                            className="hover:bg-secondary/80 rounded p-1"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </div>
                      )
                    )}
                  </div>
                  <div className="flex gap-2">
                    <Input
                      placeholder="Add SEO keyword"
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          const input = e.target as HTMLInputElement;
                          addSEOKeyword(input.value);
                          input.value = "";
                        }
                      }}
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={(e) => {
                        const input = e.currentTarget
                          .previousElementSibling as HTMLInputElement;
                        addSEOKeyword(input.value);
                        input.value = "";
                      }}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </form>
    </Form>
  );
}
