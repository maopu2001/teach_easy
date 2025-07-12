"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { toast } from "sonner";

interface CouponSectionProps {
  onApplyCoupon?: (code: string) => void;
}

export function CouponSection({ onApplyCoupon }: CouponSectionProps) {
  const [couponCode, setCouponCode] = useState("");
  const [isApplyingCoupon, setIsApplyingCoupon] = useState(false);

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) {
      toast.error("Please enter a coupon code");
      return;
    }

    setIsApplyingCoupon(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      //FIXME: Call the actual API to apply the coupon

      if (onApplyCoupon) {
        onApplyCoupon(couponCode);
      }
      toast.success("Coupon applied successfully!");
    } catch {
      toast.error("Invalid coupon code");
    } finally {
      setIsApplyingCoupon(false);
    }
  };

  return (
    <Card className="grid gap-4">
      <CardContent className="px-6">
        <Label className="mb-2" htmlFor="coupon">
          Promo / Coupon Code{" "}
          <span className="text-muted-foreground">(Optional)</span>
        </Label>
        <div className="flex gap-2">
          <Input
            id="coupon"
            placeholder="Promo / Coupon Code"
            value={couponCode}
            onChange={(e) => setCouponCode(e.target.value)}
            className="flex-1"
          />
          <Button
            onClick={handleApplyCoupon}
            disabled={isApplyingCoupon}
            variant="outline"
            className="px-6"
          >
            {isApplyingCoupon ? "Applying..." : "Apply Coupon"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
