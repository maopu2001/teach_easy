import { z } from "zod";

// Billing Information Schema
export const billingSchema = z.object({
  fullName: z.string().min(3, "Full name must be at least 3 characters"),
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().min(10, "Phone number must be at least 10 digits"),
  address: z.string().min(5, "Address must be at least 5 characters"),
  city: z.string().min(2, "City must be at least 2 characters"),
  state: z.string().min(2, "State must be at least 2 characters"),
  zipCode: z.string().min(4, "ZIP code must be at least 4 characters"),
  country: z.string().min(2, "Please select a country"),
});

// Shipping Information Schema
export const shippingSchema = z
  .object({
    sameAsBilling: z.boolean().default(false),
    fullName: z
      .string()
      .min(3, "Full name must be at least 3 characters")
      .optional(),
    address: z
      .string()
      .min(5, "Address must be at least 5 characters")
      .optional(),
    city: z.string().min(2, "City must be at least 2 characters").optional(),
    state: z.string().min(2, "State must be at least 2 characters").optional(),
    zipCode: z
      .string()
      .min(4, "ZIP code must be at least 4 characters")
      .optional(),
    country: z.string().min(2, "Please select a country").optional(),
    shippingMethod: z.enum(["standard", "express", "overnight"], {
      required_error: "Please select a shipping method",
    }),
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

// Payment Information Schema
export const paymentSchema = z
  .object({
    paymentMethod: z.enum(["card", "bkash", "nagad", "cod"], {
      required_error: "Please select a payment method",
    }),
    // Card fields (conditional)
    cardNumber: z.string().optional(),
    expiryDate: z.string().optional(),
    cvv: z.string().optional(),
    cardholderName: z.string().optional(),
    // Mobile payment fields (conditional)
    mobileNumber: z.string().optional(),
    // Terms acceptance
    agreeToTerms: z.boolean().refine((val) => val === true, {
      message: "You must agree to the terms and conditions",
    }),
  })
  .refine(
    (data) => {
      if (data.paymentMethod === "card") {
        return (
          data.cardNumber && data.expiryDate && data.cvv && data.cardholderName
        );
      }
      if (["bkash", "nagad"].includes(data.paymentMethod)) {
        return data.mobileNumber;
      }
      return true;
    },
    {
      message: "Please fill in all required payment fields",
      path: ["cardNumber"],
    }
  );

// Complete checkout schema
export const checkoutSchema = z.object({
  billing: billingSchema,
  shipping: shippingSchema,
  payment: paymentSchema,
});

// Type exports
export type BillingFormData = z.infer<typeof billingSchema>;
export type ShippingFormData = z.infer<typeof shippingSchema>;
export type PaymentFormData = z.infer<typeof paymentSchema>;
export type CheckoutFormData = z.infer<typeof checkoutSchema>;
