"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Filter } from "lucide-react";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import ProductFilter from "./ProductFilter";

interface MobileFilterProps {
  categories: string[];
  classes: string[];
}

export default function MobileFilter({
  categories,
  classes,
}: MobileFilterProps) {
  const [open, setOpen] = useState(false);

  return (
    <div className="lg:hidden mb-4">
      <Drawer open={open} onOpenChange={setOpen}>
        <DrawerTrigger asChild>
          <Button variant="outline" size="sm" className="gap-2">
            <Filter className="h-4 w-4" />
            Filters
          </Button>
        </DrawerTrigger>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>Filter Products</DrawerTitle>
          </DrawerHeader>
          <div className="px-4 pb-4">
            <ProductFilter categories={categories} classes={classes} />
          </div>
        </DrawerContent>
      </Drawer>
    </div>
  );
}
