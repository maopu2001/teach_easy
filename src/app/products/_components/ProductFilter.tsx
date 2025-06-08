"use client";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import ActiveFilters from "./ActiveFilters";

interface ProductFilterProps {
  categories: string[];
  classes: string[];
}

export default function ProductFilter({
  categories,
  classes,
}: ProductFilterProps) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const selectedCategory = searchParams.get("category");
  const selectedClass = searchParams.get("class");
  const selectedSort = searchParams.get("sort") || "name-asc";

  const updateFilter = (key: string, value: string | null) => {
    const params = new URLSearchParams(searchParams);

    if (value && value !== "all") {
      params.set(key, value);
    } else {
      params.delete(key);
    }

    router.push(`${pathname}?${params.toString()}`);
  };

  const clearAllFilters = () => {
    router.push(pathname);
  };

  const hasActiveFilters =
    selectedCategory || selectedClass || searchParams.get("search");

  return (
    <div className="w-full lg:w-64 space-y-4 lg:sticky lg:top-24 p-4">
      <div>
        <h3 className="text-lg font-semibold mb-2">Category</h3>
        <Select
          value={selectedCategory || "all"}
          onValueChange={(value) => updateFilter("category", value)}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="All Categories" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {categories.map((category) => (
              <SelectItem key={category} value={category}>
                {category}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-2">Class</h3>
        <Select
          value={selectedClass || "all"}
          onValueChange={(value) => updateFilter("class", value)}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="All Classes" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Classes</SelectItem>
            {classes.map((classLevel) => (
              <SelectItem key={classLevel} value={classLevel}>
                {classLevel}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-2">Sort By</h3>
        <Select
          value={selectedSort}
          onValueChange={(value) => updateFilter("sort", value)}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Name A-Z" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="name-asc">Name A-Z</SelectItem>
            <SelectItem value="name-desc">Name Z-A</SelectItem>
            <SelectItem value="price-asc">Price: Low to High</SelectItem>
            <SelectItem value="price-desc">Price: High to Low</SelectItem>
            <SelectItem value="rating-desc">Highest Rated</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {hasActiveFilters && (
        <>
          <Button
            variant="outline"
            onClick={clearAllFilters}
            className="w-full"
          >
            Clear All Filters
          </Button>
          <ActiveFilters />
        </>
      )}
    </div>
  );
}
