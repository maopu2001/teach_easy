"use client";

import { Shield } from "lucide-react";

export default function SecurityNotice() {
  return (
    <div className="bg-green-50 dark:bg-green-950/20 p-4 rounded-lg">
      <div className="flex items-center space-x-2">
        <Shield className="h-5 w-5 text-green-600" />
        <div>
          <p className="text-sm font-medium text-green-700 dark:text-green-400">
            Secure Checkout
          </p>
          <p className="text-xs text-green-600 dark:text-green-400">
            Your order and payment information is protected with SSL encryption
          </p>
        </div>
      </div>
    </div>
  );
}
