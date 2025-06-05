import Link from "next/link";
import { Button } from "../ui/button";

const navItems = [
  { name: "Products", path: "/products" },
  { name: "About", path: "/about" },
  { name: "Reviews", path: "/reviews" },
  { name: "Contact", path: "/contact" },
];

const NavBar = () => {
  return (
    <nav className="flex space-x-2">
      {navItems.map((item) => (
        <Button key={item.name} variant="link">
          <Link href={item.path}>{item.name}</Link>
        </Button>
      ))}
    </nav>
  );
};

export default NavBar;
