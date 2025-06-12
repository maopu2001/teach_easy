import mongoose from "mongoose";

export const addressSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    label: {
      type: String,
      trim: true,
      maxlength: 50, // Custom label like "Mom's House", "Office", etc.
    },

    // Contact Information
    fullName: {
      type: String,
      required: true,
      trim: true,
      maxlength: 50,
    },
    phone: {
      type: String,
      required: true,
      trim: true,
      match: [
        /^(\+880|880|0)?1[3-9]\d{8}$/,
        "Please enter a valid Bangladeshi phone number",
      ],
    },
    alternatePhone: {
      type: String,
      trim: true,
      match: [
        /^(\+880|880|0)?1[3-9]\d{8}$/,
        "Please enter a valid Bangladeshi phone number",
      ],
    },
    email: {
      type: String,
      trim: true,
      required: true,
      lowercase: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        "Please enter a valid email",
      ],
    },

    addressLine: {
      type: String,
      required: true,
      trim: true,
      maxlength: 200,
    },
    landmark: {
      type: String,
      trim: true,
      maxlength: 100,
    },

    // Location Hierarchy (Bangladesh specific)
    division: {
      type: String,
      required: true,
      trim: true,
      enum: [
        "Dhaka",
        "Chittagong",
        "Rajshahi",
        "Khulna",
        "Barisal",
        "Sylhet",
        "Rangpur",
        "Mymensingh",
      ],
    },
    district: {
      type: String,
      required: true,
      trim: true,
    },
    upazila: {
      type: String,
      trim: true,
    },
    city: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },
    postalCode: {
      type: String,
      trim: true,
      match: [/^\d{4}$/, "Please enter a valid 4-digit postal code"],
    },

    isDefault: {
      type: Boolean,
      default: false,
    },

    bestTimeToDeliver: {
      type: String,
      enum: ["morning", "afternoon", "evening", "anytime"],
      default: "anytime",
    },

    // Usage Statistics
    usageCount: {
      type: Number,
      default: 0,
    },
    lastUsedAt: Date,
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Indexes
addressSchema.index({ user: 1, isDefault: 1 });
addressSchema.index({ division: 1, district: 1, city: 1 });
addressSchema.index({ postalCode: 1 });

// Virtual for full address
addressSchema.virtual("fullAddress").get(function () {
  let address = this.addressLine;
  if (this.landmark) address += `, ${this.landmark}`;
  if (this.city) address += `, ${this.city}`;
  address += `, ${this.district}, ${this.division}`;
  if (this.postalCode) address += ` ${this.postalCode}`;
  return address;
});

// Virtual for delivery address (formatted for delivery)
addressSchema.virtual("deliveryAddress").get(function () {
  let address = `${this.fullName}\n`;
  address += `${this.phone}`;
  if (this.alternatePhone) address += ` / ${this.alternatePhone}`;
  address += `\n${this.addressLine}`;
  if (this.city) address += `\n${this.city}`;
  address += `\n${this.district}, ${this.division}`;
  if (this.postalCode) address += ` - ${this.postalCode}`;
  return address;
});

// Pre-save middleware
addressSchema.pre("save", async function (next) {
  // Ensure only one default address per user
  if (this.isDefault && this.isModified("isDefault")) {
    await mongoose.model("Address").updateMany(
      {
        user: this.user,
        _id: { $ne: this._id },
        isDefault: true,
      },
      { isDefault: false }
    );
  }

  // If this is the first address for the user, make it default
  if (this.isNew) {
    const existingAddresses = await mongoose
      .model("Address")
      .countDocuments({ user: this.user });

    if (existingAddresses === 0) this.isDefault = true;
  }

  // Update usage count and last used date if this is being used for an order
  if (this.isModified("lastUsedAt")) {
    this.usageCount += 1;
  }

  next();
});

// Instance method to mark as used
addressSchema.methods.markAsUsed = function () {
  this.lastUsedAt = new Date();
  this.usageCount += 1;
  return this.save();
};

// Static method to get user's default address
addressSchema.statics.getDefaultAddress = function (userId: string) {
  return this.findOne({
    user: userId,
    isDefault: true,
  });
};

export const Address =
  mongoose.models.Address || mongoose.model("Address", addressSchema);
