import Image from "next/image";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t bg-muted/30 px-4 py-4">
      <div className="container flex flex-col lg:flex-row justify-between items-center mx-auto gap-2">
        <Image
          src="/logo.png"
          alt="Teach Easy"
          width={150}
          height={48}
          className="h-9 w-auto mx-auto sm:mx-0"
        />
        <div className="flex flex-col items-center lg:items-end justify-center gap-1">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 text-xs text-muted-foreground text-center">
            © {new Date().getFullYear()} Teach Easy. All rights reserved.
          </div>
          <nav className="flex flex-wrap justify-center sm:justify-end gap-4">
            <Link
              href="/terms"
              className="text-xs hover:underline text-muted-foreground hover:text-primary dark:hover:text-red-400"
            >
              Terms of Service
            </Link>
            <Link
              href="/privacy"
              className="text-xs hover:underline text-muted-foreground hover:text-primary dark:hover:text-red-400"
            >
              Privacy Policy
            </Link>
            <Link
              href="/shipping"
              className="text-xs hover:underline text-muted-foreground hover:text-primary dark:hover:text-red-400"
            >
              Shipping Info
            </Link>
            <Link
              href="/returns"
              className="text-xs hover:underline text-muted-foreground hover:text-primary dark:hover:text-red-400"
            >
              Returns
            </Link>
          </nav>
        </div>
      </div>
    </footer>
  );
}
