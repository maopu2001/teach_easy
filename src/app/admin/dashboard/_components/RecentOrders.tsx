"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ExternalLink } from "lucide-react";

interface Order {
  _id: string;
  orderNumber: string;
  user: {
    fullName: string;
    email: string;
  };
  total: number;
  status: string;
  createdAt: string;
}

export default function RecentOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchRecentOrders() {
      try {
        setLoading(true);
        const response = await fetch("/api/admin/orders?page=1&limit=5");
        const data = await response.json();

        if (response.ok) {
          setOrders(data.orders);
        } else {
          throw new Error(data.error || "Failed to fetch recent orders");
        }
      } catch (error) {
        console.error("Error fetching recent orders:", error);
        // Fallback to empty array on error
        setOrders([]);
      } finally {
        setLoading(false);
      }
    }

    fetchRecentOrders();
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-chart-2/20 text-chart-2";
      case "shipped":
        return "bg-primary/20 text-primary";
      case "delivered":
        return "bg-chart-1/20 text-chart-1";
      case "cancelled":
        return "bg-destructive/20 text-destructive";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Recent Orders</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="flex justify-between items-center">
                  <div className="space-y-2 flex-1">
                    <div className="h-4 bg-muted rounded w-32"></div>
                    <div className="h-3 bg-muted rounded w-48"></div>
                  </div>
                  <div className="h-6 bg-muted rounded w-16"></div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Recent Orders</CardTitle>
        <Button asChild variant="outline" size="sm">
          <Link href="/admin/dashboard/orders">
            View All
            <ExternalLink className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {orders.map((order) => (
            <div
              key={order._id}
              className="flex items-center justify-between p-4 border rounded-lg"
            >
              <div className="space-y-1">
                <div className="flex items-center space-x-2">
                  <span className="font-medium">{order.orderNumber}</span>
                  <Badge className={getStatusColor(order.status)}>
                    {order.status}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">
                  {order.user.fullName} • {order.user.email}
                </p>
                <p className="text-xs text-muted-foreground">
                  {new Date(order.createdAt).toLocaleDateString()}
                </p>
              </div>
              <div className="text-right">
                <p className="font-bold text-foreground">${order.total}</p>
                <Button asChild variant="ghost" size="sm">
                  <Link href={`/admin/dashboard/orders/${order._id}`}>
                    View
                  </Link>
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
