"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Form } from "@/components/ui/form";
import { z } from "zod";
import { FormCheckbox, FormInput, FormSelect } from "./forms";
import { districts, Division } from "@/types";
import { useEffect, useState } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "./ui/accordion";
import { Button } from "./ui/button";

const addressSchema = z.object({
  fullName: z.string().min(1, "Full name is required"),
  phone: z
    .string()
    .regex(
      /^(\+8801|01|\+8809)[3-9]\d{8}$/,
      "Please enter a valid Bangladeshi phone number"
    ),
  email: z.string().email("Invalid email address"),

  addressLine: z.string().min(1, "Address line is required"),
  division: z.string().min(1, "Division is required"),
  district: z.string().min(1, "District is required"),
  cityOrUpazila: z.string().min(1, "City/Upazila is required"),
  postalCode: z
    .string()
    .regex(/^[1-9]\d{3}$/, "Please enter a valid Bangladeshi postal code")
    .optional()
    .or(z.literal("")),

  alternatePhone: z
    .string()
    .regex(
      /^(\+8801|01|\+8809)[3-9]\d{8}$/,
      "Please enter a valid Bangladeshi phone number"
    )
    .optional()
    .or(z.literal("")),
  landmark: z
    .string()
    .min(1, "Landmark is required")
    .optional()
    .or(z.literal("")),
  bestTimeToDeliver: z.string().min(1, "Best time to deliver is required"),
  isDefault: z.boolean().optional(),
});

export type AddressFormData = z.infer<typeof addressSchema>;
export const deliveryTimes = [
  {
    value: "anytime",
    label: "Anytime",
  },
  {
    value: "morning",
    label: "Morning (8:00 AM - 12:00 PM)",
  },
  {
    value: "afternoon",
    label: "Afternoon (12:00 PM - 5:00 PM)",
  },
  {
    value: "evening",
    label: "Evening (5:00 PM - 9:00 PM)",
  },
];

type AddressFormProps = {
  submitText?: string;
  onSubmit: (data: AddressFormData) => void;
  onClose: () => void;
  defaultValues?: AddressFormData;
};

function AddressForm({
  submitText = "Save Address",
  onSubmit,
  onClose,
  defaultValues,
}: AddressFormProps) {
  const form = useForm<AddressFormData>({
    resolver: zodResolver(addressSchema),
    defaultValues: defaultValues || {
      fullName: "",
      phone: "",
      email: "",
      addressLine: "",
      division: "Dhaka",
      district: "",
      cityOrUpazila: "",
      postalCode: "",
      alternatePhone: "",
      landmark: "",
      bestTimeToDeliver: "anytime",
      isDefault: false,
    },
  });

  const [filteredDistricts, setFilteredDistricts] = useState<string[]>(
    districts["Dhaka"]
  );

  const division = form.watch("division") as Division;

  useEffect(() => {
    setFilteredDistricts(districts[division]);
  }, [division]);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-0">
        <div className="bg-card p-4 mt-0 m-4 rounded-md grid grid-cols-1 sm:grid-cols-2 gap-4">
          <h1 className="sm:col-span-2 text-lg font-semibold -mb-2">
            Personal Information
          </h1>
          <FormInput
            className="sm:col-span-2"
            control={form.control}
            name="fullName"
            label="Full Name"
            type="text"
            placeholder="Enter your full name"
            required
          />
          <FormInput
            control={form.control}
            name="phone"
            label="Phone"
            type="text"
            placeholder="Enter your phone no"
            required
          />
          <FormInput
            control={form.control}
            name="email"
            label="Email"
            type="email"
            placeholder="Enter your email address"
            required
          />
        </div>

        <div className="bg-card p-4 m-4 rounded-md grid grid-cols-1 sm:grid-cols-2 gap-4">
          <h1 className="text-lg sm:col-span-2 font-semibold -mb-2">
            Customer&apos;s Address
          </h1>

          <FormInput
            className="sm:col-span-2"
            control={form.control}
            name="addressLine"
            label="Address"
            type="text"
            placeholder="Enter your road.... need changes"
            required
          />
          <FormSelect
            control={form.control}
            name="division"
            label="Division"
            options={Object.keys(districts).map((div) => ({
              value: div,
              label: div,
            }))}
            required
          />

          <FormSelect
            control={form.control}
            name="district"
            label="District"
            options={filteredDistricts.map((dis) => ({
              value: dis,
              label: dis,
            }))}
            required
          />

          <FormInput
            control={form.control}
            name="cityOrUpazila"
            label="City or Upazila"
            type="text"
            placeholder="Enter City or Upazila"
            required
          />

          <FormInput
            control={form.control}
            name="postalCode"
            label="Postal Code"
            type="text"
            placeholder="Enter Postal Code"
          />
        </div>

        <Accordion
          type="single"
          collapsible
          className="bg-card m-4 rounded-md p-0"
        >
          <AccordionItem value="item-1" className="w-full py-0">
            <AccordionTrigger className="p-4 text-lg font-semibold sm:col-span-2 w-full hover:no-underline cursor-pointer">
              Optional Information
            </AccordionTrigger>
            <AccordionContent className="px-4 pb-4 mt-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormInput
                control={form.control}
                name="alternatePhone"
                label="Alternate Phone"
                type="text"
                placeholder="Enter an alternate phone no"
              />

              <FormSelect
                control={form.control}
                name="bestTimeToDeliver"
                label="Preferred time for delivery"
                options={deliveryTimes}
              />

              <FormInput
                className="sm:col-span-2"
                control={form.control}
                name="landmark"
                label="Landmark"
                type="text"
                placeholder="Enter a landmark for better accurate location"
              />
            </AccordionContent>
          </AccordionItem>
        </Accordion>

        <div className="bg-card p-4 m-4 rounded-md grid gap-4">
          <FormCheckbox
            control={form.control}
            name="isDefault"
            label="Set as default address"
          />
        </div>

        <div className="flex justify-end gap-2 m-4 mb-0">
          <Button
            className="w-40"
            variant="outline"
            type="button"
            onClick={onClose}
          >
            Cancel
          </Button>
          <Button className="w-40" type="submit">
            {submitText}
          </Button>
        </div>
      </form>
    </Form>
  );
}

export default AddressForm;
