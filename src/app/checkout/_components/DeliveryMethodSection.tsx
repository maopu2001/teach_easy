"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { formatCurrency } from "@/lib/formatter";

interface DeliveryMethodSectionProps {
  form: any;
}

const deliveryOptions = [
  {
    id: "standard",
    name: "Home Delivery",
    price: 60,
    description: "Regular delivery to your address",
  },
  {
    id: "pickup",
    name: "Store Pickup",
    price: 0,
    description: "Pick up from our store",
  },
];

export function DeliveryMethodSection({ form }: DeliveryMethodSectionProps) {
  const handleDeliveryChange = (value: string) => {
    form.setValue("delivery.deliveryMethod", value);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <span className="inline-flex items-center justify-center w-6 h-6 bg-primary text-white rounded-full text-sm font-bold">
            3
          </span>
          Delivery Method
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 px-5">
        <h2 className="text-sm text-muted-foreground mb-4">
          Selected delivery method
        </h2>

        <RadioGroup
          value={form.watch("delivery.deliveryMethod")}
          onValueChange={handleDeliveryChange}
        >
          {deliveryOptions.map((option) => (
            <div
              key={option.id}
              className={`flex items-center space-x-3 bg-foreground/5 p-3 rounded-md ${
                form.watch("delivery.deliveryMethod") === option.id
                  ? "bg-primary/30"
                  : ""
              }`}
            >
              <RadioGroupItem value={option.id} id={option.id} />
              <Label
                htmlFor={option.id}
                className="flex flex-col items-start w-full cursor-pointer"
              >
                <span className="font-bold">
                  {option.name}{" "}
                  <span className="text-sm text-muted-foreground ml-2">
                    +{formatCurrency(option.price)}
                  </span>
                </span>

                <span className="text-muted-foreground">
                  {option.description}
                </span>
              </Label>
            </div>
          ))}
        </RadioGroup>
      </CardContent>
    </Card>
  );
}
