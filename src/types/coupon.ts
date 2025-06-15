import { Types } from "mongoose";

export type CouponType = "percentage" | "fixed_amount" | "free_shipping";
export type CouponUserRole = "customer" | "vendor" | "admin";

export interface ICouponUsageHistory {
  user: Types.ObjectId;
  order: Types.ObjectId;
  discount: number;
  usedAt: Date;
}

export interface ICoupon {
  _id: Types.ObjectId;
  code: string;
  name: string;
  description?: string;
  type: CouponType;
  value: number;
  maxdiscount?: number;
  startDate: Date;
  endDate: Date;
  usageLimit?: number;
  usageLimitPerUser: number;
  currentUsage: number;
  minimumOrderAmount: number;
  minimumQuantity?: number;
  applicableProducts: Types.ObjectId[];
  applicableCategories: string[];
  excludedProducts: Types.ObjectId[];
  excludedCategories: string[];
  applicableUsers: Types.ObjectId[];
  applicableUserRoles: CouponUserRole[];
  excludedUsers: Types.ObjectId[];
  newUsersOnly: boolean;
  isActive: boolean;
  isPublic: boolean;
  isAutoApply: boolean;
  isStackable: boolean;
  stackableWith: string[];
  usageHistory: ICouponUsageHistory[];
  firstOrderOnly: boolean;
  createdAt: Date;
  updatedAt: Date;

  // Virtual fields
  remainingUsage: number | null;
  usagePercentage: number;
  isExpired: boolean;
  isCurrentlyValid: boolean;
}

export interface ICouponDocument extends ICoupon {
  isValidForUser(userId: string): { valid: boolean; reason?: string };
  recordUsage(
    userId: string,
    orderId: string,
    discount: number
  ): Promise<ICouponDocument>;
}

export interface ICouponModel {
  findAutoApplicableCoupons(): Promise<ICoupon[]>;
}

export type CouponCreateInput = Omit<
  ICoupon,
  | "_id"
  | "createdAt"
  | "updatedAt"
  | "currentUsage"
  | "usageHistory"
  | "remainingUsage"
  | "usagePercentage"
  | "isExpired"
  | "isCurrentlyValid"
>;
export type CouponUpdateInput = Partial<CouponCreateInput>;
