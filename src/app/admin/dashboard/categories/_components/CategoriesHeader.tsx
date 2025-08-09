"use client";

import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Link from "next/link";

export default function CategoriesHeader() {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Categories</h1>
        <p className="text-muted-foreground">
          Manage your product categories here.
        </p>
      </div>
      <Link href="/admin/dashboard/categories/new">
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Add Category
        </Button>
      </Link>
    </div>
  );
}
