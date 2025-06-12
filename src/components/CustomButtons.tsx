"use client";
import { useCart } from "@/store/cartStore";
import { Button } from "./ui/button";
import { Heart, ShoppingCart } from "lucide-react";
import { useWishlist } from "@/store/wishlistStore";
import { Share2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { toast } from "sonner";
import config from "@/lib/config";

export const BuyNowButton = ({ id }: { id: string }) => {
  const handleBuyNow = () => {
    console.log(`Buying ${id} now`);
  };

  return <Button onClick={handleBuyNow}>Buy Now</Button>;
};

export const AddToCartButton = ({
  id,
  disabled = false,
}: {
  id: string;
  disabled?: boolean;
}) => {
  const { cart, addToCart } = useCart();
  const currentQuantity = cart.filter((item) => item === id).length;
  const isMaxReached = currentQuantity >= config.app.maxItems;
  const isDisabled = disabled || isMaxReached;

  const handleAddToCart = () => {
    if (!isDisabled) {
      addToCart(id);
    }
  };

  return (
    <Button
      className="w-full h-full bg-primary text-white hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
      onClick={handleAddToCart}
      disabled={isDisabled}
    >
      <div className="flex items-center gap-2">
        <ShoppingCart className="size-5" />
        <span>
          {disabled
            ? "Out of Stock"
            : isMaxReached
            ? `Max ${config.app.maxItems} items`
            : "Add to Cart"}
        </span>
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
  maxStock = config.app.maxItems,
  disabled = false,
}: {
  id: string;
  quantity: number;
  maxStock?: number;
  disabled?: boolean;
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
        disabled={disabled}
        aria-label="Decrease quantity"
      >
        -
      </Button>
      <span className="w-6 text-center select-none">{quantity}</span>
      <Button
        variant="outline"
        size="icon"
        className="h-7 w-7 px-0"
        disabled={
          disabled || quantity >= Math.min(config.app.maxItems, maxStock)
        }
        onClick={() => addToCart(id)}
        aria-label="Increase quantity"
      >
        +
      </Button>
    </div>
  );
};

export const ShareButton = () => {
  const href = typeof window !== "undefined" ? window.location.href : "";

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(href);
      toast.success("Link copied to clipboard");
    } catch {
      toast.error("Failed to copy link");
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="w-full h-full">
          <Share2 className="size-5" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Copy link to share</DialogTitle>
        </DialogHeader>
        <div className="w-full flex items-center gap-2 border px-3 py-2 rounded-md bg-muted">
          <span className="flex-1 text-sm truncate">{href}</span>
          <Button
            size="sm"
            variant="outline"
            onClick={handleCopyLink}
            className="shrink-0"
          >
            Copy
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
