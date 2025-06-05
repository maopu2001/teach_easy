"use client";
import { ShoppingCart, Trash2 } from "lucide-react";
import { Button } from "./ui/button";
import { useCart } from "@/store/cartStore";
import { useEffect, useState } from "react";
import { products } from "@/lib/testProducts";
import { formatCurrency } from "@/lib/formatter";
import Image from "next/image";
import Link from "next/link";
import { Drawer, DrawerContent, DrawerTitle, DrawerTrigger } from "./ui/drawer";
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
};

const Cart = () => {
  const { cart, clearCart } = useCart();
  const [cartProducts, setCartProducts] = useState<Product[]>([]);
  const [open, setOpen] = useState(false);

  const productQuantities = cart.reduce((acc: Record<string, number>, id) => {
    acc[id] = (acc[id] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  useEffect(() => {
    const tempProducts: Product[] = [];
    Object.keys(productQuantities).forEach((id) => {
      const product = products.find((p) => p.id === id);
      if (product) tempProducts.push(product);
    });
    setCartProducts(tempProducts);
  }, [cart.length, productQuantities]);

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
    console.log("Proceeding to checkout");
    setOpen(false);
  };

  const isCartEmpty = cart.length === 0;

  return (
    <Drawer open={open} onOpenChange={setOpen} direction="right">
      <DrawerTrigger asChild>
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
      </DrawerTrigger>
      <DrawerContent className="sm:max-w-md w-full max-w-[400px] ml-auto h-full flex flex-col">
        <DrawerTitle className="flex justify-between items-center px-6 pt-6 pb-2 border-b">
          <span className="text-lg font-semibold">Shopping Cart</span>
          {!isCartEmpty && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearCart}
              className="text-destructive hover:text-destructive hover:bg-destructive/10"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Clear All
            </Button>
          )}
        </DrawerTitle>
        <div className="flex-1 mt-4 space-y-4 max-h-[60vh] overflow-auto pr-1 px-6">
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
              return (
                <div
                  key={product.id}
                  className="flex gap-3 p-3 border rounded-lg"
                >
                  <div className="relative w-16 h-16 rounded overflow-hidden flex-shrink-0">
                    <Image
                      src={product.imageUrl}
                      alt={product.name}
                      fill
                      className="object-cover"
                    />
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
                    <div className="flex items-center justify-between mt-1">
                      <div className="font-medium">
                        {formatCurrency(discountPrice)}
                        {product.discountInPercent > 0 && (
                          <span className="text-xs line-through ml-2 text-muted-foreground">
                            {formatCurrency(product.price)}
                          </span>
                        )}
                      </div>
                      <ChangeItemQuantity id={product.id} quantity={qty} />
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
        {!isCartEmpty && (
          <div className="mt-6 space-y-4 px-6 pb-6">
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
        )}
      </DrawerContent>
    </Drawer>
  );
};

export default Cart;
