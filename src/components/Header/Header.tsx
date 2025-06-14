"use client";
import Image from "next/image";
import NavBar from "./NavBar";
import Link from "next/link";
import SearchBar from "./SearchBar";
import { Search, Menu } from "lucide-react";
import ThemeChanger from "./ThemeChanger";
import Cart from "../Cart";
import Wishlist from "../Wishlist";
import { Button } from "../ui/button";
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "../ui/sheet";
import { useState } from "react";

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 flex items-center justify-between px-4 h-16 md:h-20 backdrop-blur-sm bg-background/90 z-40">
      {/* Left */}
      <div className="flex items-center">
        {/* Logo  */}
        <Link
          href="/"
          className="flex items-center absolute lg:static lg:translate-x-0 left-1/2 transform -translate-x-1/2 "
        >
          <Image src="/logo.png" alt="Teach Easy" height={40} width={80} />
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:block">
          <NavBar />
        </div>
      </div>
      {/* Right */}
      <div className="flex items-center">
        {/* Desktop Actions */}
        <div className="hidden md:flex items-center space-x-4">
          <SearchBar trigger={searchTrigger} />
          <ThemeChanger />
          <Wishlist />
          <Cart />
          <div className="flex items-center space-x-2">
            <Link href="/auth/login">
              <Button variant="ghost" size="sm">
                Login
              </Button>
            </Link>
            <Link href="/auth/register">
              <Button variant="default" size="sm">
                Sign Up
              </Button>
            </Link>
          </div>
        </div>

        {/* Mobile Actions */}
        <div className="flex md:hidden items-center space-x-2">
          <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="sm" className="p-2">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-64">
              <SheetHeader>
                <SheetTitle></SheetTitle>
              </SheetHeader>
              <div className="mt-6 px-5 space-y-4">
                <NavBar mobile onItemClick={() => setMobileMenuOpen(false)} />
                <ThemeChanger variant="text" />
                <div className="flex flex-col space-y-2 pt-4 border-t border-border">
                  <Link
                    href="/auth/login"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <Button
                      variant="ghost"
                      className="w-full h-10 justify-start bg-accent"
                    >
                      Login
                    </Button>
                  </Link>
                  <Link
                    href="/auth/register"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <Button
                      variant="default"
                      className="w-full h-10 justify-start"
                    >
                      Sign Up
                    </Button>
                  </Link>
                </div>
              </div>
              <SheetFooter className="text-center text-xs gap-0">
                &copy; {new Date().getFullYear()} Teach Easy <br />
                Designed and Developed by <br />
                <Link
                  className="text-accent-foreground"
                  href="https://maopu.com.bd"
                >
                  M. Aktaruzzaman Opu
                </Link>
              </SheetFooter>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
};

const searchTrigger = (
  <div className="relative md:min-w-[450px] flex items-center px-4 py-2 bg-slate-100 dark:bg-slate-800 rounded-lg cursor-pointer hover:scale-[1.02] active:scale-[0.98] transition-transform duration-200">
    <Search className="h-5 w-5 mr-2 text-muted-foreground" />
    <span className="text-muted-foreground">Search products...</span>
    <span className="ml-auto text-xs text-muted-foreground opacity-70">
      Ctrl+K
    </span>
  </div>
);

export default Header;
