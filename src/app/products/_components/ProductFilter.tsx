"use client";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search } from "lucide-react";
import { useState } from "react";

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
  const [searchQuery, setSearchQuery] = useState("");

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

  const updateSearch = (query: string) => {
    const params = new URLSearchParams(searchParams);

    if (query.trim()) {
      params.set("search", query);
    } else {
      params.delete("search");
    }

    router.push(`${pathname}?${params.toString()}`);
  };

  const clearAllFilters = () => {
    setSearchQuery("");
    router.push(pathname);
  };

  const hasActiveFilters =
    selectedCategory || selectedClass || searchParams.get("search");

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateSearch(searchQuery);
  };

  return (
    <div className="w-full lg:w-64 space-y-6 lg:sticky lg:top-4">
      {/* Search Products */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Search Products</h3>
        <form onSubmit={handleSearchSubmit} className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            type="text"
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </form>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-4">Category</h3>
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
        <h3 className="text-lg font-semibold mb-4">Grade Level</h3>
        <Select
          value={selectedClass || "all"}
          onValueChange={(value) => updateFilter("class", value)}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="All Grades" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Grades</SelectItem>
            {classes.map((classLevel) => (
              <SelectItem key={classLevel} value={classLevel}>
                {classLevel}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-4">Sort By</h3>
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

      {/* Clear All Filters */}
      {hasActiveFilters && (
        <Button variant="outline" onClick={clearAllFilters} className="w-full">
          Clear All Filters
        </Button>
      )}
    </div>
  );
}
