import mongoose from "mongoose";

export const paymentSchema = new mongoose.Schema(
  {
    // Payment Identification
    paymentId: {
      type: String,
      unique: true,
      required: true,
    },
    transactionId: {
      type: String,
      unique: true,
      sparse: true, // Some payment methods might not have transaction IDs initially
    },

    // Related Order
    order: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // Payment Details
    amount: {
      type: Number,
      required: true,
      min: 0,
    },
    currency: {
      type: String,
      default: "BDT",
      enum: ["BDT", "USD", "EUR"], // Add more as needed
    },

    // Payment Method Details
    paymentMethod: {
      type: String,
      enum: ["card", "bank_transfer", "cod", "bkash", "nagad"],
      required: true,
    },

    // Card Payment Details
    cardDetails: {
      last4: String,
      brand: { type: String, enum: ["visa", "mastercard", "amex"] },
      expiryMonth: Number,
      expiryYear: Number,
      cardholderName: String,
      issuingBank: String,
    },

    // Mobile Banking Details (for bKash, Nagad, etc.)
    mobileBankingDetails: {
      accountNumber: String,
      accountHolderName: String,
      referenceNumber: String,
      senderNumber: String,
    },

    // Bank Transfer Details
    bankTransferDetails: {
      bankName: String,
      accountNumber: String,
      accountHolderName: String,
      routingNumber: String,
      referenceNumber: String,
      transferDate: Date,
    },

    // Payment Status
    status: {
      type: String,
      enum: [
        "pending",
        "processing",
        "completed",
        "failed",
        "cancelled",
        "refunded",
        "partially_refunded",
        "disputed",
        "chargeback",
      ],
      default: "pending",
    },

    // Status History
    statusHistory: [
      {
        status: { type: String, required: true },
        timestamp: { type: Date, default: Date.now },
        gatewayResponse: mongoose.Schema.Types.Mixed,
      },
    ],

    // Timestamps
    authorizedAt: Date,
    capturedAt: Date,
    failedAt: Date,
    refundedAt: Date,

    // Failure Information
    failureReason: String,
    failureCode: String,
    gatewayErrorMessage: String,

    // Refund Information
    refund: {
      refundId: { type: String, required: true },
      amount: { type: Number, required: true },
      reason: String,
      status: {
        type: String,
        enum: ["pending", "processing", "completed", "failed"],
        default: "pending",
      },
      gatewayRefundId: String,
      processedAt: Date,
      createdAt: { type: Date, default: Date.now },
    },

    // Fees & Charges
    fees: {
      gatewayFee: { type: Number, default: 0 },
      processingFee: { type: Number, default: 0 },
      platformFee: { type: Number, default: 0 },
      totalFees: { type: Number, default: 0 },
    },

    // User Information (at time of payment)
    userSnapshot: {
      type: mongoose.Schema.Types.Mixed,
      required: true,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Indexes
paymentSchema.index({ order: 1 });
paymentSchema.index({ user: 1, createdAt: -1 });
paymentSchema.index({ status: 1, createdAt: -1 });
paymentSchema.index({ paymentMethod: 1 });

// Virtual for net amount after fees
paymentSchema.virtual("netAmount").get(function () {
  return this.amount - (this?.fees?.totalFees || 0);
});

// Pre-save middleware to generate payment ID
paymentSchema.pre("save", async function (next) {
  if (!this.paymentId) {
    const date = new Date();
    const year = date.getFullYear().toString().slice(-2);
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const day = date.getDate().toString().padStart(2, "0");

    // Find the last payment ID for today
    const lastPayment = await mongoose
      .model("Payment")
      .findOne({
        paymentId: new RegExp(`^PAY${year}${month}${day}`),
      })
      .sort({ paymentId: -1 });

    let sequence = 1;
    if (lastPayment) {
      const lastSequence = parseInt(lastPayment.paymentId.slice(-6));
      sequence = lastSequence + 1;
    }

    this.paymentId = `PAY${year}${month}${day}${sequence
      .toString()
      .padStart(6, "0")}`;
  }

  // Calculate total fees
  if (this.isModified("fees") && this.fees) {
    this.fees.totalFees =
      (this?.fees?.gatewayFee || 0) +
      (this?.fees?.processingFee || 0) +
      (this?.fees?.platformFee || 0);
  }

  next();
});

// Instance method to update status
paymentSchema.methods.updateStatus = function (
  newStatus: string,
  gatewayResponse?: any
) {
  this.status = newStatus;
  this.statusHistory.push({
    status: newStatus,
    gatewayResponse: gatewayResponse,
    timestamp: new Date(),
  });

  // Update relevant timestamps
  switch (newStatus) {
    case "completed":
      this.capturedAt = new Date();
      break;
    case "failed":
      this.failedAt = new Date();
      break;
    case "refunded":
      this.refundedAt = new Date();
      break;
  }

  return this.save();
};

// Instance method to process refund
paymentSchema.methods.processRefund = function (
  amount: number,
  reason?: string
) {
  if (amount > this.refundableAmount) {
    throw new Error("Refund amount exceeds refundable amount");
  }

  const refundId = `REF${Date.now()}${Math.random()
    .toString(36)
    .substring(2, 8)
    .toUpperCase()}`;

  this.refunds.push({
    refundId: refundId,
    amount: amount,
    reason: reason,
    createdAt: new Date(),
  });

  return this.save();
};

// Instance method to add dispute
paymentSchema.methods.addDispute = function (amount: number, reason: string) {
  const disputeId = `DIS${Date.now()}${Math.random()
    .toString(36)
    .substring(2, 8)
    .toUpperCase()}`;

  this.disputes.push({
    disputeId: disputeId,
    amount: amount,
    reason: reason,
    createdAt: new Date(),
  });

  return this.save();
};

// Static method to get payment statistics
paymentSchema.statics.getPaymentStats = function (filters: any = {}) {
  return this.aggregate([
    { $match: filters },
    {
      $group: {
        _id: "$status",
        count: { $sum: 1 },
        totalAmount: { $sum: "$amount" },
        avgAmount: { $avg: "$amount" },
      },
    },
  ]);
};

// Static method to get revenue by payment method
paymentSchema.statics.getRevenueByMethod = function (
  startDate: Date,
  endDate: Date
) {
  return this.aggregate([
    {
      $match: {
        status: "completed",
        createdAt: { $gte: startDate, $lte: endDate },
      },
    },
    {
      $group: {
        _id: "$paymentMethod",
        totalRevenue: { $sum: "$amount" },
        count: { $sum: 1 },
        avgAmount: { $avg: "$amount" },
      },
    },
    { $sort: { totalRevenue: -1 } },
  ]);
};

// Create and export the Payment model
export const Payment =
  mongoose.models.Payment || mongoose.model("Payment", paymentSchema);
