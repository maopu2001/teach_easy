"use client";

import {
  BillingFormData,
  ShippingFormData,
  PaymentFormData,
} from "@/lib/checkout-schemas";
import BillingInfoCard from "./BillingInfoCard";
import ShippingInfoCard from "./ShippingInfoCard";
import PaymentInfoCard from "./PaymentInfoCard";
import SecurityNotice from "./SecurityNotice";
import OrderActionButtons from "./OrderActionButtons";

interface ConfirmFormProps {
  billingData: BillingFormData;
  shippingData: ShippingFormData;
  paymentData: PaymentFormData;
  onBack: () => void;
  onPlaceOrder: () => void;
  onEditStep: (step: number) => void;
  isPlacingOrder?: boolean;
}

export default function ConfirmForm({
  billingData,
  shippingData,
  paymentData,
  onBack,
  onPlaceOrder,
  onEditStep,
  isPlacingOrder = false,
}: ConfirmFormProps) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold mb-2">Review Your Order</h2>
        <p className="text-muted-foreground">
          Please review all the details before placing your order.
        </p>
      </div>

      <div className="grid gap-6">
        <BillingInfoCard
          billingData={billingData}
          onEdit={() => onEditStep(1)}
        />

        <ShippingInfoCard
          shippingData={shippingData}
          billingData={billingData}
          onEdit={() => onEditStep(2)}
        />

        <PaymentInfoCard
          paymentData={paymentData}
          onEdit={() => onEditStep(3)}
        />

        <SecurityNotice />
      </div>

      <OrderActionButtons
        onBack={onBack}
        onPlaceOrder={onPlaceOrder}
        isPlacingOrder={isPlacingOrder}
      />
    </div>
  );
}
