"use client";
import { MAX_ITEMS, useCart } from "@/store/cartStore";
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
  const { cart, addToCart } = useCart();
  const currentQuantity = cart.filter((item) => item === id).length;
  const isMaxReached = currentQuantity >= MAX_ITEMS;

  const handleAddToCart = () => {
    if (!isMaxReached) {
      addToCart(id);
    }
  };

  return (
    <Button
      className="w-full h-full bg-primary text-white hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
      onClick={handleAddToCart}
      disabled={isMaxReached}
    >
      <div className="flex items-center gap-2">
        <ShoppingCart className="size-5" />
        <span>{isMaxReached ? `Max ${MAX_ITEMS} items` : "Add to Cart"}</span>
      </div>
    </Button>
  );
};

export const AddToWishlistButton = ({ id }: { id: string }) => {
  const { items, addToWishlist, removeFromWishlist } = useWishlist();
  const isInWishlist = items.includes(id);

  const handleWishlist = () => {
    if (isInWishlist) {
      removeFromWishlist(id);
      console.log(`Removed ${id} from wishlist`);
    } else {
      addToWishlist(id);
      console.log(`Added ${id} to wishlist`);
    }
  };

  return (
    <Button
      className="w-full h-full"
      variant="outline"
      onClick={handleWishlist}
    >
      <div className="flex items-center gap-2">
        <Heart
          className="size-5"
          fill={isInWishlist ? "currentColor" : "none"}
        />
        <span>{isInWishlist ? `Wishlisted` : `Add to Wishlist`}</span>
      </div>
    </Button>
  );
};

export const ChangeItemQuantity = ({
  id,
  quantity,
}: {
  id: string;
  quantity: number;
}) => {
  const { addToCart, removeFromCart } = useCart();

  if (quantity <= 0) return null;

  return (
    <div className="flex items-center gap-2">
      <Button
        variant="outline"
        size="icon"
        className="h-7 w-7 px-0"
        onClick={() => removeFromCart(id)}
        aria-label="Decrease quantity"
      >
        -
      </Button>
      <span className="w-6 text-center select-none">{quantity}</span>
      <Button
        variant="outline"
        size="icon"
        className="h-7 w-7 px-0"
        disabled={quantity >= MAX_ITEMS}
        onClick={() => addToCart(id)}
        aria-label="Increase quantity"
      >
        +
      </Button>
    </div>
  );
};
