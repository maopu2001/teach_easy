"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Filter } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import ProductFilter from "./ProductFilter";
import ActiveFilters from "./ActiveFilters";
import { useSearchParams } from "next/navigation";

interface MobileFilterProps {
  categories: string[];
  classes: string[];
}

export default function MobileFilter({
  categories,
  classes,
}: MobileFilterProps) {
  const [open, setOpen] = useState(false);
  const searchParams = useSearchParams();

  // Check if there are active filters
  const selectedCategory = searchParams.get("category");
  const selectedClass = searchParams.get("class");
  const selectedSort = searchParams.get("sort");
  const searchQuery = searchParams.get("search");

  const hasActiveFilters =
    selectedCategory || selectedClass || selectedSort || searchQuery;
  const activeFilterCount = [
    selectedCategory,
    selectedClass,
    selectedSort,
    searchQuery,
  ].filter(Boolean).length;

  return (
    <div className="lg:hidden mb-4 space-y-2">
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button variant="outline" size="sm" className="gap-2">
            <Filter className="h-4 w-4" />
            Filters
            {hasActiveFilters && (
              <span className="ml-1 px-1.5 py-0.5 text-xs bg-primary text-primary-foreground rounded-full">
                {activeFilterCount}
              </span>
            )}
          </Button>
        </SheetTrigger>
        <SheetContent
          side="left"
          className="w-72 sm:w-80 max-w-[75vw] p-0 bg-background"
        >
          <SheetHeader className="border-b p-4">
            <SheetTitle>Filter Products</SheetTitle>
          </SheetHeader>
          <div className="flex-1 overflow-y-auto p-4">
            <ProductFilter categories={categories} classes={classes} />
          </div>
        </SheetContent>
      </Sheet>

      {/* Show active filters below the button on mobile */}
      {hasActiveFilters && (
        <div className="lg:hidden">
          <ActiveFilters />
        </div>
      )}
    </div>
  );
}
