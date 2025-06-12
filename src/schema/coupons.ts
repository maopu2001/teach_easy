import mongoose from "mongoose";

export const couponSchema = new mongoose.Schema(
  {
    // Basic Information
    code: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      trim: true,
      minlength: 3,
      maxlength: 20,
      match: [
        /^[A-Z0-9]+$/,
        "Coupon code must contain only uppercase letters and numbers",
      ],
    },
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },
    description: {
      type: String,
      maxlength: 500,
    },

    // Discount Configuration
    type: {
      type: String,
      enum: ["percentage", "fixed_amount", "free_shipping"],
      required: true,
    },
    value: {
      type: Number,
      required: true,
      min: 0,
    },
    maxdiscount: {
      type: Number,
      min: 0, // Maximum discount for percentage coupons
    },

    // Validity Period
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
      required: true,
    },

    // Usage Limits
    usageLimit: {
      type: Number,
      min: 1, // Total usage limit
    },
    usageLimitPerUser: {
      type: Number,
      min: 1,
      default: 1,
    },
    currentUsage: {
      type: Number,
      default: 0,
      min: 0,
    },

    // Minimum Requirements
    minimumOrderAmount: {
      type: Number,
      min: 0,
      default: 0,
    },
    minimumQuantity: {
      type: Number,
      min: 1,
    },

    // Product/Category Restrictions
    applicableProducts: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
      },
    ],
    applicableCategories: [String],
    excludedProducts: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
      },
    ],
    excludedCategories: [String],

    // User Restrictions
    applicableUsers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    applicableUserRoles: [
      {
        type: String,
        enum: ["customer", "vendor", "admin"],
      },
    ],
    excludedUsers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    newUsersOnly: {
      type: Boolean,
      default: false,
    },

    // Status and Visibility
    isActive: {
      type: Boolean,
      default: true,
    },
    isPublic: {
      type: Boolean,
      default: true, // If false, only specific users can see/use it
    },
    isAutoApply: {
      type: Boolean,
      default: false, // Automatically apply if conditions are met
    },

    // Stackability
    isStackable: {
      type: Boolean,
      default: false, // Can be combined with other coupons
    },
    stackableWith: [String], // Coupon codes that this can be stacked with

    // Usage Tracking
    usageHistory: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          required: true,
        },
        order: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Order",
          required: true,
        },
        discount: {
          type: Number,
          required: true,
        },
        usedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],

    // Special Conditions
    firstOrderOnly: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Indexes
couponSchema.index({ code: 1 });
couponSchema.index({ isActive: 1, startDate: 1, endDate: 1 });
couponSchema.index({ type: 1 });
couponSchema.index({ "usageHistory.user": 1 });

// Virtual for remaining usage
couponSchema.virtual("remainingUsage").get(function () {
  if (!this.usageLimit) return null;
  return Math.max(0, this.usageLimit - this.currentUsage);
});

// Virtual for usage percentage
couponSchema.virtual("usagePercentage").get(function () {
  if (!this.usageLimit) return 0;
  return Math.round((this.currentUsage / this.usageLimit) * 100);
});

// Virtual for expiry status
couponSchema.virtual("isExpired").get(function () {
  return new Date() > this.endDate;
});

// Virtual for active status
couponSchema.virtual("isCurrentlyValid").get(function () {
  const now = new Date();
  return (
    this.isActive &&
    now >= this.startDate &&
    now <= this.endDate &&
    (!this.usageLimit || this.currentUsage < this.usageLimit)
  );
});

// Pre-save middleware
couponSchema.pre("save", function (next) {
  // Ensure end date is after start date
  if (this.endDate <= this.startDate) {
    return next(new Error("End date must be after start date"));
  }

  // Validate percentage coupons
  if (this.type === "percentage" && this.value > 100) {
    return next(new Error("Percentage discount cannot exceed 100%"));
  }

  next();
});

// Instance method to check if coupon is valid for a user
couponSchema.methods.isValidForUser = function (userId: string) {
  // Check if user has exceeded usage limit
  if (this.usageLimitPerUser) {
    const userUsage = this.usageHistory.filter(
      (usage: any) => usage.user.toString() === userId
    ).length;

    if (userUsage >= this.usageLimitPerUser) {
      return { valid: false, reason: "Usage limit per user exceeded" };
    }
  }

  // Check if user is in applicable users list
  if (this.applicableUsers.length > 0) {
    const isApplicable = this.applicableUsers.some(
      (user: any) => user.toString() === userId
    );
    if (!isApplicable) {
      return { valid: false, reason: "Coupon not applicable for this user" };
    }
  }

  // Check if user is excluded
  if (this.excludedUsers.length > 0) {
    const isExcluded = this.excludedUsers.some(
      (user: any) => user.toString() === userId
    );
    if (isExcluded) {
      return { valid: false, reason: "User is excluded from this coupon" };
    }
  }

  return { valid: true };
};

// Instance method to apply coupon usage
couponSchema.methods.recordUsage = function (
  userId: string,
  orderId: string,
  discount: number
) {
  this.usageHistory.push({
    user: userId,
    order: orderId,
    discount: discount,
    usedAt: new Date(),
  });

  this.currentUsage += 1;
  return this.save();
};

// Static method to find valid coupons for auto-apply
couponSchema.statics.findAutoApplicableCoupons = function () {
  const now = new Date();
  return this.find({
    isActive: true,
    isAutoApply: true,
    startDate: { $lte: now },
    endDate: { $gte: now },
    $or: [
      { usageLimit: { $exists: false } },
      { $expr: { $lt: ["$currentUsage", "$usageLimit"] } },
    ],
  });
};

// Create and export the Coupon model
export const Coupon =
  mongoose.models.Coupon || mongoose.model("Coupon", couponSchema);
