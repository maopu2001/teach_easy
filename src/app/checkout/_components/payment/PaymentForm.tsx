"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form } from "@/components/ui/form";
import { PaymentFormData } from "@/lib/checkout-schemas";
import PaymentMethodSelector from "./PaymentMethodSelector";
import CardPaymentFields from "./CardPaymentFields";
import MobileBankingFields from "./MobileBankingFields";
import CashOnDeliveryInfo from "./CashOnDeliveryInfo";
import SecurityFeatures from "./SecurityFeatures";
import TermsAndConditions from "./TermsAndConditions";
import PaymentActionButtons from "./PaymentActionButtons";
import { Bkash, Nagad, CreditCard, COD } from "./PaymentIcons";

// Create a custom schema for the form that properly handles types
const paymentFormSchema = z
  .object({
    paymentMethod: z.enum(["card", "bkash", "nagad", "cod"]),
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

type PaymentFormValues = z.infer<typeof paymentFormSchema>;

interface PaymentFormProps {
  onSubmit: (data: PaymentFormData) => void;
  onBack: () => void;
  defaultValues?: Partial<PaymentFormData>;
}

export default function PaymentForm({
  onSubmit,
  onBack,
  defaultValues,
}: PaymentFormProps) {
  const form = useForm<PaymentFormValues>({
    resolver: zodResolver(paymentFormSchema),
    defaultValues: {
      paymentMethod: "card",
      cardNumber: "",
      expiryDate: "",
      cvv: "",
      cardholderName: "",
      mobileNumber: "",
      agreeToTerms: false,
      ...defaultValues,
    },
  });

  const handleSubmit = (data: PaymentFormValues) => {
    // Convert form data to expected PaymentFormData type
    const paymentData: PaymentFormData = {
      paymentMethod: data.paymentMethod,
      agreeToTerms: data.agreeToTerms,
      ...(data.cardNumber && { cardNumber: data.cardNumber }),
      ...(data.expiryDate && { expiryDate: data.expiryDate }),
      ...(data.cvv && { cvv: data.cvv }),
      ...(data.cardholderName && { cardholderName: data.cardholderName }),
      ...(data.mobileNumber && { mobileNumber: data.mobileNumber }),
    };
    onSubmit(paymentData);
  };

  const selectedPaymentMethod = form.watch("paymentMethod");
  const isAgreedToTerms = form.watch("agreeToTerms");

  const paymentMethods = [
    {
      id: "card",
      icon: CreditCard,
    },
    {
      id: "bkash",
      icon: Bkash,
    },
    {
      id: "nagad",
      icon: Nagad,
    },
    {
      id: "cod",
      icon: COD,
    },
  ];

  const continueWithoutPaying = () => {
    // Handle logic for continuing without payment
    console.log("Continuing without payment");
  };

  const payNow = () => {
    // Handle logic for paying now
    console.log("Paying now");
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold mb-2">Payment Information</h2>
        <p className="text-muted-foreground">
          Choose your preferred payment method to complete your order.
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
          <PaymentMethodSelector
            control={form.control}
            paymentMethods={paymentMethods}
          />

          {selectedPaymentMethod === "card" && (
            <CardPaymentFields control={form.control} />
          )}

          {["bkash", "nagad"].includes(selectedPaymentMethod) && (
            <MobileBankingFields
              control={form.control}
              selectedPaymentMethod={selectedPaymentMethod}
            />
          )}

          {selectedPaymentMethod === "cod" && <CashOnDeliveryInfo />}

          <SecurityFeatures />

          <TermsAndConditions control={form.control} />

          <PaymentActionButtons
            selectedPaymentMethod={selectedPaymentMethod}
            isAgreedToTerms={isAgreedToTerms}
            onBack={onBack}
            onContinueWithoutPaying={continueWithoutPaying}
            onPayNow={payNow}
          />
        </form>
      </Form>
    </div>
  );
}
