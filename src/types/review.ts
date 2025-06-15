import { Types } from "mongoose";

export type ReviewStatus = "pending" | "approved" | "rejected" | "hidden";

export type VoteType = "helpful" | "not_helpful";

export interface IReviewImage {
  url: string;
  uploadedAt: Date;
}

export interface IReviewVoter {
  user: Types.ObjectId;
  vote: VoteType;
  votedAt: Date;
}

export interface IReviewResponse {
  content: string;
  respondedAt: Date;
  isPublic: boolean;
}

export interface IReviewEditHistory {
  editedAt: Date;
  changes: any; // Mixed type for change details
  reason?: string;
}

export interface IReview {
  _id: Types.ObjectId;
  user: Types.ObjectId;
  product: Types.ObjectId;
  order: Types.ObjectId;
  rating: number;
  title: string;
  content: string;
  images: IReviewImage[];
  status: ReviewStatus;
  moderationReason?: string;
  moderatedAt?: Date;
  helpfulVotes: number;
  notHelpfulVotes: number;
  voters: IReviewVoter[];
  response?: IReviewResponse;
  editHistory: IReviewEditHistory[];
  createdAt: Date;
  updatedAt: Date;

  // Virtual fields
  totalVotes: number;
  helpfulnessPercentage: number;
}

export interface IReviewDocument extends IReview {
  voteHelpful(userId: string, isHelpful: boolean): Promise<IReviewDocument>;
  addResponse(content: string, isPublic?: boolean): Promise<IReviewDocument>;
}

export interface IReviewModel {
  getProductReviews(
    productId: string,
    sort?: string,
    limit?: number,
    skip?: number
  ): Promise<IReview[]>;
  getReviewStats(productId: string): Promise<any[]>;
}

export type ReviewCreateInput = Omit<
  IReview,
  | "_id"
  | "createdAt"
  | "updatedAt"
  | "helpfulVotes"
  | "notHelpfulVotes"
  | "voters"
  | "editHistory"
  | "totalVotes"
  | "helpfulnessPercentage"
>;
export type ReviewUpdateInput = Partial<ReviewCreateInput>;
