"use client";
import Link from "next/link";
import { Button } from "../ui/button";
import { usePathname } from "next/navigation";

const navItems = [
  { name: "Home", path: "/" },
  { name: "Products", path: "/products" },
  { name: "About", path: "/about" },
  { name: "Contact", path: "/contact" },
];

interface NavBarProps {
  mobile?: boolean;
  onItemClick?: () => void;
}

const NavBar = ({ mobile = false, onItemClick }: NavBarProps) => {
  const pathname = usePathname();
  if (mobile) {
    return (
      <nav className="flex flex-col space-y-2">
        <Link
          href="/"
          onClick={onItemClick}
          className="block px-3 py-2 text-base font-medium text-foreground hover:text-primary hover:bg-accent rounded-md transition-colors"
        >
          Home
        </Link>
        {navItems.map((item) => (
          <Link
            key={item.name}
            href={item.path}
            onClick={onItemClick}
            className="block px-3 py-2 text-base font-medium text-foreground hover:text-primary hover:bg-accent rounded-md transition-colors"
          >
            {item.name}
          </Link>
        ))}
      </nav>
    );
  }

  return (
    <nav className="flex space-x-2 ml-5 justify-center items-center">
      {navItems.map((item) => (
        <Button
          className={`${
            item.path === pathname
              ? "bg-primary text-background"
              : "text-primary"
          } w-20 border-2 border-primary/70 hover:border-accent-foreground`}
          key={item.name}
          variant="ghost"
        >
          <Link href={item.path}>{item.name}</Link>
        </Button>
      ))}
    </nav>
  );
};

export default NavBar;
