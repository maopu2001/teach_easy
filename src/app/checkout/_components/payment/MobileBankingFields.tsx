"use client";

import { Input } from "@/components/ui/input";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Smartphone } from "lucide-react";
import { Control } from "react-hook-form";
import { PaymentFormData } from "@/lib/checkout-schemas";

interface MobileBankingFieldsProps {
  control: Control<PaymentFormData>;
  selectedPaymentMethod: string;
}

export default function MobileBankingFields({
  control,
  selectedPaymentMethod,
}: MobileBankingFieldsProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2 text-sm text-muted-foreground">
        <Smartphone className="h-4 w-4" />
        <span>
          You will be redirected to {selectedPaymentMethod.toUpperCase()} to
          complete payment
        </span>
      </div>

      <FormField
        control={control}
        name="mobileNumber"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Mobile Number</FormLabel>
            <FormControl>
              <Input placeholder="+880 1234 567890" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}
