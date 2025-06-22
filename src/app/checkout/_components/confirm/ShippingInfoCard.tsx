"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Edit, Package, Truck } from "lucide-react";
import { BillingFormData, ShippingFormData } from "@/lib/checkout-schemas";

interface ShippingInfoCardProps {
  shippingData: ShippingFormData;
  billingData: BillingFormData;
  onEdit: () => void;
}

export default function ShippingInfoCard({
  shippingData,
  billingData,
  onEdit,
}: ShippingInfoCardProps) {
  const getShippingMethodDisplay = (method: string) => {
    const methods: Record<string, { name: string; time: string }> = {
      standard: { name: "Standard Delivery", time: "5-7 business days" },
      overnight: { name: "Overnight Delivery", time: "1 business day" },
    };
    return methods[method] || { name: method, time: "" };
  };

  const displayAddress = shippingData.sameAsBilling
    ? billingData
    : shippingData;

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
        <CardTitle className="text-lg flex items-center">
          <Truck className="h-5 w-5 mr-2" />
          Shipping Information
        </CardTitle>
        <Button variant="ghost" size="sm" onClick={onEdit} className="h-8 px-2">
          <Edit className="h-4 w-4 mr-1" />
          Edit
        </Button>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="space-y-3">
          {shippingData.sameAsBilling ? (
            <p className="text-sm text-muted-foreground">
              Same as billing address
            </p>
          ) : (
            <div className="space-y-2">
              <p className="font-medium">{displayAddress.fullName}</p>
              <div className="text-sm text-muted-foreground">
                <p>{displayAddress.address}</p>
                <p>
                  {displayAddress.city}, {displayAddress.state}{" "}
                  {displayAddress.zipCode}
                </p>
                <p>{displayAddress.country}</p>
              </div>
            </div>
          )}

          <Separator />

          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">
                {getShippingMethodDisplay(shippingData.shippingMethod).name}
              </p>
              <p className="text-sm text-muted-foreground">
                {getShippingMethodDisplay(shippingData.shippingMethod).time}
              </p>
            </div>
            <Package className="h-5 w-5 text-muted-foreground" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
