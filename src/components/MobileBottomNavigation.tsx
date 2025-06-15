"use client";
import Link from "next/link";
import {
  Home,
  Search,
  Heart,
  ShoppingCart,
  ShoppingBag,
  User,
} from "lucide-react";
import { Button } from "./ui/button";
import { useCart } from "@/store/cartStore";
import { useWishlist } from "@/store/wishlistStore";
import SearchBar from "./Header/SearchBar";
import Cart from "./Cart";
import Wishlist from "./Wishlist";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { useSession } from "next-auth/react";

const MobileBottomNavigation = () => {
  const { data: session } = useSession();
  const { cart } = useCart();
  const { items } = useWishlist();
  const pathname = usePathname();

  const cartItemCount = cart.length;
  const wishlistItemCount = items.length;

  const isActive = (path: string) => {
    if (path === "/") {
      return pathname === "/";
    }
    return pathname.startsWith(path);
  };

  const mobileSearchTrigger = (
    <Button
      variant="ghost"
      size="sm"
      className="p-2 size-14 flex flex-col items-center justify-center gap-1 text-muted-foreground hover:text-primary"
    >
      <Search className="h-5 w-5" />
      <span className="text-xs">Search</span>
    </Button>
  );

  return (
    <>
      {/* Mobile Bottom Navigation - Only visible on mobile */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-sm border-t border-border">
        <div className="flex items-center justify-around px-2 py-2">
          {/* Home */}
          <Link
            href="/"
            className={cn(
              "flex flex-col items-center gap-1 p-2 rounded-lg transition-colors",
              isActive("/")
                ? "text-primary bg-primary/10"
                : "text-muted-foreground hover:text-primary hover:bg-accent"
            )}
          >
            <Home className="h-5 w-5" />
            <span className="text-xs">Home</span>
          </Link>

          <Link
            href="/products"
            className={cn(
              "p-2 size-14 flex flex-col items-center justify-center gap-1 rounded-lg transition-colors",
              isActive("/products")
                ? "text-primary bg-primary/10"
                : "text-muted-foreground hover:text-primary hover:bg-accent"
            )}
          >
            <ShoppingBag className="h-5 w-5" />
            <span className="text-xs">Products</span>
          </Link>

          <SearchBar trigger={mobileSearchTrigger} />

          <div className="relative">
            <Cart
              trigger={
                <Button
                  variant="ghost"
                  size="sm"
                  className="p-2 size-14 flex flex-col items-center justify-center gap-1 text-muted-foreground hover:text-primary relative"
                >
                  <ShoppingCart className="h-5 w-5" />
                  <span className="text-xs">Cart</span>
                  {cartItemCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs rounded-full h-5 w-5 flex items-center justify-center min-w-[1.25rem]">
                      {cartItemCount > 99 ? "99+" : cartItemCount}
                    </span>
                  )}
                </Button>
              }
            />
          </div>

          {!!session ? (
            <div className="relative">
              <Link href="/profile">
                <Button
                  variant="ghost"
                  size="sm"
                  className="p-2 size-14 flex flex-col items-center justify-center gap-1 text-muted-foreground hover:text-primary relative"
                >
                  <User className="h-5 w-5" />
                  <span className="text-xs">Profile</span>
                </Button>
              </Link>
            </div>
          ) : (
            <div className="relative">
              <Wishlist
                trigger={
                  <Button
                    variant="ghost"
                    size="sm"
                    className="p-2 size-14 flex flex-col items-center justify-center gap-1 text-muted-foreground hover:text-primary relative"
                  >
                    <Heart className="h-5 w-5" />
                    <span className="text-xs">Wishlist</span>
                    {wishlistItemCount > 0 && (
                      <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs rounded-full h-5 w-5 flex items-center justify-center min-w-[1.25rem]">
                        {wishlistItemCount > 99 ? "99+" : wishlistItemCount}
                      </span>
                    )}
                  </Button>
                }
              />
            </div>
          )}
        </div>
      </nav>

      <div className="md:hidden h-16" />
    </>
  );
};

export default MobileBottomNavigation;
