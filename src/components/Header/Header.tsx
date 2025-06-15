"use client";
import Image from "next/image";
import NavBar from "./NavBar";
import Link from "next/link";
import SearchBar from "./SearchBar";
import { Search, Menu, User, LogOut, ChevronDown } from "lucide-react";
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
import { useState, useRef, useEffect } from "react";
import { useSession, signOut } from "next-auth/react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Separator } from "../ui/separator";

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const { data: session, status } = useSession();
  const userMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        userMenuRef.current &&
        !userMenuRef.current.contains(event.target as Node)
      ) {
        setUserMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const UserAuthenticated = () => (
    <div className="relative" ref={userMenuRef}>
      <Button
        variant="ghost"
        size="sm"
        className="flex items-center space-x-2 py-6 rounded-3xl"
        onClick={() => setUserMenuOpen(!userMenuOpen)}
      >
        {
          <Avatar className="size-6">
            <AvatarImage src={session?.user?.image as string} />
            <AvatarFallback>
              {session?.user?.name?.charAt(0) || <User className="size-4" />}
            </AvatarFallback>
          </Avatar>
        }

        <ChevronDown className="h-3 w-3" />
      </Button>
      {userMenuOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-background border border-border shadow-lg z-50 pt-1 overflow-hidden rounded-md">
          <span className="px-4 text-nowrap text-sm">
            {session?.user?.name}
          </span>
          <Separator />
          <Link
            href="/profile"
            className="block px-4 py-2 text-sm text-foreground hover:bg-accent hover:text-accent-foreground transition-colors"
            onClick={() => setUserMenuOpen(false)}
          >
            Profile
          </Link>
          <Button
            variant="ghost"
            className="flex w-full px-4 py-2 text-sm text-red-600 hover:bg-red-200 dark:hover:bg-red-950 transition-colors justify-start items-center rounded-none"
            onClick={() => {
              setUserMenuOpen(false);
              signOut();
            }}
          >
            <LogOut className="h-4 w-4 mr-2" />
            Sign Out
          </Button>
        </div>
      )}
    </div>
  );

  const UserNotAuthenticated = () => (
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
  );

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
          {status === "loading" ? (
            <div className="flex items-center space-x-2">
              <div className="w-16 h-8 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
              <div className="w-16 h-8 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
            </div>
          ) : session ? (
            <UserAuthenticated />
          ) : (
            <UserNotAuthenticated />
          )}
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
                {status === "loading" ? (
                  <div className="flex flex-col space-y-2 pt-4 border-t border-border">
                    <div className="w-full h-8 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                    <div className="w-full h-8 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                  </div>
                ) : session ? (
                  <div className="flex flex-col space-y-2 pt-4 border-t border-border">
                    <div className="flex items-center space-x-2 px-3 py-2 font-medium text-sm">
                      <Avatar className="size-6">
                        <AvatarImage src={session.user?.image as string} />
                        <AvatarFallback>
                          {session.user?.name?.charAt(0) || (
                            <User className="size-4" />
                          )}
                        </AvatarFallback>
                      </Avatar>
                      <span>{session.user?.name || "User"}</span>
                    </div>

                    <Link
                      href="/profile"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <Button
                        variant="ghost"
                        className="w-full h-10 justify-start text-base"
                      >
                        Profile
                      </Button>
                    </Link>
                    <Button
                      variant="ghost"
                      className="text-base w-full h-10 justify-start text-red-600 bg-red-200"
                      onClick={() => {
                        setMobileMenuOpen(false);
                        signOut();
                      }}
                    >
                      <LogOut className="h-4 w-4 mr-2" />
                      Sign Out
                    </Button>
                  </div>
                ) : (
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
                )}
                <Separator className="my-4" />
                <ThemeChanger variant="text" />
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
