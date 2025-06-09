"use client";

import { Input } from "@/components/ui/input";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Shield } from "lucide-react";
import { Control } from "react-hook-form";
import { PaymentFormData } from "@/lib/checkout-schemas";

interface CardPaymentFieldsProps {
  control: Control<PaymentFormData>;
}

export default function CardPaymentFields({ control }: CardPaymentFieldsProps) {
  return (
    <div className="space-y-4 max-w-150">
      <div className="flex items-center space-x-2 text-sm text-muted-foreground">
        <Shield className="h-4 w-4" />
        <span>Your payment information is secure and encrypted</span>
      </div>

      <FormField
        control={control}
        name="cardholderName"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Cardholder Name</FormLabel>
            <FormControl>
              <Input placeholder="John Doe" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="cardNumber"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Card Number</FormLabel>
            <FormControl>
              <Input
                placeholder="1234 5678 9012 3456"
                {...field}
                onChange={(e) => {
                  // Format card number with spaces
                  const value = e.target.value.replace(/\s/g, "");
                  const formattedValue = value.replace(/(.{4})/g, "$1 ");
                  field.onChange(formattedValue.trim());
                }}
                maxLength={19}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <div className="grid grid-cols-2 gap-4">
        <FormField
          control={control}
          name="expiryDate"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Expiry Date</FormLabel>
              <FormControl>
                <Input
                  placeholder="MM/YY"
                  {...field}
                  onChange={(e) => {
                    // Format expiry date
                    const value = e.target.value.replace(/\D/g, "");
                    if (value.length >= 2) {
                      field.onChange(
                        value.slice(0, 2) + "/" + value.slice(2, 4)
                      );
                    } else {
                      field.onChange(value);
                    }
                  }}
                  maxLength={5}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="cvv"
          render={({ field }) => (
            <FormItem>
              <FormLabel>CVV</FormLabel>
              <FormControl>
                <Input
                  placeholder="123"
                  {...field}
                  onChange={(e) => {
                    // Only allow numbers
                    const value = e.target.value.replace(/\D/g, "");
                    field.onChange(value);
                  }}
                  maxLength={4}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  );
}
