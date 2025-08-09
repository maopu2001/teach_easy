import AdminLayout from "@/components/admin/AdminLayout";
import OrderDetails from "../_components/OrderDetails";

interface OrderPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function OrderPage({ params }: OrderPageProps) {
  const { id } = await params;

  return (
    <AdminLayout>
      <div className="max-w-6xl mx-auto space-y-6">
        <OrderDetails orderId={id} />
      </div>
    </AdminLayout>
  );
}
