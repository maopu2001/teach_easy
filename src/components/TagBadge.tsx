import { cn } from "@/lib/utils";

interface TagBadgeProps {
  tag: string;
  className?: string;
}

const getTagStyle = (tag: string): string => {
  const tagType = inferTagType(tag.toLowerCase());

  const baseStyles =
    "absolute top-4 left-4 text-xs font-semibold px-3 py-1 rounded-md shadow-sm z-10";

  switch (tagType) {
    case "bestseller":
      return cn(
        baseStyles,
        "bg-yellow-100 text-yellow-700 border border-yellow-200"
      );
    case "popular":
      return cn(
        baseStyles,
        "bg-orange-100 text-orange-700 border border-orange-200"
      );
    case "new":
      return cn(baseStyles, "bg-blue-100 text-blue-700 border border-blue-200");
    case "featured":
      return cn(
        baseStyles,
        "bg-purple-100 text-purple-700 border border-purple-200"
      );
    case "sale":
      return cn(baseStyles, "bg-red-100 text-red-700 border border-red-200");
    case "limited":
      return cn(baseStyles, "bg-pink-100 text-pink-700 border border-pink-200");
    case "exclusive":
      return cn(
        baseStyles,
        "bg-indigo-100 text-indigo-700 border border-indigo-200"
      );
    default:
      return cn(baseStyles, "bg-red-100 text-red-600 border border-red-200");
  }
};

const inferTagType = (tag: string): string => {
  if (tag.includes("bestseller") || tag.includes("best seller"))
    return "bestseller";
  if (tag.includes("popular") || tag.includes("trending")) return "popular";
  if (tag.includes("new") || tag.includes("latest")) return "new";
  if (tag.includes("featured") || tag.includes("highlight")) return "featured";
  if (tag.includes("sale") || tag.includes("discount")) return "sale";
  if (tag.includes("limited") || tag.includes("limited time")) return "limited";
  if (tag.includes("exclusive") || tag.includes("premium")) return "exclusive";

  return "sale"; // Default fallback
};

const TagBadge = ({ tag, className }: TagBadgeProps) => {
  const tagStyle = getTagStyle(tag);

  return <span className={cn(tagStyle, className)}>{tag}</span>;
};

export default TagBadge;
