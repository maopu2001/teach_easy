import mongoose from "mongoose";

export const reviewSchema = new mongoose.Schema(
  {
    // User and Product References
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    order: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
      required: true, // Only verified purchasers can review
    },

    // Review Content
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },
    content: {
      type: String,
      required: true,
      trim: true,
      maxlength: 2000,
    },

    // Media Attachments
    images: [
      {
        url: { type: String, required: true },
        uploadedAt: { type: Date, default: Date.now },
      },
    ],

    // Review Status
    status: {
      type: String,
      enum: ["pending", "approved", "rejected", "hidden"],
      default: "pending",
    },
    moderationReason: String,
    moderatedAt: Date,

    // Helpfulness Voting
    helpfulVotes: {
      type: Number,
      default: 0,
    },
    notHelpfulVotes: {
      type: Number,
      default: 0,
    },

    voters: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          required: true,
        },
        vote: {
          type: String,
          enum: ["helpful", "not_helpful"],
          required: true,
        },
        votedAt: { type: Date, default: Date.now },
      },
    ],

    // Response
    response: {
      content: String,
      respondedAt: Date,
      isPublic: { type: Boolean, default: true },
    },

    // Edit History
    editHistory: [
      {
        editedAt: { type: Date, default: Date.now },
        changes: mongoose.Schema.Types.Mixed,
        reason: String,
      },
    ],
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Compound indexes
reviewSchema.index({ product: 1, status: 1, createdAt: -1 });
reviewSchema.index({ user: 1, product: 1 }, { unique: true }); // One review per user per product
reviewSchema.index({ user: 1, createdAt: -1 });
reviewSchema.index({ rating: 1 });
reviewSchema.index({ status: 1, moderatedAt: -1 });

// Virtual for total votes
reviewSchema.virtual("totalVotes").get(function () {
  return this.helpfulVotes + this.notHelpfulVotes;
});

// Virtual for helpfulness percentage
reviewSchema.virtual("helpfulnessPercentage").get(function () {
  const total = this.get("totalVotes");
  return total > 0 ? Math.round((this.helpfulVotes / total) * 100) : 0;
});

// Instance method to vote on helpfulness
reviewSchema.methods.voteHelpful = function (
  userId: string,
  isHelpful: boolean
) {
  // Remove existing vote if any
  this.voters = this.voters.filter(
    (voter: any) => voter.user.toString() !== userId
  );

  // Add new vote
  this.voters.push({
    user: userId,
    vote: isHelpful ? "helpful" : "not_helpful",
  });

  // Update counters
  this.helpfulVotes = this.voters.filter(
    (v: any) => v.vote === "helpful"
  ).length;
  this.notHelpfulVotes = this.voters.filter(
    (v: any) => v.vote === "not_helpful"
  ).length;

  return this.save();
};

// Instance method to add vendor response
reviewSchema.methods.addResponse = function (
  content: string,
  isPublic: boolean = true
) {
  this.response = {
    content: content,
    respondedAt: new Date(),
    isPublic: isPublic,
  };

  return this.save();
};

// Static method to get product reviews with filters
reviewSchema.statics.getProductReviews = function (
  productId: string,
  sort: string = "-createdAt",
  limit: number = 20,
  skip: number = 0
) {
  return this.find({
    product: productId,
    status: "approved",
  })
    .populate("user", "fullName avatar")
    .sort(sort)
    .limit(limit)
    .skip(skip);
};

// Static method to get review statistics
// TODO: Check if this is needed
reviewSchema.statics.getReviewStats = function (productId: string) {
  return this.aggregate([
    {
      $match: {
        product: new mongoose.Types.ObjectId(productId),
        status: "approved",
      },
    },
    {
      $group: {
        _id: null,
        totalReviews: { $sum: 1 },
        averageRating: { $avg: "$rating" },
        ratingDistribution: {
          $push: "$rating",
        },
      },
    },
    {
      $project: {
        _id: 0,
        totalReviews: 1,
        averageRating: { $round: ["$averageRating", 1] },
        fiveStars: {
          $size: {
            $filter: {
              input: "$ratingDistribution",
              cond: { $eq: ["$$this", 5] },
            },
          },
        },
        fourStars: {
          $size: {
            $filter: {
              input: "$ratingDistribution",
              cond: { $eq: ["$$this", 4] },
            },
          },
        },
        threeStars: {
          $size: {
            $filter: {
              input: "$ratingDistribution",
              cond: { $eq: ["$$this", 3] },
            },
          },
        },
        twoStars: {
          $size: {
            $filter: {
              input: "$ratingDistribution",
              cond: { $eq: ["$$this", 2] },
            },
          },
        },
        oneStar: {
          $size: {
            $filter: {
              input: "$ratingDistribution",
              cond: { $eq: ["$$this", 1] },
            },
          },
        },
      },
    },
  ]);
};

// Create and export the Review model
export const Review =
  mongoose.models.Review || mongoose.model("Review", reviewSchema);
