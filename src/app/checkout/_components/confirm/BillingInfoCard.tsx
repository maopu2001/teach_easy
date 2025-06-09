"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Edit, MapPin } from "lucide-react";
import { BillingFormData } from "@/lib/checkout-schemas";

interface BillingInfoCardProps {
  billingData: BillingFormData;
  onEdit: () => void;
}

export default function BillingInfoCard({
  billingData,
  onEdit,
}: BillingInfoCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
        <CardTitle className="text-lg flex items-center">
          <MapPin className="h-5 w-5 mr-2" />
          Billing Information
        </CardTitle>
        <Button variant="ghost" size="sm" onClick={onEdit} className="h-8 px-2">
          <Edit className="h-4 w-4 mr-1" />
          Edit
        </Button>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="space-y-2">
          <p className="font-medium">{billingData.fullName}</p>
          <p className="text-muted-foreground">{billingData.email}</p>
          <p className="text-muted-foreground">{billingData.phone}</p>
          <div className="text-sm text-muted-foreground">
            <p>{billingData.address}</p>
            <p>
              {billingData.city}, {billingData.state} {billingData.zipCode}
            </p>
            <p>{billingData.country}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
