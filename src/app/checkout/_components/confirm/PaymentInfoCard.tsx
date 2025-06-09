"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Edit, CreditCard } from "lucide-react";
import { PaymentFormData } from "@/lib/checkout-schemas";

interface PaymentInfoCardProps {
  paymentData: PaymentFormData;
  onEdit: () => void;
}

export default function PaymentInfoCard({
  paymentData,
  onEdit,
}: PaymentInfoCardProps) {
  const getPaymentMethodDisplay = (method: string) => {
    const methods: Record<string, string> = {
      card: "Credit/Debit Card",
      bkash: "bKash",
      nagad: "Nagad",
      cod: "Cash on Delivery",
    };
    return methods[method] || method;
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
        <CardTitle className="text-lg flex items-center">
          <CreditCard className="h-5 w-5 mr-2" />
          Payment Information
        </CardTitle>
        <Button variant="ghost" size="sm" onClick={onEdit} className="h-8 px-2">
          <Edit className="h-4 w-4 mr-1" />
          Edit
        </Button>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="space-y-2">
          <p className="font-medium">
            {getPaymentMethodDisplay(paymentData.paymentMethod)}
          </p>

          {paymentData.paymentMethod === "card" && paymentData.cardNumber && (
            <div className="text-sm text-muted-foreground">
              <p>**** **** **** {paymentData.cardNumber.slice(-4)}</p>
              <p>{paymentData.cardholderName}</p>
            </div>
          )}

          {["bkash", "nagad"].includes(paymentData.paymentMethod) &&
            paymentData.mobileNumber && (
              <p className="text-sm text-muted-foreground">
                {paymentData.mobileNumber}
              </p>
            )}

          {paymentData.paymentMethod === "cod" && (
            <p className="text-sm text-muted-foreground">
              Pay with cash upon delivery
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
