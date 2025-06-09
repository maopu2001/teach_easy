"use client";

import { useEffect } from "react";
import { CheckCircle, Package, Truck, CreditCard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";

export default function CheckoutSuccessPage() {
  // Generate a random order number for demo
  const orderNumber = `TE${Math.random().toString().slice(2, 8)}`;

  useEffect(() => {
    // Scroll to top when page loads
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
          <CheckCircle className="w-8 h-8 text-green-600" />
        </div>
        <h1 className="text-3xl font-bold text-green-600 mb-2">
          Order Placed Successfully!
        </h1>
        <p className="text-muted-foreground">
          Thank you for your purchase. Your order has been confirmed and is
          being processed.
        </p>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Order Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Order Number</p>
              <p className="font-mono text-lg">{orderNumber}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Order Date</p>
              <p>
                {new Date().toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            </div>
          </div>

          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-blue-800">
              <strong>Order confirmation email</strong> has been sent to your
              email address. Please check your inbox (and spam folder) for the
              confirmation details.
            </p>
          </div>
        </CardContent>
      </Card>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>What&apos;s Next?</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="flex items-center justify-center w-8 h-8 bg-blue-100 rounded-full flex-shrink-0">
                <Package className="w-4 h-4 text-blue-600" />
              </div>
              <div>
                <p className="font-medium">Order Processing</p>
                <p className="text-sm text-muted-foreground">
                  We&apos;re preparing your order. This usually takes 1-2
                  business days.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full flex-shrink-0">
                <Truck className="w-4 h-4 text-orange-600" />
              </div>
              <div>
                <p className="font-medium">Shipping</p>
                <p className="text-sm text-muted-foreground">
                  Once shipped, you&apos;ll receive a tracking number via email.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="flex items-center justify-center w-8 h-8 bg-green-100 rounded-full flex-shrink-0">
                <CheckCircle className="w-4 h-4 text-green-600" />
              </div>
              <div>
                <p className="font-medium">Delivery</p>
                <p className="text-sm text-muted-foreground">
                  Your order will arrive within the estimated delivery time.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid md:grid-cols-2 gap-4 mb-8">
        <Card>
          <CardContent className="p-6 text-center">
            <CreditCard className="w-8 h-8 text-blue-600 mx-auto mb-3" />
            <h3 className="font-medium mb-2">Need Help?</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Have questions about your order? Our support team is here to help.
            </p>
            <Button variant="outline" asChild>
              <Link href="/contact">Contact Support</Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 text-center">
            <Package className="w-8 h-8 text-green-600 mx-auto mb-3" />
            <h3 className="font-medium mb-2">Track Your Order</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Once shipped, you can track your order status online.
            </p>
            <Button variant="outline" disabled>
              Track Order (Available Soon)
            </Button>
          </CardContent>
        </Card>
      </div>

      <div className="text-center space-y-4">
        <div className="space-x-4">
          <Button asChild>
            <Link href="/products">Continue Shopping</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/">Back to Home</Link>
          </Button>
        </div>

        <p className="text-sm text-muted-foreground">
          Order reference: {orderNumber} |
          <Link href="/returns" className="text-primary hover:underline ml-1">
            Return Policy
          </Link>
        </p>
      </div>
    </div>
  );
}
