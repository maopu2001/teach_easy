"use client";

import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Package, ShoppingCart, Users, Settings } from "lucide-react";

export default function QuickActions() {
  const actions = [
    {
      title: "Add Product",
      description: "Create a new product",
      href: "/admin/dashboard/products/new",
      icon: Plus,
      color: "bg-primary hover:bg-primary/90",
    },
    {
      title: "View Products",
      description: "Manage your products",
      href: "/admin/dashboard/products",
      icon: Package,
      color: "bg-chart-2 hover:bg-chart-2/90",
    },
    {
      title: "View Orders",
      description: "Check recent orders",
      href: "/admin/dashboard/orders",
      icon: ShoppingCart,
      color: "bg-chart-3 hover:bg-chart-3/90",
    },
    {
      title: "Manage Users",
      description: "View and manage users",
      href: "/admin/dashboard/users",
      icon: Users,
      color: "bg-chart-4 hover:bg-chart-4/90",
    },
    {
      title: "Site Settings",
      description: "Configure site settings",
      href: "/admin/site-settings",
      icon: Settings,
      color: "bg-muted hover:bg-muted/90",
    },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Quick Actions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {actions.map((action, index) => (
            <Button
              key={index}
              asChild
              variant="outline"
              className="w-full justify-start h-auto p-4"
            >
              <Link href={action.href}>
                <div className={`p-2 rounded-md mr-3 ${action.color}`}>
                  <action.icon className="h-4 w-4 text-white" />
                </div>
                <div className="text-left">
                  <div className="font-medium text-foreground">
                    {action.title}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {action.description}
                  </div>
                </div>
              </Link>
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
