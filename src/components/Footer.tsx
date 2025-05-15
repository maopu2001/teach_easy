import Link from "next/link";

const Footer = () => {
  return (
    <footer className="fixed bg-background bottom-0 py-1 w-full text-sm">
      <div className="container mx-auto text-center">
        <p>
          &copy; {new Date().getFullYear()} Teach Easy. All rights reserved.
          {` `}
          <Link
            href="/privacy-policy"
            className="text-primary hover:text-primary/70"
          >
            Privacy Policy
          </Link>
          {` | `}
          <Link href="/terms" className="text-primary hover:text-primary/70">
            Terms of Service
          </Link>
        </p>
      </div>
    </footer>
  );
};
export default Footer;
