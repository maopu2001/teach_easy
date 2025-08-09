import AdminLayout from "@/components/admin/AdminLayout";
import ProductsTable from "./_components/ProductsTable";
import ProductsHeader from "./_components/ProductsHeader";

export default function ProductsPage() {
  return (
    <AdminLayout>
      <div className="space-y-6">
        <ProductsHeader />
        <ProductsTable />
      </div>
    </AdminLayout>
  );
}
