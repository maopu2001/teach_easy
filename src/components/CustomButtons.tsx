"use client";
import { useCart } from "@/store/cartStore";
import { Button } from "./ui/button";
import { Heart, ShoppingCart } from "lucide-react";
import { useWishlist } from "@/store/wishlistStore";

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
    <Button
      className="p-0 w-5 hover:w-32 hover:bg-primary/20 hover:text-primary  group relative overflow-hidden transition-all duration-300"
      variant="ghost"
      onClick={handleAddToCart}
    >
      <div className="flex items-center gap-2 translate-x-10 group-hover:translate-x-0 transition-all duration-300">
        <ShoppingCart className="size-5" />
        <span>Add to Cart</span>
      </div>
    </Button>
  );
};

export const AddToWishlistButton = ({ id }: { id: string }) => {
  const { items, addToWishlist, removeFromWishlist } = useWishlist();
  const isInWishlist = items.includes(id);

  const handleAddToWishlist = () => {
    addToWishlist(id);
    console.log(`Added ${id} to wishlist`);
  };

  const handleRemoveFromWishlist = () => {
    removeFromWishlist(id);
    console.log(`Removed ${id} from wishlist`);
  };

  if (isInWishlist)
    return (
      <Button
        className="p-0 w-6 hover:w-36 group relative overflow-hidden transition-all duration-300"
        variant="ghost"
        onClick={handleRemoveFromWishlist}
      >
        <div className="flex items-center gap-2 translate-x-8 group-hover:translate-x-0 transition-all duration-300">
          <Heart className="size-5" fill="currentColor" />
          <span>Remove</span>
        </div>
      </Button>
    );

  return (
    <Button
      className="p-0 w-6 hover:w-36 group relative overflow-hidden transition-all duration-300"
      variant="ghost"
      onClick={handleAddToWishlist}
    >
      <div className="flex items-center gap-2 translate-x-13 group-hover:translate-x-0 transition-all duration-300">
        <Heart className="size-5" />
        <span>Add to Wishlist</span>
      </div>
    </Button>
  );
};
