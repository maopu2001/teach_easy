"use client";
import { useCart } from "@/store/cartStore";
import { Button } from "./ui/button";

export const BuyNowButton = ({ id }: { id: string }) => {
  const handleBuyNow = () => {
    console.log(`Buying ${id} now`);
  };

  return <Button onClick={handleBuyNow}>Buy Now</Button>;
};

export const AddToCartButton = ({ id }: { id: string }) => {
  const { addToCart } = useCart();
  const handleAddToCart = () => {
    addToCart(id);
  };

  return (
    <Button variant="outline" onClick={handleAddToCart}>
      Add to Cart
    </Button>
  );
};
