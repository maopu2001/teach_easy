"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { formatCurrency } from "@/lib/formatter";
import Image from "next/image";
import { ShoppingBag, Truck, Receipt } from "lucide-react";
import { Product } from "@/app/products/[id]/_components/ProductClientWrapper";

interface OrderSummaryProps {
  cartProducts: Product[];
  productQuantities: Record<string, number>;
  subtotal: number;
  shippingCost: number;
  tax: number;
  total: number;
}

export default function OrderSummary({
  cartProducts,
  productQuantities,
  subtotal,
  shippingCost,
  tax,
  total,
}: OrderSummaryProps) {
  return (
    <Card className="sticky top-24">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ShoppingBag className="w-5 h-5" />
          Order Summary
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Cart Items */}
        <div className="space-y-3">
          {cartProducts.map((product) => {
            if (!product) return null;

            const quantity = productQuantities[product.id] || 1;
            const discountPrice =
              product.price - (product.price * product.discountInPercent) / 100;
            const itemTotal = discountPrice * quantity;

            return (
              <div key={product.id} className="flex items-center gap-3">
                <div className="relative w-12 h-12 rounded-md overflow-hidden bg-muted flex-shrink-0">
                  <Image
                    src={product.imageUrl}
                    alt={product.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium line-clamp-1">
                    {product.name}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Qty: {quantity}
                  </p>
                  {product.discountInPercent > 0 && (
                    <p className="text-xs text-green-600">
                      -{product.discountInPercent}% off
                    </p>
                  )}
                </div>
                <div className="text-sm font-medium">
                  {formatCurrency(itemTotal)}
                </div>
              </div>
            );
          })}
        </div>

        <Separator />

        {/* Pricing Breakdown */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Subtotal</span>
            <span>{formatCurrency(subtotal)}</span>
          </div>

          <div className="flex justify-between text-sm">
            <div className="flex items-center gap-1">
              <Truck className="w-3 h-3" />
              <span>Shipping</span>
            </div>
            <span>
              {shippingCost === 0 ? (
                <span className="text-green-600">FREE</span>
              ) : (
                formatCurrency(shippingCost)
              )}
            </span>
          </div>

          <div className="flex justify-between text-sm">
            <div className="flex items-center gap-1">
              <Receipt className="w-3 h-3" />
              <span>Tax (5%)</span>
            </div>
            <span>{formatCurrency(tax)}</span>
          </div>

          {shippingCost === 0 && subtotal < 5000 && (
            <div className="text-xs text-muted-foreground p-2 bg-muted rounded">
              Add {formatCurrency(5000 - subtotal)} more for free shipping!
            </div>
          )}
        </div>

        <Separator />

        {/* Total */}
        <div className="flex justify-between font-semibold text-lg">
          <span>Total</span>
          <span>{formatCurrency(total)}</span>
        </div>

        {/* Security Badge */}
        <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
          <div className="flex items-center gap-2 text-sm text-green-800">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span>Secure checkout protected by SSL encryption</span>
          </div>
        </div>

        {/* Money Back Guarantee */}
        <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="text-sm text-blue-800">
            <p className="font-medium">30-Day Money Back Guarantee</p>
            <p className="text-xs mt-1">
              Not satisfied? Return within 30 days for a full refund.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
