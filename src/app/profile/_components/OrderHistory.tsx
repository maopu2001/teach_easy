"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

interface OrderHistoryProps {
  user: any;
}

// Mock order data for demonstration
const mockOrders = [
  {
    id: "ORD-001",
    date: "2024-06-15",
    status: "delivered",
    total: 2500,
    items: [
      { name: "Mathematics Workbook", quantity: 2, price: 800 },
      { name: "Science Kit", quantity: 1, price: 900 },
    ],
  },
  {
    id: "ORD-002",
    date: "2024-06-10",
    status: "processing",
    total: 1200,
    items: [
      { name: "English Grammar Guide", quantity: 1, price: 600 },
      { name: "History Atlas", quantity: 1, price: 600 },
    ],
  },
  {
    id: "ORD-003",
    date: "2024-06-05",
    status: "shipped",
    total: 3200,
    items: [
      { name: "Complete Physics Set", quantity: 1, price: 2200 },
      { name: "Calculator", quantity: 1, price: 1000 },
    ],
  },
];

export default function OrderHistory({ user }: OrderHistoryProps) {
  const [orders] = useState(mockOrders);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "delivered":
        return "bg-primary/10 text-primary";
      case "shipped":
        return "bg-accent text-accent-foreground";
      case "processing":
        return "bg-secondary text-secondary-foreground";
      case "cancelled":
        return "bg-destructive/10 text-destructive";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "delivered":
        return "Delivered";
      case "shipped":
        return "Shipped";
      case "processing":
        return "Processing";
      case "cancelled":
        return "Cancelled";
      default:
        return "Unknown";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <h2 className="text-xl font-semibold text-foreground">Order History</h2>
        <div className="text-sm text-muted-foreground">
          Total Orders: {user.stats?.totalOrders || 0}
        </div>
      </div>

      {orders.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-muted-foreground text-4xl sm:text-6xl mb-4">
            📦
          </div>
          <h3 className="text-lg font-medium text-foreground mb-2">
            No orders yet
          </h3>
          <p className="text-muted-foreground mb-6 max-w-md mx-auto">
            You haven&apos;t placed any orders yet. Start shopping to see your
            orders here.
          </p>
          <Button>Start Shopping</Button>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div
              key={order.id}
              className="bg-card border border-border rounded-lg p-4 sm:p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4 mb-4">
                <div className="min-w-0 flex-1">
                  <h3 className="text-lg font-medium text-foreground truncate">
                    Order #{order.id}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Placed on {new Date(order.date).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex flex-col sm:items-end gap-2">
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                      order.status
                    )}`}
                  >
                    {getStatusText(order.status)}
                  </span>
                  <p className="text-lg font-semibold text-foreground">
                    ৳{order.total.toLocaleString()}
                  </p>
                </div>
              </div>

              <div className="border-t border-border pt-4">
                <h4 className="text-sm font-medium text-foreground mb-2">
                  Items ({order.items.length})
                </h4>
                <div className="space-y-2">
                  {order.items.map((item, index) => (
                    <div
                      key={index}
                      className="flex justify-between items-center text-sm"
                    >
                      <span className="text-muted-foreground truncate pr-2">
                        {item.name} × {item.quantity}
                      </span>
                      <span className="font-medium text-foreground flex-shrink-0">
                        ৳{item.price.toLocaleString()}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mt-4 pt-4 border-t border-border">
                <div className="flex flex-wrap gap-2">
                  <Button variant="outline" size="sm">
                    View Details
                  </Button>
                  {order.status === "delivered" && (
                    <Button variant="outline" size="sm">
                      Leave Review
                    </Button>
                  )}
                  {order.status === "processing" && (
                    <Button variant="outline" size="sm">
                      Cancel Order
                    </Button>
                  )}
                </div>
                {order.status === "delivered" && (
                  <Button size="sm" className="w-full sm:w-auto">
                    Reorder
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Order Summary */}
      {orders.length > 0 && (
        <div className="bg-muted p-4 sm:p-6 rounded-lg">
          <h3 className="text-lg font-medium text-foreground mb-4">
            Order Summary
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-xl sm:text-2xl font-bold text-foreground">
                {orders.length}
              </div>
              <div className="text-xs sm:text-sm text-muted-foreground">
                Total Orders
              </div>
            </div>
            <div className="text-center">
              <div className="text-xl sm:text-2xl font-bold text-foreground">
                {orders.filter((o) => o.status === "delivered").length}
              </div>
              <div className="text-xs sm:text-sm text-muted-foreground">
                Delivered
              </div>
            </div>
            <div className="text-center">
              <div className="text-xl sm:text-2xl font-bold text-foreground">
                ৳
                {orders
                  .reduce((sum, order) => sum + order.total, 0)
                  .toLocaleString()}
              </div>
              <div className="text-xs sm:text-sm text-muted-foreground">
                Total Spent
              </div>
            </div>
            <div className="text-center">
              <div className="text-xl sm:text-2xl font-bold text-foreground">
                ৳
                {Math.round(
                  orders.reduce((sum, order) => sum + order.total, 0) /
                    orders.length
                ).toLocaleString()}
              </div>
              <div className="text-xs sm:text-sm text-muted-foreground">
                Avg. Order Value
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
