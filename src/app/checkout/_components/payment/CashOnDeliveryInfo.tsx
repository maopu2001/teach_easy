"use client";

import { Truck } from "lucide-react";

export default function CashOnDeliveryInfo() {
  return (
    <div className="bg-muted/50 p-4 rounded-lg">
      <div className="flex items-start space-x-3">
        <Truck className="h-5 w-5 text-muted-foreground mt-0.5" />
        <div className="space-y-1">
          <p className="font-medium">Cash on Delivery</p>
          <p className="text-sm text-muted-foreground">
            Pay with cash when your order is delivered to your doorstep. Please
            keep the exact amount ready for faster delivery.
          </p>
          <p className="text-xs text-muted-foreground">
            Note: COD orders may take 1-2 additional business days for
            processing.
          </p>
        </div>
      </div>
    </div>
  );
}
