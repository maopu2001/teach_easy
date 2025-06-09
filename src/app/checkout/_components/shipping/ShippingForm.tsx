"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";
import { ShippingFormData } from "@/lib/checkout-schemas";
import ShippingAddressFields from "./ShippingAddressFields";
import ShippingMethodSelector from "./ShippingMethodSelector";

// Create a custom schema for the form that properly handles defaults
const shippingFormSchema = z
  .object({
    sameAsBilling: z.boolean(),
    fullName: z.string().optional(),
    address: z.string().optional(),
    city: z.string().optional(),
    state: z.string().optional(),
    zipCode: z.string().optional(),
    country: z.string().optional(),
    shippingMethod: z.enum(["standard", "express", "overnight"]),
  })
  .refine(
    (data) => {
      if (!data.sameAsBilling) {
        return (
          data.fullName &&
          data.address &&
          data.city &&
          data.state &&
          data.zipCode &&
          data.country
        );
      }
      return true;
    },
    {
      message:
        "All shipping fields are required when not using billing address",
      path: ["fullName"],
    }
  );

type ShippingFormValues = z.infer<typeof shippingFormSchema>;

interface ShippingFormProps {
  onSubmit: (data: ShippingFormData) => void;
  onBack: () => void;
  defaultValues?: Partial<ShippingFormData>;
}

export default function ShippingForm({
  onSubmit,
  onBack,
  defaultValues,
}: ShippingFormProps) {
  const [selectedDivision, setSelectedDivision] = useState<string>(
    defaultValues?.state || ""
  );

  const form = useForm<ShippingFormValues>({
    resolver: zodResolver(shippingFormSchema),
    defaultValues: {
      sameAsBilling: defaultValues?.sameAsBilling ?? false,
      fullName: defaultValues?.fullName ?? "",
      address: defaultValues?.address ?? "",
      city: defaultValues?.city ?? "",
      state: defaultValues?.state ?? "",
      zipCode: defaultValues?.zipCode ?? "",
      country: defaultValues?.country ?? "",
      shippingMethod: defaultValues?.shippingMethod ?? "standard",
    },
  });

  const handleDivisionChange = (division: string) => {
    setSelectedDivision(division);
    form.setValue("state", division);
    form.setValue("city", ""); // Reset city when division changes
  };

  const handleSubmit = (data: ShippingFormValues) => {
    // Convert form data to the expected ShippingFormData type
    onSubmit(data as ShippingFormData);
  };

  const sameAsBilling = form.watch("sameAsBilling");

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold mb-2">Shipping Information</h2>
        <p className="text-muted-foreground">
          Choose where you&apos;d like your order to be delivered.
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
          {/* Same as Billing Checkbox */}
          <FormField
            control={form.control}
            name="sameAsBilling"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel className="text-sm font-medium">
                    Ship to the same address as billing
                  </FormLabel>
                  <FormLabel className="text-sm text-muted-foreground">
                    Use your billing address for shipping
                  </FormLabel>
                </div>
              </FormItem>
            )}
          />

          {/* Shipping Address Fields (only show if not same as billing) */}
          {!sameAsBilling && (
            <ShippingAddressFields
              control={form.control}
              selectedDivision={selectedDivision}
              onDivisionChange={handleDivisionChange}
            />
          )}

          {/* Shipping Method */}
          <ShippingMethodSelector control={form.control} />

          <div className="flex justify-between pt-4">
            <Button type="button" variant="outline" onClick={onBack}>
              Back to Billing
            </Button>
            <Button type="submit" className="px-8">
              Continue to Payment
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
