import { Types } from "mongoose";
import type {
  IUser,
  IAddress,
  IAuth,
  ICart,
  ICategory,
  ICoupon,
  IOrder,
  IPayment,
  IProduct,
  IReview,
} from "@/types";

export function objectIdToString(id: any): string {
  if (!id) return "";
  if (typeof id === "string") return id;
  if (id instanceof Types.ObjectId || id.toString) return id.toString();
  return "";
}

export function dateToString(date: any): string | null {
  if (!date) return null;
  if (date instanceof Date) return date.toISOString();
  if (typeof date === "string") return date;
  return null;
}

export function mongoDocToObject<T>(doc: any): T {
  if (!doc) return {} as T;

  const obj = doc.toObject ? doc.toObject({ virtuals: true }) : { ...doc };

  Object.keys(obj).forEach((key) => {
    if (obj[key] instanceof Types.ObjectId) {
      obj[key] = obj[key].toString();
    } else if (obj[key] instanceof Date) {
      obj[key] = obj[key].toISOString();
    } else if (Array.isArray(obj[key])) {
      obj[key] = obj[key].map((item: any) => {
        if (item instanceof Types.ObjectId) {
          return item.toString();
        } else if (item instanceof Date) {
          return item.toISOString();
        } else if (typeof item === "object" && item !== null) {
          return mongoDocToObject(item);
        }
        return item;
      });
    } else if (typeof obj[key] === "object" && obj[key] !== null) {
      obj[key] = mongoDocToObject(obj[key]);
    }
  });

  return obj as T;
}

export function mongoDocsToObjects<T>(docs: any[]): T[] {
  if (!docs) return [] as T[];
  return docs.map((doc) => mongoDocToObject<T>(doc));
}

export function userToObject(user: any): IUser {
  if (!user) return {} as IUser;

  const userObj = mongoDocToObject<IUser>(user);

  if (userObj.preferences) {
    userObj.preferences = mongoDocToObject(userObj.preferences);
  }

  return userObj;
}

export function addressToObject(address: any): IAddress {
  if (!address) return {} as IAddress;
  return mongoDocToObject<IAddress>(address);
}

export function authToObject(auth: any): IAuth {
  if (!auth) return {} as IAuth;
  return mongoDocToObject<IAuth>(auth);
}

export function cartToObject(cart: any): ICart {
  if (!cart) return {} as ICart;

  const cartObj = mongoDocToObject<ICart>(cart);

  if (cartObj.items) {
    cartObj.items = cartObj.items.map((item: any) => mongoDocToObject(item));
  }

  return cartObj;
}

export function categoryToObject(category: any): ICategory {
  if (!category) return {} as ICategory;
  return mongoDocToObject<ICategory>(category);
}

export function couponToObject(coupon: any): ICoupon {
  if (!coupon) return {} as ICoupon;
  return mongoDocToObject<ICoupon>(coupon);
}

export function orderToObject(order: any): IOrder {
  if (!order) return {} as IOrder;

  const obj = order.toObject ? order.toObject() : { ...order };

  const orderObj: any = {
    ...obj,
    _id: objectIdToString(obj._id),
    user: objectIdToString(obj.user),
    shippingAddress: objectIdToString(obj.shippingAddress),
    billingAddress: objectIdToString(obj.billingAddress),
    payment: obj.payment ? objectIdToString(obj.payment) : undefined,
  };

  if (obj.estimatedDeliveryDate)
    orderObj.estimatedDeliveryDate = dateToString(obj.estimatedDeliveryDate);
  if (obj.actualDeliveryDate)
    orderObj.actualDeliveryDate = dateToString(obj.actualDeliveryDate);
  if (obj.createdAt) orderObj.createdAt = dateToString(obj.createdAt);
  if (obj.updatedAt) orderObj.updatedAt = dateToString(obj.updatedAt);

  if (Array.isArray(obj.items)) {
    orderObj.items = obj.items.map((item: any) => ({
      ...item,
      product: objectIdToString(item.product),
      productSnapshot: item.productSnapshot
        ? mongoDocToObject(item.productSnapshot)
        : null,
    }));
  }

  if (Array.isArray(obj.statusHistory)) {
    orderObj.statusHistory = obj.statusHistory.map((history: any) => ({
      ...history,
      updatedAt: dateToString(history.updatedAt) || new Date().toISOString(),
    }));
  }

  if (Array.isArray(obj.appliedCoupons)) {
    orderObj.appliedCoupons = obj.appliedCoupons.map((coupon: any) => ({
      ...coupon,
      coupon: objectIdToString(coupon.coupon),
      appliedAt: dateToString(coupon.appliedAt) || new Date().toISOString(),
    }));
  }

  if (Array.isArray(obj.couponsUsed)) {
    orderObj.couponsUsed = obj.couponsUsed.map((coupon: any) => ({
      ...coupon,
      coupon: objectIdToString(coupon.coupon),
      appliedAt: dateToString(coupon.appliedAt) || new Date().toISOString(),
    }));
  }

  return orderObj as IOrder;
}

export function paymentToObject(payment: any): IPayment {
  if (!payment) return {} as IPayment;
  return mongoDocToObject<IPayment>(payment);
}

export function productToObject(product: any): IProduct {
  if (!product) return {} as IProduct;

  const obj = product.toObject ? product.toObject() : { ...product };

  const productObj: any = {
    ...obj,
    _id: objectIdToString(obj._id),
    category: objectIdToString(obj.category),
  };

  if (Array.isArray(obj.reviews)) {
    productObj.reviews = obj.reviews.map((reviewId: any) =>
      objectIdToString(reviewId)
    );
  }

  if (obj.saleStartDate)
    productObj.saleStartDate = dateToString(obj.saleStartDate);
  if (obj.saleEndDate) productObj.saleEndDate = dateToString(obj.saleEndDate);
  if (obj.createdAt) productObj.createdAt = dateToString(obj.createdAt);
  if (obj.updatedAt) productObj.updatedAt = dateToString(obj.updatedAt);

  return productObj as IProduct;
}

export function reviewToObject(review: any): IReview {
  if (!review) return {} as IReview;
  return mongoDocToObject<IReview>(review);
}
