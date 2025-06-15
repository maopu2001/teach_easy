import { Types } from "mongoose";

export interface ICategoryStats {
  totalProducts: number;
  activeProducts: number;
  totalOrders: number;
  totalRevenue: number;
  averageRating: number;
  viewCount: number;
}

export interface ICategory {
  _id: Types.ObjectId;
  name: string;
  slug: string;
  description?: string;
  parent?: Types.ObjectId | ICategory;
  subject?: string;
  sortOrder: number;
  stats: ICategoryStats;
  createdAt: Date;
  updatedAt: Date;

  // Virtual fields
  children?: ICategory[];
}

export interface ICategoryDocument extends ICategory {
  updateStats(): Promise<ICategoryDocument>;
}

export interface ICategoryModel {
  getCategoryTree(parentId?: string | null): Promise<ICategory[]>;
  searchCategories(query: string): Promise<ICategory[]>;
}

export type CategoryCreateInput = Omit<
  ICategory,
  "_id" | "createdAt" | "updatedAt" | "stats" | "children"
>;
export type CategoryUpdateInput = Partial<CategoryCreateInput>;
