"use client";
import { IAddress } from "@/types/address";
import { useCallback, useEffect, useState } from "react";
import {
  addAddress,
  deleteAddress,
  getAddresses,
  updateAddress,
} from "../_actions/profile";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import AddressForm, {
  AddressFormData,
  deliveryTimes,
} from "@/components/AddressForm";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Edit, Trash, X } from "lucide-react";
import { toast } from "sonner";
import CustomAlertDialog from "@/components/AlertDialog";
import { Badge } from "@/components/ui/badge";

type AddresssProps = {
  user: any;
};

function Addresses({ user }: AddresssProps) {
  const [addresses, setAddresses] = useState<IAddress[]>([]);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [editingAddress, setEditingAddress] = useState<IAddress | null>(null);

  const fetchAddresses = useCallback(async () => {
    if (user && user._id) {
      const addressesData = await getAddresses(user._id);
      if (addressesData.result) {
        setAddresses((addressesData.addresses as Array<any>) || []);
      }
    }
  }, [user]);

  useEffect(() => {
    fetchAddresses();
  }, [fetchAddresses]);

  const handleSubmit = async (data: AddressFormData) => {
    try {
      if (editingAddress) {
        // Update existing address
        const result = await updateAddress(user._id, editingAddress._id, data);
        if (result.success) {
          toast.success(result.message);
          setEditingAddress(null);
          fetchAddresses();
          setIsOpen(false);
        } else {
          toast.error(result.message);
        }
      } else {
        const result = await addAddress(user._id, data);
        if (result.success) {
          toast.success(result.message);
          fetchAddresses();
          setIsOpen(false);
        } else {
          toast.error(result.message);
        }
      }
    } catch (error: any) {
      toast.error(error.message || "An error occurred");
    }
  };

  const handleEditAddress = (address: IAddress) => {
    setEditingAddress(address);
    setIsOpen(true);
  };

  const handleDeleteAddress = async (addressId: string) => {
    try {
      const result = await deleteAddress(user._id, addressId);
      if (result.success) {
        toast.success(result.message);
        fetchAddresses();
      } else {
        toast.error(result.message);
      }
    } catch (error: any) {
      toast.error(error.message || "An error occurred");
    }
  };

  const AddressCard = ({ address }: { address: IAddress }) => (
    <Card className="border">
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          <span className="text-xl">{address.fullName}</span>
          <div className="flex gap-2">
            <Badge className="bg-accent text-foreground">{address.isDefault && "Default"}</Badge>
            <Button
              className="size-8 bg-accent"
              variant="outline"
              size="icon"
              onClick={() => handleEditAddress(address)}
            >
              <Edit />
            </Button>
            <CustomAlertDialog
              title="Delete Address"
              ActionTrigger={
                <Button
                  className="size-8 bg-destructive hover:bg-destructive/80"
                  size="icon"
                >
                  <Trash />
                </Button>
              }
              onDelete={() => handleDeleteAddress(address._id)}
            />
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="px-4">
        <p>
          <span className="font-semibold">Phone: </span>
          {address.phone}
          {address.alternatePhone && (
            <span> (Main) / {address.alternatePhone}</span>
          )}
        </p>
        <p>
          <span className="font-semibold">Email: </span>
          {address.email}
        </p>
        <p>
          <span className="font-semibold">Address: </span>
          {address.fullAddress}
        </p>

        {address.bestTimeToDeliver && (
          <p>
            <span className="font-semibold">Preferred Delivery Time: </span>
            {deliveryTimes.find(
              (time) => time.value === address.bestTimeToDeliver
            )?.label || "Not specified"}
          </p>
        )}
      </CardContent>
    </Card>
  );

  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-xl font-semibold text-foreground">Addresses</h2>
      <div className="space-y-4">
        {addresses && addresses.length > 0 ? (
          addresses.map((address) => (
            <AddressCard key={address._id} address={address} />
          ))
        ) : (
          <div className="text-muted-foreground bg-muted border border-dashed p-4 grid place-content-center rounded-md h-24">
            No Addresses Found
          </div>
        )}
      </div>
      <div>
        <Dialog
          open={isOpen}
          onOpenChange={(open) => {
            if (!open) {
              setEditingAddress(null);
            }
            setIsOpen(open);
          }}
        >
          <DialogTrigger
            asChild
            className="w-full border-dashed"
            onClick={() => {
              setEditingAddress(null);
              setIsOpen(true);
            }}
          >
            <Button>Add Address</Button>
          </DialogTrigger>
          <DialogContent
            showCloseButton={false}
            className="h-[95%] p-5 overflow-hidden"
          >
            <DialogClose
              onClick={() => {
                setIsOpen(false);
                setEditingAddress(null);
              }}
              className="absolute top-5 right-5 rounded-full p-0.5 hover:bg-accent cursor-pointer size-8 grid place-content-center"
            >
              <X />
            </DialogClose>
            <DialogHeader>
              <DialogTitle className="mx-auto my-2 text-xl">
                {editingAddress ? "Edit Address" : "Add New Address"}
              </DialogTitle>
            </DialogHeader>
            <div className="overflow-scroll">
              <AddressForm
                onSubmit={handleSubmit}
                onClose={() => {
                  setIsOpen(false);
                  setEditingAddress(null);
                }}
                submitText={editingAddress ? "Update Address" : "Save Address"}
                defaultValues={
                  editingAddress
                    ? {
                        fullName: editingAddress.fullName,
                        phone: editingAddress.phone,
                        email: editingAddress.email,
                        addressLine: editingAddress.addressLine,
                        division: editingAddress.division,
                        district: editingAddress.district,
                        cityOrUpazila: editingAddress.cityOrUpazila,
                        postalCode: editingAddress.postalCode || "",
                        alternatePhone: editingAddress.alternatePhone || "",
                        landmark: editingAddress.landmark || "",
                        bestTimeToDeliver: editingAddress.bestTimeToDeliver,
                        isDefault: editingAddress.isDefault,
                      }
                    : undefined
                }
              />
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}

export default Addresses;
