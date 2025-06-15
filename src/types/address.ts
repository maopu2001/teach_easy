export type Division =
  | "Dhaka"
  | "Chittagong"
  | "Rajshahi"
  | "Khulna"
  | "Barisal"
  | "Sylhet"
  | "Rangpur"
  | "Mymensingh";

export type DeliveryTime = "morning" | "afternoon" | "evening" | "anytime";

export interface IAddress {
  _id: string;
  user: string;
  label?: string;
  fullName: string;
  phone: string;
  alternatePhone?: string;
  email: string;
  addressLine: string;
  landmark?: string;
  division: Division;
  district: string;
  upazila?: string;
  city: string;
  postalCode?: string;
  isDefault: boolean;
  bestTimeToDeliver: DeliveryTime;
  usageCount: number;
  lastUsedAt?: Date;
  fullAddress?: string;
  deliveryAddress?: string;
  createdAt: Date;
  updatedAt: Date;
}
