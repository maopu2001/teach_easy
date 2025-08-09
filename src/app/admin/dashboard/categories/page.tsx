import AdminLayout from "@/components/admin/AdminLayout";
import CategoriesTable from "./_components/CategoriesTable";
import CategoriesHeader from "./_components/CategoriesHeader";

export default function CategoriesPage() {
  return (
    <AdminLayout>
      <div className="space-y-6">
        <CategoriesHeader />
        <CategoriesTable />
      </div>
    </AdminLayout>
  );
}
