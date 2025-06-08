"use client";

import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

export default function ActiveFilters() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const selectedCategory = searchParams.get("category");
  const selectedClass = searchParams.get("class");
  const selectedSort = searchParams.get("sort");

  const removeFilter = (key: string) => {
    const params = new URLSearchParams(searchParams);
    params.delete(key);
    router.push(`${pathname}?${params.toString()}`);
  };

  const hasActiveFilters = selectedCategory || selectedClass || selectedSort;

  const getSortLabel = (sort: string) => {
    switch (sort) {
      case "name-asc":
        return "Name A-Z";
      case "name-desc":
        return "Name Z-A";
      case "price-asc":
        return "Price: Low to High";
      case "price-desc":
        return "Price: High to Low";
      case "rating-desc":
        return "Highest Rated";
      default:
        return sort;
    }
  };

  return (
    <div className="flex flex-col gap-2 mb-4 p-3 bg-muted/50 rounded-lg items-start">
      <span className="text-sm font-medium text-muted-foreground">
        Active filters:
      </span>
      {!hasActiveFilters && (
        <p className="text-sm text-muted-foreground">No active filters</p>
      )}
      <div>
        {selectedCategory && (
          <Button
            variant="secondary"
            size="sm"
            onClick={() => removeFilter("category")}
            className="h-7 px-2 text-xs gap-1"
          >
            Category: {selectedCategory}
            <X className="h-3 w-3" />
          </Button>
        )}
        {selectedClass && (
          <Button
            variant="secondary"
            size="sm"
            onClick={() => removeFilter("class")}
            className="h-7 px-2 text-xs gap-1"
          >
            Class: {selectedClass}
            <X className="h-3 w-3" />
          </Button>
        )}
        {selectedSort && selectedSort !== "name-asc" && (
          <Button
            variant="secondary"
            size="sm"
            onClick={() => removeFilter("sort")}
            className="h-7 px-2 text-xs gap-1"
          >
            Sort: {getSortLabel(selectedSort)}
            <X className="h-3 w-3" />
          </Button>
        )}
      </div>
    </div>
  );
}
