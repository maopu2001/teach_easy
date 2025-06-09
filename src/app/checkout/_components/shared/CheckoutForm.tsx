"use client";

import { useState } from "react";
import { toast } from "sonner";
import BillingForm from "./BillingForm";
import ShippingForm from "../shipping/ShippingForm";
import PaymentForm from "../payment/PaymentForm";
import ReviewForm from "../confirm/ConfirmForm";
import {
  BillingFormData,
  ShippingFormData,
  PaymentFormData,
} from "@/lib/checkout-schemas";

interface CheckoutFormProps {
  currentStep: number;
  onStepComplete: (
    data: BillingFormData | ShippingFormData | PaymentFormData,
    step: number
  ) => void;
  onPlaceOrder: () => void;
  orderData: {
    billing?: BillingFormData;
    shipping?: ShippingFormData;
    payment?: PaymentFormData;
  };
  setCurrentStep: (step: number) => void;
}

export default function CheckoutForm({
  currentStep,
  onStepComplete,
  onPlaceOrder,
  orderData,
  setCurrentStep,
}: CheckoutFormProps) {
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);

  const handleBillingSubmit = (data: BillingFormData) => {
    onStepComplete(data, 1);
    toast.success("Billing information saved");
  };

  const handleShippingSubmit = (data: ShippingFormData) => {
    onStepComplete(data, 2);
    toast.success("Shipping information saved");
  };

  const handlePaymentSubmit = (data: PaymentFormData) => {
    onStepComplete(data, 3);
    toast.success("Payment information saved");
  };

  const handlePlaceOrder = async () => {
    setIsPlacingOrder(true);
    try {
      await onPlaceOrder();
    } finally {
      setIsPlacingOrder(false);
    }
  };

  const handleEditStep = (step: number) => {
    setCurrentStep(step);
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <BillingForm
            onSubmit={handleBillingSubmit}
            defaultValues={orderData.billing}
          />
        );

      case 2:
        return (
          <ShippingForm
            onSubmit={handleShippingSubmit}
            onBack={() => setCurrentStep(1)}
            defaultValues={orderData.shipping}
          />
        );

      case 3:
        return (
          <PaymentForm
            onSubmit={handlePaymentSubmit}
            onBack={() => setCurrentStep(2)}
            defaultValues={orderData.payment}
          />
        );

      case 4:
        return (
          <ReviewForm
            billingData={orderData.billing!}
            shippingData={orderData.shipping!}
            paymentData={orderData.payment!}
            onBack={() => setCurrentStep(3)}
            onPlaceOrder={handlePlaceOrder}
            onEditStep={handleEditStep}
            isPlacingOrder={isPlacingOrder}
          />
        );

      default:
        return null;
    }
  };

  return <div className="space-y-6">{renderStep()}</div>;
}
