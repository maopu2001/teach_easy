import { Types } from "mongoose";

export type PaymentMethod =
  | "card"
  | "bank_transfer"
  | "cod"
  | "bkash"
  | "nagad";

export type PaymentStatus =
  | "pending"
  | "processing"
  | "completed"
  | "failed"
  | "cancelled"
  | "refunded"
  | "partially_refunded"
  | "disputed"
  | "chargeback";

export type Currency = "BDT" | "USD" | "EUR";

export type CardBrand = "visa" | "mastercard" | "amex";

export type RefundStatus = "pending" | "processing" | "completed" | "failed";

export interface ICardDetails {
  last4?: string;
  brand?: CardBrand;
  expiryMonth?: number;
  expiryYear?: number;
  cardholderName?: string;
  issuingBank?: string;
}

export interface IMobileBankingDetails {
  accountNumber?: string;
  accountHolderName?: string;
  referenceNumber?: string;
  senderNumber?: string;
}

export interface IBankTransferDetails {
  bankName?: string;
  accountNumber?: string;
  accountHolderName?: string;
  routingNumber?: string;
  referenceNumber?: string;
  transferDate?: Date;
}

export interface IPaymentStatusHistory {
  status: string;
  timestamp: Date;
  gatewayResponse?: any;
}

export interface IPaymentRefund {
  refundId: string;
  amount: number;
  reason?: string;
  status: RefundStatus;
  gatewayRefundId?: string;
  processedAt?: Date;
  createdAt: Date;
}

export interface IPaymentFees {
  gatewayFee: number;
  processingFee: number;
  platformFee: number;
  totalFees: number;
}

export interface IPayment {
  _id: Types.ObjectId;
  paymentId: string;
  transactionId?: string;
  order: Types.ObjectId;
  user: Types.ObjectId;
  amount: number;
  currency: Currency;
  paymentMethod: PaymentMethod;
  cardDetails?: ICardDetails;
  mobileBankingDetails?: IMobileBankingDetails;
  bankTransferDetails?: IBankTransferDetails;
  status: PaymentStatus;
  statusHistory: IPaymentStatusHistory[];
  authorizedAt?: Date;
  capturedAt?: Date;
  failedAt?: Date;
  refundedAt?: Date;
  failureReason?: string;
  failureCode?: string;
  gatewayErrorMessage?: string;
  refund?: IPaymentRefund;
  fees?: IPaymentFees;
  userSnapshot: any; // Mixed type for user details at time of payment
  createdAt: Date;
  updatedAt: Date;

  // Virtual fields
  netAmount: number;
}

export interface IPaymentDocument extends IPayment {
  updateStatus(
    newStatus: string,
    gatewayResponse?: any
  ): Promise<IPaymentDocument>;
  processRefund(amount: number, reason?: string): Promise<IPaymentDocument>;
  addDispute(amount: number, reason: string): Promise<IPaymentDocument>;
}

export interface IPaymentModel {
  getPaymentStats(filters?: any): Promise<any[]>;
  getRevenueByMethod(startDate: Date, endDate: Date): Promise<any[]>;
}

export type PaymentCreateInput = Omit<
  IPayment,
  "_id" | "createdAt" | "updatedAt" | "paymentId" | "netAmount"
>;
export type PaymentUpdateInput = Partial<PaymentCreateInput>;
