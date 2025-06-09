"use client";

import { Shield } from "lucide-react";

export default function SecurityFeatures() {
  return (
    <div className="bg-green-50 dark:bg-green-950/20 p-4 rounded-lg">
      <div className="flex items-center space-x-2 mb-2">
        <Shield className="h-4 w-4 text-green-600" />
        <span className="text-sm font-medium text-green-700 dark:text-green-400">
          Your payment is secure
        </span>
      </div>
      <ul className="text-xs text-green-600 dark:text-green-400 space-y-1">
        <li>• SSL encrypted payment processing</li>
        <li>• 30-day money-back guarantee</li>
      </ul>
    </div>
  );
}
