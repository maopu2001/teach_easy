import { Types } from "mongoose";

export interface ICategory {
  _id: Types.ObjectId;
  name: string;
  slug: string;
  description?: string;
  parent?: Types.ObjectId | ICategory;
  subject?: string;
  sortOrder: number;
  createdAt: Date;
  updatedAt: Date;

  // Virtual fields
  children?: ICategory[];
}

export type CategoryCreateInput = Omit<
  ICategory,
  "_id" | "createdAt" | "updatedAt" | "children"
>;

export type CategoryUpdateInput = Partial<CategoryCreateInput>;
