"use client";

import { Button } from "@/components/ui/button";

interface PaymentActionButtonsProps {
  selectedPaymentMethod: string;
  isAgreedToTerms: boolean;
  onBack: () => void;
  onContinueWithoutPaying: () => void;
  onPayNow: () => void;
}

export default function PaymentActionButtons({
  selectedPaymentMethod,
  isAgreedToTerms,
  onBack,
  onContinueWithoutPaying,
  onPayNow,
}: PaymentActionButtonsProps) {
  return (
    <div className="flex justify-center pt-4 gap-2 flex-wrap">
      <Button type="button" variant="outline" onClick={onBack}>
        Back to Shipping
      </Button>
      {selectedPaymentMethod !== "cod" ? (
        <>
          <Button
            variant="outline"
            disabled={!isAgreedToTerms}
            type="submit"
            onClick={onContinueWithoutPaying}
            className="px-2 sm:ml-auto"
          >
            Continue without Paying
          </Button>
          <Button type="submit" onClick={onPayNow} disabled={!isAgreedToTerms}>
            Pay Now
          </Button>
        </>
      ) : (
        <Button type="submit" disabled={!isAgreedToTerms}>
          Continue
        </Button>
      )}
    </div>
  );
}
