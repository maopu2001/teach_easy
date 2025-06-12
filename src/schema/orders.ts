import config from "@/lib/config";
import mongoose from "mongoose";

export const orderSchema = new mongoose.Schema(
  {
    // Order Identification
    orderNumber: {
      type: String,
      unique: true,
      required: true,
    },

    // User Information
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // Order Items
    items: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        productSnapshot: {
          type: mongoose.Schema.Types.Mixed,
          required: true, // Snapshot of product details at the time of order
        },
        quantity: {
          type: Number,
          required: true,
          min: 1,
        },
      },
    ],

    appliedCoupons: [
      {
        coupon: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Coupon",
        },
        code: String,
        discount: Number,
        appliedAt: { type: Date, default: Date.now },
      },
    ],
    // Pricing Breakdown
    subtotal: {
      type: Number,
      required: true,
      min: 0,
    },
    tax: {
      type: Number,
      default: 0,
      min: 0,
    },
    shipping: {
      type: Number,
      default: 0,
      min: 0,
    },
    discount: {
      type: Number,
      default: 0,
      min: 0,
    },
    total: {
      type: Number,
      required: true,
      min: 0,
    },

    // Coupons Applied
    couponsUsed: [
      {
        coupon: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Coupon",
        },
        code: { type: String, required: true },
        discountAmount: { type: Number, required: true },
        appliedAt: { type: Date, default: Date.now },
      },
    ],

    // Shipping Information
    shippingAddress: {
      ref: "Address",
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },

    // Billing Information
    billingAddress: {
      ref: "Address",
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },

    // Order Status & Tracking
    status: {
      type: String,
      enum: [
        "pending",
        "confirmed",
        "processing",
        "shipped",
        "delivered",
        "cancelled",
        "refunded",
        "partially_shipped",
        "partially_delivered",
        "partially_refunded",
      ],
      default: "pending",
    },

    // Status History
    statusHistory: [
      {
        status: { type: String, required: true },
        updatedAt: { type: Date, default: Date.now },
        note: String,
      },
    ],

    // Payment Information
    payment: {
      ref: "Payment",
      type: mongoose.Schema.Types.ObjectId,
    },

    // Shipping & Delivery
    shippingMethod: {
      type: String,
      enum: ["standard", "pickup"],
      default: "standard",
    },
    estimatedDeliveryDate: Date,
    actualDeliveryDate: Date,
    shippingProvider: String,
    trackingNumber: String,

    // Special Instructions
    orderNotes: String,
    specialInstructions: String,

    // Return & Refund
    returnRequested: { type: Boolean, default: false },
    returnReason: String,
    returnStatus: {
      type: String,
      enum: ["none", "requested", "approved", "rejected", "completed"],
    },
    refundRequested: { type: Boolean, default: false },
    refundAmount: { type: Number, default: 0 },
    refundReason: String,

    // Notifications
    notificationsSent: [
      {
        type: {
          type: String,
          enum: [
            "order_confirmation",
            "payment_confirmation",
            "shipped",
            "delivered",
            "cancelled",
          ],
          required: true,
        },
        channel: {
          type: String,
          enum: ["email", "sms", "push"],
          required: true,
        },
        sentAt: { type: Date, default: Date.now },
        success: { type: Boolean, required: true },
      },
    ],

    // Fulfillment
    packingSlipGenerated: { type: Boolean, default: false },
    invoiceGenerated: { type: Boolean, default: false },
    shippingLabelGenerated: { type: Boolean, default: false },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Indexes
orderSchema.index({ user: 1, createdAt: -1 });
orderSchema.index({ status: 1, createdAt: -1 });
orderSchema.index({ paymentStatus: 1 });
orderSchema.index({ "items.product": 1 });

// Virtual for total weight
orderSchema.virtual("totalWeight").get(function () {
  return this.items.reduce((total: number, item: any) => {
    return total + (item.weight || 0) * item.quantity;
  }, 0);
});

// Virtual for total items count
orderSchema.virtual("totalItems").get(function () {
  return this.items.reduce((total: number, item: any) => {
    return total + item.quantity;
  }, 0);
});

// Pre-save middleware to generate order number
orderSchema.pre("save", async function (next) {
  if (!this.orderNumber) {
    const date = new Date();
    const year = date.getFullYear().toString().slice(-2);
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const day = date.getDate().toString().padStart(2, "0");

    // Find the last order number for today
    const lastOrder = await mongoose
      .model("Order")
      .findOne({
        orderNumber: new RegExp(`^${year}${month}${day}`),
      })
      .sort({ orderNumber: -1 });

    let sequence = 1;
    if (lastOrder) {
      const lastSequence = parseInt(lastOrder.orderNumber.slice(-4));
      sequence = lastSequence + 1;
    }

    this.orderNumber = `${year}${month}${day}${sequence
      .toString()
      .padStart(4, "0")}`;
  }

  next();
});

// Instance method to update status
orderSchema.methods.updateStatus = function (newStatus: string) {
  this.status = newStatus;
  this.statusHistory.push({
    status: newStatus,
    updatedAt: new Date(),
  });

  return this.save();
};

// Instance method to check if order can be cancelled
orderSchema.methods.canBeCancelled = function () {
  const cancellableStatuses = ["pending", "confirmed"];
  return cancellableStatuses.includes(this.status);
};

// Instance method to check if order can be returned
orderSchema.methods.canBeReturned = function () {
  const returnableStatuses = ["delivered"];
  const maxReturnDays = config.app.maxReturnDays;
  const daysSinceDelivery = this.actualDeliveryDate
    ? Math.floor(
        (Date.now() - this.actualDeliveryDate.getTime()) / (1000 * 60 * 60 * 24)
      )
    : Infinity;

  return (
    returnableStatuses.includes(this.status) &&
    daysSinceDelivery <= maxReturnDays
  );
};

// Static method to get order statistics
orderSchema.statics.getOrderStats = function (filters: any = {}) {
  return this.aggregate([
    { $match: filters },
    {
      $group: {
        _id: null,
        totalOrders: { $sum: 1 },
        totalRevenue: { $sum: "$total" },
        averageOrderValue: { $avg: "$total" },
        totalItems: { $sum: { $sum: "$items.quantity" } },
      },
    },
  ]);
};

// Create and export the Order model
export const Order =
  mongoose.models.Order || mongoose.model("Order", orderSchema);
