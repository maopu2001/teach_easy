"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { FormCheckbox } from "@/components/forms";
import {
  checkoutSchema,
  type CheckoutFormData,
} from "@/app/checkout/_actions/checkout-schemas";
import { toast } from "sonner";

// Import the new section components
import { CustomerInfoSection } from "./CustomerInfoSection";
import { PaymentMethodSection } from "./PaymentMethodSection";
import { DeliveryMethodSection } from "./DeliveryMethodSection";
// import { CouponSection } from "./CouponSection";
import { OrderSummary } from "./OrderSummary";

export function CheckoutForm() {
  const { data: session } = useSession();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<CheckoutFormData>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      shipping: {
        id: "",
      },
      billing: {
        sameAsShipping: true,
        id: "",
      },
      payment: {
        agreeToTerms: false,
      },
      delivery: {
        deliveryMethod: "standard",
      },
    },
  });

  const onSubmit = async (data: CheckoutFormData) => {
    setIsSubmitting(true);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000));

      console.log("Checkout data:", {
        ...data,
        userId: session?.user?.id,
      });

      toast.success(
        "Order placed successfully! You can track your order in your profile."
      );

      // Redirect to success page
      // router.push("/checkout/success");
    } catch (error) {
      console.error("Checkout error:", error);
      toast.error(
        "There was an error processing your order. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // const handleApplyCoupon = (code: string) => {
  //   console.log("Applying Coupon:", code);
  //   // Handle Coupon application logic
  // };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <CustomerInfoSection form={form} />

          <PaymentMethodSection form={form} />

          <DeliveryMethodSection form={form} />
        </div>

        {/* <CouponSection onApplyCoupon={handleApplyCoupon} /> */}

        <OrderSummary form={form} />

        <div className="flex items-center justify-center border p-4 rounded-xl">
          <FormCheckbox
            control={form.control}
            required
            name="payment.agreeToTerms"
            label="I agree to the terms and conditions"
            description="You must agree to the terms and conditions to proceed"
          />
        </div>

        <div className="flex justify-center">
          <Button
            type="submit"
            disabled={isSubmitting}
            className="min-w-48"
            size="lg"
          >
            {isSubmitting ? "Processing..." : "Place Order"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
