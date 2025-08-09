import AdminLayout from "@/components/admin/AdminLayout";
import ProductForm from "../_components/ProductForm";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Plus,
  Package,
} from "lucide-react";

export default function NewProductPage() {
  return (
    <AdminLayout>
      <div className="min-h-screen bg-gradient-to-br from-background via-card to-muted">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8">
          {/* Header Section */}
          <div className="relative">
            {/* Background decoration */}
            <div className="absolute -top-4 -right-4 w-24 h-24 bg-gradient-to-br from-muted to-accent rounded-full opacity-50 animate-pulse"></div>
            <div className="absolute -bottom-2 -left-2 w-16 h-16 bg-gradient-to-br from-secondary to-muted rounded-full opacity-30 animate-pulse delay-1000"></div>

            <div className="relative flex flex-col space-y-6 lg:flex-row lg:items-start lg:justify-between lg:space-y-0">
              {/* Left side - Main content */}
              <div className="flex flex-col sm:flex-row sm:items-start space-y-4 sm:space-y-0 sm:space-x-6">
                <div className="space-y-2">
                  {/* Breadcrumb */}
                  <nav className="flex items-center space-x-2 text-sm text-muted-foreground">
                    <span className="hover:text-foreground transition-colors cursor-pointer">
                      Products
                    </span>
                    <span>/</span>
                    <span className="text-foreground font-medium">
                      Add New Product
                    </span>
                  </nav>

                  {/* Title */}
                  <div className="flex items-center space-x-4">
                    <div className="relative">
                      <div className="p-3 bg-gradient-to-br from-primary to-accent rounded-xl shadow-lg">
                        <Plus className="h-6 w-6 sm:h-7 sm:w-7 text-primary-foreground" />
                      </div>
                      <div className="absolute -top-1 -right-1 w-4 h-4 bg-chart-2 rounded-full animate-ping"></div>
                      <div className="absolute -top-1 -right-1 w-4 h-4 bg-chart-2 rounded-full"></div>
                    </div>
                    <div>
                      <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground">
                        Add New Product
                      </h1>
                      <p className="text-sm sm:text-base text-muted-foreground mt-1 max-w-2xl">
                        Create a new product for your store with detailed
                        information and stunning visuals
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 xl:grid-cols-4 gap-6 lg:gap-8">
            {/* Main Form - Takes up most space */}
            <div className="xl:col-span-4 space-y-6">
              <Card className="shadow-lg border-0 bg-card/80 backdrop-blur-sm hover:shadow-xl transition-all duration-500">
                <CardHeader className="border-b bg-gradient-to-r from-muted to-secondary rounded-t-lg">
                  <CardTitle className="flex items-center gap-3 text-lg sm:text-xl">
                    <div className="p-2 bg-gradient-to-br from-primary/20 to-accent/20 rounded-lg">
                      <Package className="h-5 w-5 text-primary" />
                    </div>
                    Product Information
                  </CardTitle>
                  <p className="text-sm text-muted-foreground">
                    Fill in the details below to create your product. All
                    required fields must be completed.
                  </p>
                </CardHeader>
                <CardContent className="px-4 sm:px-6 lg:px-8 py-6">
                  <ProductForm />
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
