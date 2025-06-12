import mongoose from "mongoose";

export const userSchema = new mongoose.Schema(
  {
    // Basic Information
    fullName: {
      type: String,
      required: true,
      trim: true,
      maxlength: 50,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        "Please enter a valid email",
      ],
    },
    phone: {
      type: String,
      trim: true,
      match: [
        /^(\+880|880|0)?1[3-9]\d{8}$/,
        "Please enter a valid Bangladeshi phone number",
      ],
    },
    dateOfBirth: Date,
    gender: {
      type: String,
      enum: ["male", "female", "other", "prefer_not_to_say"],
      lowercase: true,
    },

    // Avatar & Profile
    avatar: {
      type: String,
    },
    bio: {
      type: String,
      maxlength: 500,
    },

    // Account Status
    isEmailVerified: {
      type: Boolean,
      default: false,
    },
    isPhoneVerified: {
      type: Boolean,
      default: false,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    isBlocked: {
      type: Boolean,
      default: false,
    },
    blockReason: String,

    // Role & Permissions
    role: {
      type: String,
      enum: ["customer", "teacher", "admin", "superadmin"],
      default: "customer",
    },
    permissions: [
      {
        type: String,
        enum: [
          "read_products",
          "write_products",
          "delete_products",
          "read_orders",
          "write_orders",
          "delete_orders",
          "read_users",
          "write_users",
          "delete_users",
          "read_analytics",
          "write_settings",
          "manage_coupons",
        ],
      },
    ],

    // Addresses (reference to Address collection)
    defaultAddress: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Address",
    },

    // Shopping Preferences
    preferences: {
      currency: { type: String, default: "BDT" },
      language: { type: String, default: "en" },
      notifications: {
        email: { type: Boolean, default: true },
        sms: { type: Boolean, default: true },
        push: { type: Boolean, default: true },
        marketing: { type: Boolean, default: true },
      },
      newsletter: { type: Boolean, default: false },
    },

    // Wishlist & Cart (if not using separate collections)
    wishlist: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
      },
    ],
    cart: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Cart",
    },

    // Analytics & Tracking
    stats: {
      totalOrders: { type: Number, default: 0 },
      totalSpent: { type: Number, default: 0 },
      averageOrderValue: { type: Number, default: 0 },
      lastOrderDate: Date,
      loyaltyPoints: { type: Number, default: 0 },
      reviewsCount: { type: Number, default: 0 },
      averageRating: { type: Number, min: 0, max: 5, default: 0 },
    },

    // Session & Security
    lastLoginAt: Date,
    lastActiveAt: Date,
    loginAttempts: { type: Number, default: 0 },
    lockUntil: Date,

    // Marketing
    referralCode: {
      type: String,
      unique: true,
      sparse: true,
    },
    referredBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    referrals: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

userSchema.index({ phone: 1 });
userSchema.index({ role: 1 });
userSchema.index({ "vendorInfo.isVerified": 1 });
userSchema.index({ createdAt: -1 });

// Virtual for account lock status
userSchema.virtual("isLocked").get(function () {
  return !!(this.lockUntil && this.lockUntil > new Date());
});

// Pre-save middleware
userSchema.pre("save", function (next) {
  // Generate referral code if not exists
  if (!this.referralCode && this.role === "customer") {
    this.referralCode =
      this.email.split("@")[0] +
      Math.random().toString(36).substring(2, 8).toUpperCase();
  }

  next();
});

// Methods
userSchema.methods.incLoginAttempts = function () {
  if (this.lockUntil && this.lockUntil < new Date()) {
    return this.updateOne({
      $unset: { loginAttempts: 1, lockUntil: 1 },
    });
  }

  const updates: any = { $inc: { loginAttempts: 1 } };
  if (this.loginAttempts + 1 >= 5 && !this.isLocked) {
    updates.$set = { lockUntil: new Date(Date.now() + 2 * 60 * 60 * 1000) }; // 2 hours
  }

  return this.updateOne(updates);
};

userSchema.methods.resetLoginAttempts = function () {
  return this.updateOne({
    $unset: { loginAttempts: 1, lockUntil: 1 },
  });
};

// Method to get user's addresses
userSchema.methods.getAddresses = function () {
  return mongoose
    .model("Address")
    .find({
      user: this._id,
      isActive: true,
    })
    .sort({ isDefault: -1, usageCount: -1 });
};

// Method to get user's default address
userSchema.methods.getDefaultAddress = function () {
  return mongoose.model("Address").findOne({
    user: this._id,
    isDefault: true,
    isActive: true,
  });
};

// Method to add new address
userSchema.methods.addAddress = function (addressData: any) {
  const Address = mongoose.model("Address");
  return new Address({
    ...addressData,
    user: this._id,
  }).save();
};

// Create and export the User model
export const User = mongoose.models.User || mongoose.model("User", userSchema);
