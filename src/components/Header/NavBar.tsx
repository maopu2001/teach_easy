import Link from "next/link";
import { Button } from "../ui/button";

const navItems = [
  { name: "Products", path: "/products" },
  { name: "About", path: "/about" },
  { name: "Reviews", path: "/reviews" },
  { name: "Contact", path: "/contact" },
];

interface NavBarProps {
  mobile?: boolean;
  onItemClick?: () => void;
}

const NavBar = ({ mobile = false, onItemClick }: NavBarProps) => {
  if (mobile) {
    return (
      <nav className="flex flex-col space-y-2">
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
