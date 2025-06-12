import mongoose from "mongoose";

export const cartSchema = new mongoose.Schema(
  {
    // User Reference
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true, // One cart per user
    },

    // Cart Items
    items: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        productSnapshot: {
          type: mongoose.Schema.Types.Mixed,
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
          min: 1,
          default: 1,
        },
        addedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],

    // Applied Promotions
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
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Indexes
cartSchema.index({ "items.product": 1 });

// Virtual for total quantity
cartSchema.virtual("totalQuantity").get(function () {
  return this.items.reduce(
    (total: number, item: any) => total + item.quantity,
    0
  );
});

// Virtual for subtotal calculation
cartSchema.virtual("subtotal").get(function () {
  return this.items.reduce((total: number, item: any) => {
    const price = item.productSnapshot?.price || 0;
    const discount = item.productSnapshot?.discount || 0;
    const finalPrice = Math.max(0, price - discount);
    return total + finalPrice * item.quantity;
  }, 0);
});

// Virtual for total savings
cartSchema.virtual("totalSavings").get(function () {
  return this.items.reduce((total: number, item: any) => {
    const discount = item.productSnapshot?.discount || 0;
    return total + discount * item.quantity;
  }, 0);
});

// Virtual for cart value without shipping
cartSchema.virtual("cartValue").get(function () {
  const subtotal = this.get("subtotal");
  const couponDiscount = this.appliedCoupons.reduce(
    (total: number, coupon: any) => {
      return total + (coupon.discount || 0);
    },
    0
  );
  return Math.max(0, subtotal - couponDiscount);
});

// Instance method to add item
cartSchema.methods.addItem = function (
  productId: string,
  quantity: number = 1,
  productData?: any
) {
  const existingItemIndex = this.items.findIndex(
    (item: any) => item.product.toString() === productId
  );

  if (existingItemIndex > -1) {
    // Update existing item
    this.items[existingItemIndex].quantity = Math.min(
      this.items[existingItemIndex].quantity + quantity,
      10 // Max quantity
    );
  } else {
    // Add new item
    this.items.push({
      product: productId,
      quantity: Math.min(quantity, 10),
      productSnapshot: productData,
    });
  }

  return this.save();
};

// Instance method to remove item
cartSchema.methods.removeItem = function (productId: string) {
  this.items = this.items.filter(
    (item: any) => item.product.toString() !== productId
  );
  return this.save();
};

// Instance method to update quantity
cartSchema.methods.updateQuantity = function (
  productId: string,
  quantity: number
) {
  const item = this.items.find(
    (item: any) => item.product.toString() === productId
  );

  if (item) {
    if (quantity <= 0) {
      return this.removeItem(productId);
    } else {
      item.quantity = Math.min(quantity, 10);
      return this.save();
    }
  }

  throw new Error("Item not found in cart");
};

// Instance method to clear cart
cartSchema.methods.clearCart = function () {
  this.items = [];
  this.appliedCoupons = [];
  return this.save();
};

// Instance method to apply coupon
cartSchema.methods.applyCoupon = function (
  couponId: string,
  code: string,
  discount: number
) {
  // Check if coupon already applied
  const existingCoupon = this.appliedCoupons.find(
    (coupon: any) => coupon.coupon.toString() === couponId
  );

  if (!existingCoupon) {
    this.appliedCoupons.push({
      coupon: couponId,
      code: code,
      discount: discount,
    });
  }

  return this.save();
};

// Instance method to remove coupon
cartSchema.methods.removeCoupon = function (couponId: string) {
  this.appliedCoupons = this.appliedCoupons.filter(
    (coupon: any) => coupon.coupon.toString() !== couponId
  );
  return this.save();
};

// Static method to find or create cart
cartSchema.statics.findOrCreateCart = function (userId: string) {
  return this.findOneAndUpdate(
    { user: userId },
    {
      user: userId,
      $setOnInsert: {
        items: [],
      },
    },
    {
      upsert: true,
      new: true,
      setDefaultsOnInsert: true,
    }
  );
};

// Create and export the Cart model
export const Cart = mongoose.models.Cart || mongoose.model("Cart", cartSchema);
