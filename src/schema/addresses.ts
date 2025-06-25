import mongoose from "mongoose";

export const addressSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
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
    },
    district: {
      type: String,
      required: true,
      trim: true,
    },
    cityOrUpazila: {
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
addressSchema.index(
  { user: 1, isDefault: 1 },
  { unique: true, partialFilterExpression: { isDefault: true } }
);
addressSchema.index({ division: 1, district: 1, city: 1 });
addressSchema.index({ postalCode: 1 });

// Virtual for full address
addressSchema.virtual("fullAddress").get(function () {
  let address = this.addressLine;
  if (this.landmark) address += `, ${this.landmark}`;
  if (this.cityOrUpazila) address += `, ${this.cityOrUpazila}`;
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
  if (this.cityOrUpazila) address += `\n${this.cityOrUpazila}`;
  address += `\n${this.district}, ${this.division}`;
  if (this.postalCode) address += ` - ${this.postalCode}`;
  return address;
});

// Instance method to mark as used
addressSchema.methods.markAsUsed = function () {
  this.lastUsedAt = new Date();
  this.usageCount += 1;
  return this.save();
};

addressSchema.statics.getAddressesByUser = function (userId: string) {
  return this.find({ user: userId }).sort({ createdAt: -1 });
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
