"use client";

import { Card, CardContent } from "@/components/ui/card";
import {
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Control } from "react-hook-form";
import { Truck, Clock, ShoppingBag } from "lucide-react";
import { ShippingFormData } from "@/lib/checkout-schemas";

interface ShippingMethodSelectorProps {
  control: Control<ShippingFormData>;
}

export default function ShippingMethodSelector({
  control,
}: ShippingMethodSelectorProps) {
  const shippingOptions = [
    {
      id: "standard",
      name: "Standard Shipping",
      description: "5-7 business days",
      price: 59,
      icon: Truck,
    },
    {
      id: "express",
      name: "Express Shipping",
      description: "2-3 business days",
      price: 149,
      icon: Clock,
    },
    {
      id: "pickup",
      name: "Pickup from Store",
      description: "1 business day",
      price: 0,
      icon: ShoppingBag,
    },
  ];

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Shipping Method</h3>
      <FormField
        control={control}
        name="shippingMethod"
        render={({ field }) => (
          <FormItem>
            <FormControl>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {shippingOptions.map((option) => {
                  const Icon = option.icon;
                  return (
                    <Card
                      key={option.id}
                      className={`cursor-pointer transition-colors p-0 h-16 min-h-0 ${
                        field.value === option.id
                          ? "ring-2 ring-primary border-primary"
                          : "hover:border-muted-foreground"
                      }`}
                      onClick={() => field.onChange(option.id)}
                    >
                      <CardContent className="flex items-center justify-between px-4 py-2 h-full">
                        <div className="flex items-center space-x-2 mr-2">
                          <input
                            type="radio"
                            checked={field.value === option.id}
                            onChange={() => field.onChange(option.id)}
                            className="hidden"
                          />
                          <Icon className="h-4 w-4 text-muted-foreground" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm truncate">
                            {option.name}
                          </p>
                          <p className="text-xs text-muted-foreground truncate">
                            {option.description}
                          </p>
                        </div>
                        <p className="font-semibold text-sm whitespace-nowrap">
                          {option.price}৳
                        </p>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}
