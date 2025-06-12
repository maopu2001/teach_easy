export { User, userSchema } from "./users";
export { Auth, authSchema } from "./auths";
export { Product, productSchema } from "./products";
export { Coupon, couponSchema } from "./coupons";
export { Order, orderSchema } from "./orders";
export { Payment, paymentSchema } from "./payments";
export { Address, addressSchema } from "./addresses";
export { Cart, cartSchema } from "./carts";
export { Review, reviewSchema } from "./reviews";
export { Category, categorySchema } from "./categories";

export const initializeSchemas = () => {
  console.log("All schemas initialized");
};
