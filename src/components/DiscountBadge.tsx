import { cn } from "@/lib/utils";

interface DiscountBadgeProps {
  discount: number;
  className?: string;
}

const DiscountBadge = ({ discount, className }: DiscountBadgeProps) => {
  if (!discount || discount <= 0) return null;

  const baseStyles =
    "top-4 right-4 absolute bg-green-100 text-green-600 text-xs font-semibold px-3 py-1 rounded-md shadow-sm z-10 border border-green-200";

  return <span className={cn(baseStyles, className)}>{discount}% OFF</span>;
};

export default DiscountBadge;
