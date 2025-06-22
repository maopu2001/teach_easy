export type Division =
  | "Dhaka"
  | "Chattogram"
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
  fullName: string;
  phone: string;
  alternatePhone?: string;
  email: string;
  addressLine: string;
  landmark?: string;
  division: Division;
  district: string;
  cityOrUpazila: string;
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

export const districts = {
  Barisal: [
    "Barisal",
    "Bhola",
    "Jhalokati",
    "Patuakhali",
    "Pirojpur",
    "Barguna",
  ],
  Chattogram: [
    "Bandarban",
    "Brahmanbaria",
    "Chandpur",
    "Chattogram",
    "Cox's Bazar",
    "Cumilla",
    "Feni",
    "Khagrachari",
    "Lakshmipur",
    "Noakhali",
    "Rangamati",
  ],
  Dhaka: [
    "Dhaka",
    "Faridpur",
    "Gazipur",
    "Gopalganj",
    "Kishoreganj",
    "Madaripur",
    "Manikganj",
    "Munshiganj",
    "Narayanganj",
    "Narsingdi",
    "Rajbari",
    "Shariatpur",
    "Tangail",
  ],
  Khulna: [
    "Bagerhat",
    "Chuadanga",
    "Jhenaidah",
    "Jashore",
    "Khulna",
    "Kushtia",
    "Magura",
    "Meherpur",
    "Narail",
    "Satkhira",
  ],
  Mymensingh: ["Mymensingh", "Netrokona", "Sherpur", "Jamalpur"],
  Rajshahi: [
    "Bogura",
    "Joypurhat",
    "Naogaon",
    "Natore",
    "Chapainawabganj",
    "Pabna",
    "Rajshahi",
    "Sirajganj",
  ],
  Rangpur: [
    "Dinajpur",
    "Gaibandha",
    "Kurigram",
    "Lalmonirhat",
    "Nilphamari",
    "Panchagarh",
    "Rangpur",
    "Thakurgaon",
  ],
  Sylhet: ["Habiganj", "Moulvibazar", "Sunamganj", "Sylhet"],
};
