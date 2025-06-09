"use client";

import { Checkbox } from "@/components/ui/checkbox";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Control } from "react-hook-form";
import { PaymentFormData } from "@/lib/checkout-schemas";

interface TermsAndConditionsProps {
  control: Control<PaymentFormData>;
}

export default function TermsAndConditions({
  control,
}: TermsAndConditionsProps) {
  return (
    <FormField
      control={control}
      name="agreeToTerms"
      render={({ field }) => (
        <FormItem className="flex flex-row items-start space-x-3 space-y-0">
          <FormControl>
            <Checkbox checked={field.value} onCheckedChange={field.onChange} />
          </FormControl>
          <div className="space-y-1 leading-none">
            <FormLabel className="text-sm font-normal inline-flex flex-wrap">
              <span className="text-nowrap">I agree to the </span>
              <a
                href="/terms"
                className="text-primary hover:underline text-nowrap"
              >
                Terms and Conditions
              </a>
              <span className="text-nowrap"> and </span>
              <a
                href="/privacy"
                className="text-primary hover:underline text-nowrap"
              >
                Privacy Policy
              </a>
            </FormLabel>
            <FormMessage />
          </div>
        </FormItem>
      )}
    />
  );
}
