import { z } from "zod";

export const shippingSchema = z.object({
  id: z.string(),
});

export const billingSchema = z
  .object({
    sameAsShipping: z.boolean().default(false),
    id: z.string().optional(),
  })
  .refine((data) => {
    if (!data.sameAsShipping) {
      return data.id;
    }
    return true;
  });

export const paymentSchema = z.object({
  paymentMethod: z.enum(["card", "bkash", "nagad", "cod", "bank_transfer"], {
    required_error: "Please select a payment method",
  }),
  agreeToTerms: z.boolean().refine((val) => val, {
    message: "You must agree to the terms and conditions",
  }),
});

export const deliveryMethodSchema = z.object({
  deliveryMethod: z.enum(["standard", "pickup"], {
    required_error: "Please select a delivery method",
  }),
});

// Complete checkout schema
export const checkoutSchema = z.object({
  shipping: shippingSchema,
  billing: billingSchema,
  payment: paymentSchema,
  delivery: deliveryMethodSchema,
});

// Type exports
export type ShippingFormData = z.infer<typeof shippingSchema>;
export type BillingFormData = z.infer<typeof billingSchema>;
export type PaymentFormData = z.infer<typeof paymentSchema>;
export type DeliveryMethodFormData = z.infer<typeof deliveryMethodSchema>;
export type CheckoutFormData = z.infer<typeof checkoutSchema>;
