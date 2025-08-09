"use client";

import { useCart } from "@/store/cartStore";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { products } from "@/lib/testProducts";
import Image from "next/image";
import getPublicUrl from "@/lib/getPublicUrl";

export function OrderSummary({ form }: { form: any }) {
  const { cart } = useCart();

  const cartItems = cart.reduce((acc, itemId) => {
    const product = products.find((p) => p.id === itemId);
    if (product) {
      const existingItem = acc.find((item) => item.id === itemId);
      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        acc.push({ ...product, quantity: 1 });
      }
    }
    return acc;
  }, [] as Array<(typeof products)[0] & { quantity: number }>);

  // Calculate totals using actual product prices with discounts
  const subtotal = cartItems.reduce((sum, item) => {
    const discountedPrice =
      item.price - (item.price * item.discountInPercent) / 100;
    return sum + discountedPrice * item.quantity;
  }, 0);
  const shipping = form.watch("delivery.deliveryMethod") === "pickup" ? 0 : 60;
  const total = subtotal + shipping;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <span className="inline-flex items-center justify-center w-6 h-6 bg-primary text-white rounded-full text-sm font-bold">
            4
          </span>
          Order Overview
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 px-5">
        {cartItems.length === 0 ? (
          <p className="text-gray-500 text-center py-4">Your cart is empty</p>
        ) : (
          <>
            {/* Order Table */}
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 font-medium">Product</th>
                    <th className="text-right py-3 font-medium">Price</th>
                    <th className="text-right py-3 font-medium">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {cartItems.map((item) => {
                    const discountedPrice =
                      item.price - (item.price * item.discountInPercent) / 100;
                    const itemTotal = discountedPrice * item.quantity;

                    return (
                      <tr key={item.id} className="border-b">
                        <td className="py-3 flex items-center space-x-4">
                          <div className="relative size-16">
                            <Image
                              src={getPublicUrl(item.imageUrl) || item.imageUrl}
                              alt={item.name}
                              width={80}
                              height={80}
                              className="size-16 object-cover rounded"
                            />
                          </div>
                          <div className="font-medium text-sm">{item.name}</div>
                        </td>
                        <td className="pl-3 py-3 text-right text-sm text-nowrap">
                          {discountedPrice.toFixed(0)}৳ x {item.quantity}
                        </td>
                        <td className="pl-3 py-3 text-right font-medium text-nowrap">
                          {itemTotal.toFixed(0)}৳
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Summary */}
            <div className="mt-6 space-y-2">
              <div className="flex justify-between text-lg">
                <span>Sub-Total:</span>
                {subtotal.toFixed(0)}৳
              </div>

              <div className="flex justify-between text-base text-gray-600">
                <span>Shipping:</span>
                <span>{shipping.toFixed(0)}৳</span>
              </div>

              <Separator />

              <div className="flex justify-between text-xl font-bold">
                <span>Total:</span>
                <span>{total.toFixed(0)}৳</span>
              </div>
            </div>
          </>
        )}
      </CardContent>
      <div className="hidden md:block fixed bottom-10 right-10 bg-primary p-5 text-white rounded-xl animate-pulse">
        {total > 0 && <>Total: {total.toFixed(0)}৳</>}
      </div>
    </Card>
  );
}
