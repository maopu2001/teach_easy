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
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "../ui/sheet";
import { useState } from "react";

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 flex items-center px-4 h-16 md:h-24 backdrop-blur-sm bg-linear-to-b from-70% from-background to-background-0 z-40">
      {/* Logo */}
      <Link href="/" className="flex items-center">
        <Image
          src="/logo.png"
          alt="Teach Easy"
          height={32}
          width={64}
          className="md:h-10 md:w-20"
        />
      </Link>

      {/* Desktop Navigation */}
      <div className="hidden md:block ml-8">
        <NavBar />
      </div>

      {/* Desktop Actions */}
      <div className="hidden md:flex items-center ml-auto space-x-4">
        <SearchBar trigger={searchTrigger} />
        <ThemeChanger />
        <Wishlist />
        <Cart />
      </div>

      {/* Mobile Actions */}
      <div className="flex md:hidden items-center ml-auto space-x-2">
        <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="sm" className="p-2">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-64">
            <SheetHeader>
              <SheetTitle>Menu</SheetTitle>
            </SheetHeader>
            <div className="mt-6 pl-5 space-y-4">
              <NavBar mobile onItemClick={() => setMobileMenuOpen(false)} />
              <ThemeChanger variant="text" />
            </div>
          </SheetContent>
        </Sheet>
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
