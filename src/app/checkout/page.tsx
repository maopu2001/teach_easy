"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/store/cartStore";
import { products } from "@/lib/testProducts";
import { CheckoutSteps, CheckoutBreadcrumb, CheckoutForm } from "./_components";
import { toast } from "sonner";
import OrderSummary from "./_components/OrderSummary";
import {
  BillingFormData,
  ShippingFormData,
  PaymentFormData,
} from "@/lib/checkout-schemas";
import { Product } from "../products/[id]/_components/ProductClientWrapper";

export default function CheckoutPage() {
  const { cart, clearCart, _hasHydrated } = useCart();
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [orderData, setOrderData] = useState<{
    billing?: BillingFormData;
    shipping?: ShippingFormData;
    payment?: PaymentFormData;
  }>({});

  // Get cart products and quantities
  const productQuantities = cart.reduce((acc: Record<string, number>, id) => {
    acc[id] = (acc[id] || 0) + 1;
    return acc;
  }, {});

  const cartProducts = Object.keys(productQuantities)
    .map((id) => products.find((p) => p.id === id))
    .filter(Boolean) as Product[];

  // Calculate totals
  const subtotal = cartProducts.reduce((total, product) => {
    if (!product) return total;
    const discountPrice =
      product.price - (product.price * product.discountInPercent) / 100;
    const qty = productQuantities[product.id] || 1;
    return total + discountPrice * qty;
  }, 0);

  const shippingCost = subtotal >= 5000 ? 0 : 599; // Free shipping over 50 BDT
  const taxRate = 0.05; // 5% tax
  const tax = subtotal * taxRate;
  const total = subtotal + shippingCost + tax;

  // Wait for cart to be hydrated from localStorage
  useEffect(() => {
    if (_hasHydrated) {
      console.log("Cart contents:", cart);
      console.log("Cart length:", cart.length);
    }
  }, [cart, _hasHydrated]);

  // Redirect if cart is empty (only after hydration)
  useEffect(() => {
    if (_hasHydrated && cart.length === 0) {
      toast.error("Your cart is empty. Please add items before checkout.");
      router.push("/products");
    }
  }, [cart.length, router, _hasHydrated]);

  // Check for out of stock items (only after hydration)
  useEffect(() => {
    if (_hasHydrated) {
      const outOfStockItems = cartProducts.filter(
        (product) => product?.isOutOfStock
      );

      if (outOfStockItems.length > 0) {
        toast.error(
          "Some items in your cart are out of stock. Please review your cart."
        );
        router.push("/products");
      }
    }
  }, [cartProducts, router, _hasHydrated]);

  const handleStepComplete = (
    stepData: BillingFormData | ShippingFormData | PaymentFormData,
    step: number
  ) => {
    if (step === 1) {
      setOrderData({ ...orderData, billing: stepData as BillingFormData });
    } else if (step === 2) {
      setOrderData({ ...orderData, shipping: stepData as ShippingFormData });
    } else if (step === 3) {
      setOrderData({ ...orderData, payment: stepData as PaymentFormData });
    }

    if (step < 4) {
      setCurrentStep(step + 1);
    }
  };

  const handlePlaceOrder = async () => {
    try {
      // Simulate order processing
      toast.loading("Processing your order...");
      await new Promise((resolve) => setTimeout(resolve, 2000));
      clearCart();
      toast.success("Order placed successfully!");

      // Navigate to order confirmation
      router.push("/checkout/success");
    } catch {
      toast.error("Failed to place order. Please try again.");
    }
  };

  if (!_hasHydrated) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="animate-pulse">
          <div className="h-8 bg-muted rounded w-1/4 mb-4"></div>
          <div className="h-6 bg-muted rounded w-1/3 mb-8"></div>
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <div className="h-64 bg-muted rounded"></div>
            </div>
            <div className="h-96 bg-muted rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (cart.length === 0) {
    return null; // Will redirect in useEffect
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <CheckoutBreadcrumb />

      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Checkout</h1>
        <p className="text-muted-foreground">Complete your purchase securely</p>
      </div>

      <CheckoutSteps currentStep={currentStep} />

      <div className="grid lg:grid-cols-3 gap-8 mt-8">
        {/* Checkout Form */}
        <div className="lg:col-span-2 order-2 lg:order-1">
          <CheckoutForm
            currentStep={currentStep}
            onStepComplete={handleStepComplete}
            onPlaceOrder={handlePlaceOrder}
            orderData={orderData}
            setCurrentStep={setCurrentStep}
          />
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1 order-1 lg:order-2">
          <OrderSummary
            cartProducts={cartProducts}
            productQuantities={productQuantities}
            subtotal={subtotal}
            shippingCost={shippingCost}
            tax={tax}
            total={total}
          />
        </div>
      </div>
    </div>
  );
}
