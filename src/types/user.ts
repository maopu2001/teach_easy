export type UserGender = "male" | "female" | "other" | "prefer_not_to_say";

export type UserRole = "customer" | "teacher" | "admin" | "superadmin";

export type UserPermission =
  | "read_products"
  | "write_products"
  | "delete_products"
  | "read_orders"
  | "write_orders"
  | "delete_orders"
  | "read_users"
  | "write_users"
  | "delete_users"
  | "read_analytics"
  | "write_settings"
  | "manage_coupons";

export interface UserPreferences {
  currency: string;
  language: string;
  notifications: {
    email: boolean;
    sms: boolean;
    push: boolean;
    marketing: boolean;
  };
  newsletter: boolean;
}

export interface UserStats {
  totalOrders: number;
  totalSpent: number;
  averageOrderValue: number;
  lastOrderDate?: Date;
  loyaltyPoints: number;
  reviewsCount: number;
  averageRating: number;
}

export interface IUser {
  _id: string;
  fullName: string;
  email: string;
  phone?: string;
  dateOfBirth?: Date;
  gender?: UserGender;
  avatar?: string;
  bio?: string;
  isVerified: boolean;
  isEmailVerified: boolean;
  isPhoneVerified: boolean;
  isActive: boolean;
  isBlocked: boolean;
  blockReason?: string;
  role: UserRole;
  permissions: UserPermission[];
  defaultAddress?: string;
  preferences: UserPreferences;
  wishlist: string[];
  cart?: string;
  stats: UserStats;
  lastLoginAt?: Date;
  lastActiveAt?: Date;
  loginAttempts: number;
  lockUntil?: Date;
  isLocked?: boolean;
  createdAt: Date;
  updatedAt: Date;
}
