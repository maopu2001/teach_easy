"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { PaymentMethod } from "@/types";

interface PaymentMethodSectionProps {
  form: any;
}

const paymentMethods = [
  { value: "card", label: "Credit/Debit Card" },
  { value: "bank_transfer", label: "Bank Transfer" },
  { value: "bkash", label: "bKash" },
  { value: "nagad", label: "Nagad" },
  { value: "cod", label: "Cash on Delivery" },
];

export function PaymentMethodSection({ form }: PaymentMethodSectionProps) {
  const handlePaymentMethodChange = (value: string) => {
    form.setValue("payment.paymentMethod", value as PaymentMethod);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <span className="inline-flex items-center justify-center w-6 h-6 bg-primary text-white rounded-full text-sm font-bold">
            2
          </span>
          Payment Method
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 px-5">
        <h2 className="text-sm text-muted-foreground mb-4">
          Select a payment method
        </h2>
        <RadioGroup className="gap-0" onValueChange={handlePaymentMethodChange}>
          {paymentMethods.map((method) => (
            <div
              key={method.value}
              className={`flex items-center space-x-2 rounded-md px-3 py-2 ${
                method.value === form.watch("payment.paymentMethod")
                  ? "bg-primary/30"
                  : ""
              }`}
            >
              <RadioGroupItem value={method.value} id={method.value} />
              <Label className="w-full cursor-pointer" htmlFor={method.value}>
                {method.label}
              </Label>
            </div>
          ))}
        </RadioGroup>
      </CardContent>
    </Card>
  );
}
