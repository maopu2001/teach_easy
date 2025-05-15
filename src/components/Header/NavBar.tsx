"use client";
import Link from "next/link";
import { Button } from "../ui/button";
import { usePathname } from "next/navigation";
import ThemeChanger from "./ThemeChanger";

const navItems = [
  { name: "Home", path: "/" },
  { name: "About", path: "/about" },
  { name: "Services", path: "/services" },
  { name: "Products", path: "/products" },
  { name: "Blog", path: "/blog" },
  { name: "Contact", path: "/contact" },
];

const NavBar = () => {
  const pathname = usePathname();
  return (
    <nav className="flex space-x-4">
      {navItems.map((item) => (
        <Button
          key={item.name}
          variant={pathname === item.path ? "default" : "link"}
        >
          <Link href={item.path}>{item.name}</Link>
        </Button>
      ))}
      <div className="relative size-8 ml-4">
        <ThemeChanger />
      </div>
    </nav>
  );
};

export default NavBar;
