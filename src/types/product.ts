import { Types } from "mongoose";

export interface IProductImage {
  url: string;
  alt: string;
  isPrimary: boolean;
}

export interface IProductDescription {
  full: string;
  short: string;
}

export interface IProductDimensions {
  length?: number;
  width?: number;
  height?: number;
}

export interface IProductSpecification {
  name: string;
  value: string;
}

export interface IProductRating {
  average: number;
  count: number;
}

export interface IProductSeoMeta {
  title?: string;
  description?: string;
  keywords?: string[];
}

export interface IProduct {
  _id: Types.ObjectId;
  name: string;
  slug?: string;
  description: IProductDescription;
  price: number;
  discount: number;
  imageGallery: IProductImage[];
  category: string;
  subcategory?: string;
  tags: string[];
  stock: number;
  sku?: string;
  weightInGrams?: number;
  dimensionsInCM?: IProductDimensions;
  specifications: IProductSpecification[];
  features: string[];
  rating: IProductRating;
  reviews: Types.ObjectId[];
  isActive: boolean;
  isFeatured: boolean;
  isOnSale: boolean;
  saleStartDate?: Date;
  saleEndDate?: Date;
  minOrderQuantity: number;
  maxOrderQuantity?: number;
  seoMeta?: IProductSeoMeta;
  totalSold: number;
  viewCount: number;
  createdAt: Date;
  updatedAt: Date;

  // Virtual fields
  primaryImage: string;
}

export type ProductCreateInput = Omit<
  IProduct,
  "_id" | "createdAt" | "updatedAt" | "slug" | "primaryImage"
>;
export type ProductUpdateInput = Partial<ProductCreateInput>;
