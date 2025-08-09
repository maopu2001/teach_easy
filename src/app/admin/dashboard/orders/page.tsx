import AdminLayout from "@/components/admin/AdminLayout";
import OrdersHeader from "./_components/OrdersHeader";
import OrdersTable from "./_components/OrdersTable";

export default function OrdersPage() {
  return (
    <AdminLayout>
      <div className="space-y-6">
        <OrdersHeader />
        <OrdersTable />
      </div>
    </AdminLayout>
  );
}
