"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FormCheckbox, FormSelect } from "@/components/forms";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { addNewAddress } from "../_actions/checkout";
import { useCallback, useEffect, useState } from "react";
import { IAddress } from "@/types";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { X } from "lucide-react";
import AddressForm from "@/components/AddressForm";

interface CustomerInfoSectionProps {
  form: any;
}

export function CustomerInfoSection({ form }: CustomerInfoSectionProps) {
  const [addressOptions, setAddressOptions] = useState<any[]>([]);
  const [defaultAddress, setDefaultAddress] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const fetchAddresses = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/user/addresses");
      const data = await response.json();

      if (response.ok && data.addresses) {
        const test = data.addresses.map((address: IAddress) => {
          if (!defaultAddress && address.isDefault) {
            setDefaultAddress(address._id);
            form.setValue("shipping.id", address._id);
          }

          return {
            value: address._id,
            label: `${address.fullName} - ${address.phone}`,
            clickable: (
              <div className="flex flex-col justify-start">
                <span>
                  {address.fullName} - {address.phone}
                </span>
                <span>
                  {address.addressLine}, {address.cityOrUpazila} <br />
                  {address.district}
                  {address.postalCode && `- ${address.postalCode}`}
                  {", "}
                  {address.division}
                </span>
              </div>
            ),
          };
        });

        setAddressOptions(test);
      }
    } catch (error) {
      console.error("Error fetching addresses:", error);
    } finally {
      setIsLoading(false);
    }
  }, [form, defaultAddress]);

  useEffect(() => {
    fetchAddresses();
  }, [fetchAddresses]);

  const NewAddressDialog = () => {
    const [isOpen, setIsOpen] = useState<boolean>(false);

    const handleSubmit = async (data: any) => {
      try {
        const result = await addNewAddress(data);
        if (result.success) {
          setIsOpen(false);
          form.setValue("shipping.id", result.address?._id);
          fetchAddresses();
        } else {
          console.error("Error adding address:", result.message);
        }
      } catch (error: any) {
        console.error("Error adding address:", error);
      }
    };

    return (
      <Dialog open={isOpen} onOpenChange={(open) => setIsOpen(open)}>
        <DialogTrigger
          asChild
          className="w-full border-dashed"
          onClick={() => setIsOpen(true)}
        >
          <Button variant="outline">Add New Address</Button>
        </DialogTrigger>
        <DialogContent
          showCloseButton={false}
          className="h-[95%] p-5 overflow-hidden"
        >
          <DialogClose
            onClick={() => setIsOpen(false)}
            className="absolute top-5 right-5 rounded-full p-0.5 hover:bg-accent cursor-pointer size-8 grid place-content-center"
          >
            <X />
          </DialogClose>
          <DialogHeader>
            <DialogTitle className="mx-auto my-2 text-xl">
              Add New Address
            </DialogTitle>
          </DialogHeader>
          <div className="overflow-scroll">
            <AddressForm
              onSubmit={handleSubmit}
              onClose={() => setIsOpen(false)}
              submitText="Save Address"
            />
          </div>
        </DialogContent>
      </Dialog>
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <span className="inline-flex items-center justify-center w-6 h-6 bg-primary text-white rounded-full text-sm font-bold">
            1
          </span>
          Customer Information
        </CardTitle>
      </CardHeader>
      {!isLoading && (
        <CardContent className="space-y-4 px-5">
          {addressOptions.length > 0 ? (
            <>
              <FormSelect
                name="shipping.id"
                placeholder="Select Shipping Address"
                control={form.control}
                label="Shipping Address"
                options={addressOptions}
                defaultValue={defaultAddress || ""}
              />

              {!form.watch("billing.sameAsShipping") && (
                <FormSelect
                  name="billing.id"
                  placeholder="Select Billing Address"
                  control={form.control}
                  label="Billing Address"
                  options={addressOptions}
                  defaultValue={defaultAddress || ""}
                />
              )}
              <FormCheckbox
                name="billing.sameAsShipping"
                control={form.control}
                label="Same as Shipping Address"
              />
              <Separator className="my-1" />
              <span className="text-sm text-muted-foreground flex justify-center m-0">
                Or,
              </span>
              <Separator className="mt-1 mb-3" />
            </>
          ) : (
            <span className="text-muted-foreground flex justify-center">
              No addresses found
            </span>
          )}
          <NewAddressDialog />
        </CardContent>
      )}
    </Card>
  );
}
