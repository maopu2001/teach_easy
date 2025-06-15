import { Types } from "mongoose";

// Note: The inventory schema is currently empty
// This is a placeholder for future inventory types

export interface IInventory {
  _id: Types.ObjectId;
  // Add inventory fields when schema is implemented
  createdAt: Date;
  updatedAt: Date;
}

export type InventoryCreateInput = Omit<
  IInventory,
  "_id" | "createdAt" | "updatedAt"
>;
export type InventoryUpdateInput = Partial<InventoryCreateInput>;
