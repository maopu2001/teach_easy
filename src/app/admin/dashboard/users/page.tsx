import AdminLayout from "@/components/admin/AdminLayout";

export default function UsersPage() {
  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Users</h1>
          <p className="text-muted-foreground">
            Manage customer accounts and user data
          </p>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
          <div className="mx-auto max-w-md">
            <h3 className="text-lg font-medium text-foreground mb-2">
              User Management
            </h3>
            <p className="text-muted-foreground mb-4">
              User management functionality will be implemented here. This will
              include viewing user accounts, managing user roles, and monitoring
              user activity.
            </p>
            <div className="space-y-2 text-sm text-muted-foreground">
              <p>• View all registered users</p>
              <p>• Edit user profiles and roles</p>
              <p>• Monitor user activity</p>
              <p>• Manage user permissions</p>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
