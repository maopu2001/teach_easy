import AdminLayout from "@/components/admin/AdminLayout";
import CategoryForm from "../../_components/CategoryForm";
import { connectDB } from "@/lib/connectDb";
import { Category } from "@/schema";
import { notFound } from "next/navigation";

interface EditCategoryPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditCategoryPage({
  params,
}: EditCategoryPageProps) {
  const { id } = await params;

  await connectDB();
  const category = await Category.findById(id).lean();

  if (!category) {
    notFound();
  }

  const categoryData = {
    _id: (category as any)._id.toString(),
    name: (category as any).name,
    slug: (category as any).slug,
    description: (category as any).description || "",
    imageUrl: (category as any).imageUrl || "",
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Edit Category</h1>
          <p className="text-muted-foreground">Update category information.</p>
        </div>
        <CategoryForm initialData={categoryData} isEdit={true} />
      </div>
    </AdminLayout>
  );
}
