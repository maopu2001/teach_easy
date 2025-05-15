import Image from "next/image";
import NavBar from "./NavBar";
import Link from "next/link";

const Header = () => {
  return (
    <header className="sticky top-0 flex justify-between items-center px-4 h-24 backdrop-blur-sm bg-linear-to-b from-70% from-background to-background-0 z-10">
      <Link href="/" className="place-content-start flex items-center">
        <Image src="/logo.png" alt="Teach Easy" height={64} width={128} />
      </Link>
      <NavBar />
    </header>
  );
};

export default Header;
