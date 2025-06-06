import Image from "next/image";
import NavBar from "./NavBar";
import Link from "next/link";
import SearchBar from "./SearchBar";
import { Search } from "lucide-react";
import ThemeChanger from "./ThemeChanger";
import Cart from "../Cart";
import Wishlist from "../Wishlist";

const Header = () => {
  return (
    <header className="sticky top-0 flex items-center px-4 h-24 backdrop-blur-sm bg-linear-to-b from-70% from-background to-background-0 z-40">
      <Link href="/" className="flex items-center">
        <Image src="/logo.png" alt="Teach Easy" height={40} width={80} />
      </Link>
      <NavBar />
      <div className="flex items-center ml-auto space-x-4">
        <SearchBar trigger={searchTrigger} />
        <ThemeChanger />
        <Wishlist />
        <Cart />
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
