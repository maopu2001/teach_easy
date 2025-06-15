import { Types } from "mongoose";

export type OrderStatus =
  | "pending"
  | "confirmed"
  | "processing"
  | "shipped"
  | "delivered"
  | "cancelled"
  | "refunded"
  | "partially_shipped"
  | "partially_delivered"
  | "partially_refunded";

export type ShippingMethod = "standard" | "pickup";

export type ReturnStatus =
  | "none"
  | "requested"
  | "approved"
  | "rejected"
  | "completed";

export type NotificationType =
  | "order_confirmation"
  | "payment_confirmation"
  | "shipped"
  | "delivered"
  | "cancelled";

export type NotificationChannel = "email" | "sms" | "push";

export interface IOrderItem {
  product: Types.ObjectId;
  productSnapshot: any; // Mixed type for product details snapshot
  quantity: number;
}

export interface IOrderAppliedCoupon {
  coupon: Types.ObjectId;
  code: string;
  discount: number;
  appliedAt: Date;
}

export interface IOrderCouponUsed {
  coupon: Types.ObjectId;
  code: string;
  discountAmount: number;
  appliedAt: Date;
}

export interface IOrderStatusHistory {
  status: string;
  updatedAt: Date;
  note?: string;
}

export interface IOrderNotification {
  type: NotificationType;
  channel: NotificationChannel;
  sentAt: Date;
  success: boolean;
}

export interface IOrder {
  _id: Types.ObjectId;
  orderNumber: string;
  user: Types.ObjectId;
  items: IOrderItem[];
  appliedCoupons: IOrderAppliedCoupon[];
  subtotal: number;
  tax: number;
  shipping: number;
  discount: number;
  total: number;
  couponsUsed: IOrderCouponUsed[];
  shippingAddress: Types.ObjectId;
  billingAddress: Types.ObjectId;
  status: OrderStatus;
  statusHistory: IOrderStatusHistory[];
  payment?: Types.ObjectId;
  shippingMethod: ShippingMethod;
  estimatedDeliveryDate?: Date;
  actualDeliveryDate?: Date;
  shippingProvider?: string;
  trackingNumber?: string;
  orderNotes?: string;
  specialInstructions?: string;
  returnRequested: boolean;
  returnReason?: string;
  returnStatus?: ReturnStatus;
  refundRequested: boolean;
  refundAmount: number;
  refundReason?: string;
  notificationsSent: IOrderNotification[];
  packingSlipGenerated: boolean;
  invoiceGenerated: boolean;
  shippingLabelGenerated: boolean;
  createdAt: Date;
  updatedAt: Date;

  // Virtual fields
  totalWeight: number;
  totalItems: number;
}

export interface IOrderDocument extends IOrder {
  updateStatus(newStatus: string): Promise<IOrderDocument>;
  canBeCancelled(): boolean;
  canBeReturned(): boolean;
}

export interface IOrderModel {
  getOrderStats(filters?: any): Promise<any[]>;
}

export type OrderCreateInput = Omit<
  IOrder,
  | "_id"
  | "createdAt"
  | "updatedAt"
  | "orderNumber"
  | "totalWeight"
  | "totalItems"
>;
export type OrderUpdateInput = Partial<OrderCreateInput>;
