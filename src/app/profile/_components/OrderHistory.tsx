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
        return "bg-green-100 text-green-800";
      case "shipped":
        return "bg-blue-100 text-blue-800";
      case "processing":
        return "bg-yellow-100 text-yellow-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
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
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-900">Order History</h2>
        <div className="text-sm text-gray-600">
          Total Orders: {user.stats?.totalOrders || 0}
        </div>
      </div>

      {orders.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-gray-400 text-6xl mb-4">📦</div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No orders yet
          </h3>
          <p className="text-gray-600 mb-6">
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
              className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-medium text-gray-900">
                    Order #{order.id}
                  </h3>
                  <p className="text-sm text-gray-600">
                    Placed on {new Date(order.date).toLocaleDateString()}
                  </p>
                </div>
                <div className="text-right">
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                      order.status
                    )}`}
                  >
                    {getStatusText(order.status)}
                  </span>
                  <p className="text-lg font-semibold text-gray-900 mt-1">
                    ৳{order.total.toLocaleString()}
                  </p>
                </div>
              </div>

              <div className="border-t border-gray-200 pt-4">
                <h4 className="text-sm font-medium text-gray-900 mb-2">
                  Items ({order.items.length})
                </h4>
                <div className="space-y-2">
                  {order.items.map((item, index) => (
                    <div
                      key={index}
                      className="flex justify-between items-center text-sm"
                    >
                      <span className="text-gray-600">
                        {item.name} × {item.quantity}
                      </span>
                      <span className="font-medium text-gray-900">
                        ৳{item.price.toLocaleString()}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-200">
                <div className="flex space-x-3">
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
                  <Button size="sm">Reorder</Button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Order Summary */}
      {orders.length > 0 && (
        <div className="bg-gray-50 p-6 rounded-lg">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            Order Summary
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">
                {orders.length}
              </div>
              <div className="text-sm text-gray-600">Total Orders</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">
                {orders.filter((o) => o.status === "delivered").length}
              </div>
              <div className="text-sm text-gray-600">Delivered</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">
                ৳
                {orders
                  .reduce((sum, order) => sum + order.total, 0)
                  .toLocaleString()}
              </div>
              <div className="text-sm text-gray-600">Total Spent</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">
                ৳
                {Math.round(
                  orders.reduce((sum, order) => sum + order.total, 0) /
                    orders.length
                ).toLocaleString()}
              </div>
              <div className="text-sm text-gray-600">Avg. Order Value</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
