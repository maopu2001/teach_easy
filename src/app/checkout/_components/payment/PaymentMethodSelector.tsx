"use client";

import { Card, CardContent } from "@/components/ui/card";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Control } from "react-hook-form";
import { PaymentFormData } from "@/lib/checkout-schemas";

interface PaymentMethod {
  id: string;
  icon: React.ComponentType;
}

interface PaymentMethodSelectorProps {
  control: Control<PaymentFormData>;
  paymentMethods: PaymentMethod[];
}

export default function PaymentMethodSelector({
  control,
  paymentMethods,
}: PaymentMethodSelectorProps) {
  return (
    <FormField
      control={control}
      name="paymentMethod"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Payment Method</FormLabel>
          <FormControl>
            <div className="grid grid-cols-2 [@media(width>=25rem)]:grid-cols-4 gap-2 w-fit">
              {paymentMethods.map((method) => {
                const Icon = method.icon;
                return (
                  <Card
                    key={method.id}
                    className={`overflow-hidden max-w-40 cursor-pointer transition-all p-0 h-20 min-h-0 ${
                      field.value === method.id
                        ? "ring-3 ring-primary bg-primary/5 dark:bg-white/80"
                        : "hover:bg-white/30 bg-white/50"
                    }`}
                    onClick={() => field.onChange(method.id)}
                  >
                    <CardContent className="flex items-center p-2 h-full object-contain">
                      <Icon />
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
