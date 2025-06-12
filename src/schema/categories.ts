import mongoose from "mongoose";

export const categorySchema = new mongoose.Schema(
  {
    // Basic Information
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
      maxlength: 500,
    },

    // Hierarchy
    parent: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      default: null,
    },

    subject: {
      type: String,
    },

    // Sorting & Display
    sortOrder: {
      type: Number,
      default: 0,
    },

    // Category Statistics
    stats: {
      totalProducts: { type: Number, default: 0 },
      activeProducts: { type: Number, default: 0 },
      totalOrders: { type: Number, default: 0 },
      totalRevenue: { type: Number, default: 0 },
      averageRating: { type: Number, default: 0, min: 0, max: 5 },
      viewCount: { type: Number, default: 0 },
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Indexes
categorySchema.index({ slug: 1 });
categorySchema.index({ parent: 1, sortOrder: 1 });
categorySchema.index({ subject: 1 });
categorySchema.index({ sortOrder: 1 });

// Virtual for children categories
categorySchema.virtual("children", {
  ref: "Category",
  localField: "_id",
  foreignField: "parent",
});

// Pre-save middleware
categorySchema.pre("save", async function (next) {
  // Generate slug if not provided
  if (this.isModified("name") && !this.slug) {
    this.slug = this.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
  }
  next();
});

// Instance method to update stats
categorySchema.methods.updateStats = async function () {
  const Product = mongoose.model("Product");
  const Order = mongoose.model("Order");

  // Get all descendant categories
  const descendants = await this.getDescendants();
  const categoryIds = [this._id, ...descendants.map((cat: any) => cat._id)];

  // Calculate product stats
  const productStats = await Product.aggregate([
    { $match: { category: { $in: categoryIds } } },
    {
      $group: {
        _id: null,
        totalProducts: { $sum: 1 },
        activeProducts: {
          $sum: { $cond: [{ $eq: ["$isActive", true] }, 1, 0] },
        },
        averageRating: { $avg: "$rating.average" },
      },
    },
  ]);

  // Calculate order stats
  const orderStats = await Order.aggregate([
    { $unwind: "$items" },
    {
      $lookup: {
        from: "products",
        localField: "items.product",
        foreignField: "_id",
        as: "product",
      },
    },
    { $unwind: "$product" },
    { $match: { "product.category": { $in: categoryIds } } },
    {
      $group: {
        _id: null,
        totalOrders: { $sum: 1 },
        totalRevenue: { $sum: "$items.totalPriceInPaisa" },
      },
    },
  ]);

  // Update stats
  if (productStats.length > 0) {
    this.stats.totalProducts = productStats[0].totalProducts;
    this.stats.activeProducts = productStats[0].activeProducts;
    this.stats.averageRating = productStats[0].averageRating || 0;
  }

  if (orderStats.length > 0) {
    this.stats.totalOrders = orderStats[0].totalOrders;
    this.stats.totalRevenue = orderStats[0].totalRevenue;
  }

  return this.save();
};

// Static method to get category tree
categorySchema.statics.getCategoryTree = function (
  parentId: string | null = null
) {
  return this.find({
    parent: parentId,
    isActive: true,
    isVisible: true,
  })
    .sort({ sortOrder: 1, name: 1 })
    .populate("children")
    .exec();
};

// Static method to search categories
categorySchema.statics.searchCategories = function (query: string) {
  const searchCriteria = {
    $or: [
      { name: { $regex: query, $options: "i" } },
      { description: { $regex: query, $options: "i" } },
    ],
  };

  return this.find(searchCriteria).sort({ "stats.totalProducts": -1, name: 1 });
};

// Create and export the Category model
export const Category =
  mongoose.models.Category || mongoose.model("Category", categorySchema);
