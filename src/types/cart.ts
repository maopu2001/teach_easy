import { Types } from "mongoose";

export interface ICartItem {
  product: Types.ObjectId;
  productSnapshot: any; // Mixed type for product details snapshot
  quantity: number;
  addedAt: Date;
}

export interface IAppliedCoupon {
  coupon: Types.ObjectId;
  code: string;
  discount: number;
  appliedAt: Date;
}

export interface ICart {
  _id: Types.ObjectId;
  user: Types.ObjectId;
  items: ICartItem[];
  appliedCoupons: IAppliedCoupon[];
  createdAt: Date;
  updatedAt: Date;

  // Virtual fields
  totalQuantity: number;
  subtotal: number;
  totalSavings: number;
  cartValue: number;
}

export interface ICartDocument extends ICart {
  addItem(
    productId: string,
    quantity?: number,
    productData?: any
  ): Promise<ICartDocument>;
  removeItem(productId: string): Promise<ICartDocument>;
  updateQuantity(productId: string, quantity: number): Promise<ICartDocument>;
  clearCart(): Promise<ICartDocument>;
  applyCoupon(
    couponId: string,
    code: string,
    discount: number
  ): Promise<ICartDocument>;
  removeCoupon(couponId: string): Promise<ICartDocument>;
}

export interface ICartModel {
  findOrCreateCart(userId: string): Promise<ICart>;
}

export type CartCreateInput = Omit<
  ICart,
  | "_id"
  | "createdAt"
  | "updatedAt"
  | "totalQuantity"
  | "subtotal"
  | "totalSavings"
  | "cartValue"
>;
export type CartUpdateInput = Partial<CartCreateInput>;
