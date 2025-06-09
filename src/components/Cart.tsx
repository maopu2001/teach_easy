"use client";
import { ShoppingCart, Trash2 } from "lucide-react";
import { Button } from "./ui/button";
import { useCart } from "@/store/cartStore";
import { useState, useMemo } from "react";
import { products } from "@/lib/testProducts";
import { formatCurrency } from "@/lib/formatter";
import Image from "next/image";
import Link from "next/link";
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "./ui/sheet";
import { ChangeItemQuantity } from "./CustomButtons";

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

interface CartProps {
  trigger?: React.ReactNode;
}

const Cart = ({ trigger }: CartProps = {}) => {
  const { cart, clearCart } = useCart();
  const [open, setOpen] = useState(false);

  const productQuantities = useMemo(() => {
    return cart.reduce((acc: Record<string, number>, id) => {
      acc[id] = (acc[id] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
  }, [cart]);

  const cartProducts = useMemo(() => {
    const tempProducts: Product[] = [];
    Object.keys(productQuantities).forEach((id) => {
      const product = products.find((p) => p.id === id);
      if (product) tempProducts.push(product);
    });
    return tempProducts;
  }, [productQuantities]);

  const calculateTotal = () => {
    return cartProducts.reduce((total, product) => {
      const discountPrice =
        product.price - (product.price * product.discountInPercent) / 100;
      const qty = productQuantities[product.id] || 1;
      return total + discountPrice * qty;
    }, 0);
  };

  const calculateTotalSaved = () => {
    return cartProducts.reduce((total, product) => {
      const qty = productQuantities[product.id] || 1;
      const saved =
        product.discountInPercent > 0
          ? ((product.price * product.discountInPercent) / 100) * qty
          : 0;
      return total + saved;
    }, 0);
  };

  const handleCheckout = () => {
    // Check if any cart items are out of stock or unavailable
    const outOfStockItems = cartProducts.filter(
      (product) => product.isOutOfStock
    );

    if (outOfStockItems.length > 0) {
      alert(
        `Cannot checkout: Some items are out of stock: ${outOfStockItems
          .map((p) => p.name)
          .join(", ")}`
      );
      return;
    }

    // Check if quantities exceed available stock
    const insufficientStockItems = cartProducts.filter((product) => {
      const qty = productQuantities[product.id] || 1;
      return qty > product.stock;
    });

    if (insufficientStockItems.length > 0) {
      alert(
        `Cannot checkout: Insufficient stock for: ${insufficientStockItems
          .map((p) => p.name)
          .join(", ")}`
      );
      return;
    }

    // Navigate to checkout page
    window.location.href = "/checkout";
    setOpen(false);
  };

  const isCartEmpty = cart.length === 0;

  const defaultTrigger = (
    <Button
      variant="ghost"
      size="icon"
      className="relative"
      aria-label="Open cart"
    >
      <ShoppingCart className="h-6 w-6" />
      {!isCartEmpty && (
        <span className="absolute -top-1 -right-1 flex items-center justify-center w-5 h-5 text-xs rounded-full bg-primary text-primary-foreground">
          {cart.length}
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
        <SheetHeader className="flex flex-row justify-between items-center px-6 pt-6 pb-2 border-b">
          <SheetTitle className="text-lg font-semibold">
            Shopping Cart
          </SheetTitle>
          {!isCartEmpty && (
            <Button
              size="sm"
              onClick={clearCart}
              className="text-destructive bg-destructive/20 hover:text-destructive hover:bg-destructive/10 p-2"
            >
              <Trash2 className="size-4 mr-2" />
              Clear All
            </Button>
          )}
        </SheetHeader>
        <div className="flex-1 space-y-4 overflow-auto px-6">
          {isCartEmpty ? (
            <div className="text-center py-8">
              <div className="flex justify-center mb-4">
                <ShoppingCart className="h-16 w-16 text-muted-foreground/50" />
              </div>
              <h3 className="font-medium text-lg mb-2">Your cart is empty</h3>
              <p className="text-muted-foreground mb-4">
                Add items to your cart to see them here
              </p>
              <Button onClick={() => setOpen(false)} asChild>
                <Link href="/products">Browse Products</Link>
              </Button>
            </div>
          ) : (
            cartProducts.map((product) => {
              const discountPrice =
                product.price -
                (product.price * product.discountInPercent) / 100;
              const qty = productQuantities[product.id] || 1;
              const isInsufficientStock = qty > product.stock;

              return (
                <div
                  key={product.id}
                  className={`flex gap-3 p-3 border rounded-lg ${
                    product.isOutOfStock
                      ? "opacity-60 bg-red-50 border-red-200"
                      : isInsufficientStock
                      ? "bg-orange-50 border-orange-200"
                      : ""
                  }`}
                >
                  <div className="relative w-16 h-16 rounded overflow-hidden flex-shrink-0">
                    <Image
                      src={product.imageUrl}
                      alt={product.name}
                      fill
                      className="object-cover"
                    />
                    {product.isOutOfStock && (
                      <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                        <span className="text-white text-xs font-bold bg-red-600 px-2 py-1 rounded">
                          Out of Stock
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <Link
                      href={`/products/${product.id}`}
                      className="font-medium hover:text-primary line-clamp-1"
                      onClick={() => setOpen(false)}
                    >
                      {product.name}
                    </Link>
                    <div className="text-sm text-muted-foreground">
                      {product.category}{" "}
                      {product.class ? `(${product.class})` : ""}
                    </div>

                    {/* Stock status indicators */}
                    {product.isOutOfStock && (
                      <div className="text-sm text-red-600 font-medium">
                        Out of Stock
                      </div>
                    )}
                    {isInsufficientStock && !product.isOutOfStock && (
                      <div className="text-sm text-orange-600 font-medium">
                        Only {product.stock} available
                      </div>
                    )}
                    {product.isLowStock &&
                      !product.isOutOfStock &&
                      !isInsufficientStock && (
                        <div className="text-sm text-orange-600">
                          Low stock: {product.stock} left
                        </div>
                      )}

                    <div className="flex items-center justify-between mt-1">
                      <div className="font-medium">
                        {formatCurrency(discountPrice)}
                        {product.discountInPercent > 0 && (
                          <span className="text-xs line-through ml-2 text-muted-foreground">
                            {formatCurrency(product.price)}
                          </span>
                        )}
                      </div>
                      <ChangeItemQuantity
                        id={product.id}
                        quantity={qty}
                        maxStock={product.stock}
                        disabled={product.isOutOfStock}
                      />
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {!isCartEmpty && (
          <SheetFooter>
            <div className="space-y-4 px-6 pb-6">
              <div className="flex justify-between items-center pt-4 border-t">
                <span className="font-medium">Total:</span>
                <span className="text-xl font-semibold">
                  {formatCurrency(calculateTotal())}
                </span>
              </div>
              {calculateTotalSaved() > 0 && (
                <div className="flex justify-between items-center text-green-600 text-sm">
                  <span className="font-medium">Total Saved:</span>
                  <span className="font-semibold">
                    {formatCurrency(calculateTotalSaved())}
                  </span>
                </div>
              )}

              <div className="flex gap-3">
                <Button
                  className="flex-1"
                  variant="outline"
                  onClick={() => setOpen(false)}
                >
                  Continue Shopping
                </Button>
                <Button className="flex-1" onClick={handleCheckout}>
                  Checkout
                </Button>
              </div>
            </div>
          </SheetFooter>
        )}
      </SheetContent>
    </Sheet>
  );
};

export default Cart;
