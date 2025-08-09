import AdminLayout from "@/components/admin/AdminLayout";
import DashboardStats from "./_components/DashboardStats";
import RecentOrders from "./_components/RecentOrders";
import QuickActions from "./_components/QuickActions";


export default function AdminDashboard() {
  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome to your admin dashboard
          </p>
        </div>

        {/* Stats */}
        <DashboardStats />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Orders */}
          <div className="lg:col-span-2">
            <RecentOrders />
          </div>

          {/* Quick Actions */}
          <div>
            <QuickActions />
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
