"use client";
import { Heart, ShoppingCart, Trash2, X } from "lucide-react";
import { Button } from "./ui/button";
import { useWishlist } from "@/store/wishlistStore";
import { useCart } from "@/store/cartStore";
import { useEffect, useState } from "react";
import { products } from "@/lib/testProducts";
import { formatCurrency } from "@/lib/formatter";
import Image from "next/image";
import Link from "next/link";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "./ui/sheet";

type Product = {
  id: string;
  name: string;
  price: number;
  discountInPercent: number;
  category: string;
  class?: string;
  tag?: string;
  rating: number;
  noOfRating: number;
  imageUrl: string;
  stock: number;
  isAvailable: boolean;
  isOutOfStock: boolean;
  isLowStock: boolean;
};

interface WishlistProps {
  trigger?: React.ReactNode;
}

const Wishlist = ({ trigger }: WishlistProps = {}) => {
  const { items, removeFromWishlist, clearWishlist } = useWishlist();
  const { addToCart } = useCart();
  const [wishlistProducts, setWishlistProducts] = useState<Product[]>([]);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const tempProducts = items
      .map((id) => {
        return products.find((p) => p.id === id);
      })
      .filter((product) => product !== undefined) as Product[];

    setWishlistProducts(tempProducts);
  }, [items]);

  const isWishlistEmpty = items.length === 0;

  const defaultTrigger = (
    <Button
      variant="ghost"
      size="icon"
      className="relative"
      aria-label="Open wishlist"
    >
      <Heart className="h-6 w-6" />
      {!isWishlistEmpty && (
        <span className="absolute -top-1 -right-1 flex items-center justify-center w-5 h-5 text-xs rounded-full bg-primary text-primary-foreground">
          {items.length}
        </span>
      )}
    </Button>
  );

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>{trigger || defaultTrigger}</SheetTrigger>
      <SheetContent
        side="right"
        className="sm:max-w-md w-[90vw] max-w-[400px] h-full flex flex-col p-0"
      >
        <SheetHeader className="flex flex-row justify-between items-center px-6 py-4 border-b">
          <SheetTitle className="text-lg font-semibold">My Wishlist</SheetTitle>
          <Button
            asChild
            className="size-8 p-1 rounded-full"
            variant="ghost"
            size="icon"
            onClick={() => setOpen(false)}
          >
            <X />
          </Button>
        </SheetHeader>
        <div className="flex-1 space-y-4 overflow-auto mb-4 px-6">
          {isWishlistEmpty ? (
            <div className="text-center py-8">
              <div className="flex justify-center mb-4">
                <Heart className="h-16 w-16 text-muted-foreground/50" />
              </div>
              <h3 className="font-medium text-lg mb-2">
                Your wishlist is empty
              </h3>
              <p className="text-muted-foreground mb-4 text-wrap">
                Add items to your wishlist to save them for later
              </p>
              <Button onClick={() => setOpen(false)} asChild>
                <Link href="/products">Browse Products</Link>
              </Button>
            </div>
          ) : (
            wishlistProducts.map((product) => {
              const discountPrice =
                product.price -
                (product.price * product.discountInPercent) / 100;

              return (
                <div
                  key={product.id}
                  className="flex gap-3 p-3 border rounded-lg"
                >
                  <div className="relative size-16 rounded overflow-hidden flex-shrink-0">
                    <Image
                      src={product.imageUrl}
                      alt={product.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between">
                      <Link
                        href={`/products/${product.id}`}
                        className="font-medium hover:text-primary line-clamp-1"
                        onClick={() => setOpen(false)}
                      >
                        {product.name}
                      </Link>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-destructive h-7 px-2 -mt-1 -mr-1"
                        onClick={() => removeFromWishlist(product.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {product.category}{" "}
                      {product.class ? `(${product.class})` : ""}
                    </div>

                    {/* Stock status indicators */}
                    {product.isOutOfStock && (
                      <div className="text-sm text-red-600 font-medium mt-1">
                        Out of Stock
                      </div>
                    )}
                    {product.isLowStock && !product.isOutOfStock && (
                      <div className="text-sm text-orange-600 mt-1">
                        Low stock: {product.stock} left
                      </div>
                    )}

                    <div className="flex items-center justify-between mt-2">
                      <div className="font-medium">
                        {formatCurrency(discountPrice)}
                        {product.discountInPercent > 0 && (
                          <span className="text-xs line-through ml-2 text-muted-foreground">
                            {formatCurrency(product.price)}
                          </span>
                        )}
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        className={`h-8 px-3 ${
                          product.isOutOfStock
                            ? "text-muted-foreground cursor-not-allowed"
                            : "text-primary hover:bg-primary/5"
                        }`}
                        disabled={product.isOutOfStock}
                        onClick={() => {
                          if (!product.isOutOfStock) {
                            addToCart(product.id);
                          }
                        }}
                      >
                        <ShoppingCart className="h-4 w-4 mr-2" />
                        {product.isOutOfStock ? "Out of Stock" : "Add to Cart"}
                      </Button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
        {!isWishlistEmpty && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearWishlist}
            className="text-destructive bg-destructive/20 hover:text-destructive hover:bg-destructive/10 p-2 m-2"
          >
            <Trash2 className="size-4 lr-2" /> Clear All
          </Button>
        )}
      </SheetContent>
    </Sheet>
  );
};

export default Wishlist;
