"use client";
import { Search } from "lucide-react";
import { useState, useEffect } from "react";
import { Input } from "../ui/input";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { products } from "@/lib/testProducts";
import { formatCurrency } from "@/lib/formatter";
import { Product } from "@/app/products/[id]/_components/ProductClientWrapper";

const SearchBar = ({ trigger }: { trigger: React.ReactNode }) => {
  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);

  const filteredProducts = products.filter((product: Product) => {
    const search = searchTerm.toLowerCase();
    return (
      product.name.toLowerCase().includes(search) ||
      product.category.toLowerCase().includes(search) ||
      (product.class && product.class.toLowerCase().includes(search))
    );
  });

  const handleKeyPress = (e: KeyboardEvent) => {
    if ((e.ctrlKey || e.metaKey) && e.key === "k") {
      e.preventDefault();
      setOpen(true);
    }
  };

  useEffect(() => {
    window.addEventListener("keydown", handleKeyPress);
    return () => {
      window.removeEventListener("keydown", handleKeyPress);
    };
  }, []);

  const handleDialogChange = (open: boolean) => {
    setOpen(open);
    if (!open) {
      setSearchTerm("");
    }
    setActiveIndex(0);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Escape") setOpen(false);
    if (e.key === "Enter" && filteredProducts.length > 0) {
      const selectedProduct = filteredProducts[activeIndex];
      window.location.href = `/products/${selectedProduct.id}`;
      setOpen(false);
    }
    if (e.key === "ArrowDown" && filteredProducts.length > 0) {
      e.preventDefault();
      setActiveIndex((prevIndex) =>
        prevIndex < filteredProducts.length - 1 ? prevIndex + 1 : prevIndex
      );
    }
    if (e.key === "ArrowUp" && filteredProducts.length > 0) {
      e.preventDefault();
      setActiveIndex((prevIndex) => (prevIndex > 0 ? prevIndex - 1 : 0));
    }
  };

  useEffect(() => {
    setActiveIndex(0);
  }, [filteredProducts.length]);

  return (
    <Dialog open={open} onOpenChange={handleDialogChange}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="translate-y-0 top-10 p-4 fixed w-[95%] max-w-xl rounded-lg shadow-lg z-50">
        <DialogTitle>Search Products</DialogTitle>
        <div className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search by name, category, or class..."
              className="pl-10 pr-24"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              autoFocus
              onKeyDown={handleKeyDown}
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground hover:text-foreground p-1"
              >
                Clear
              </button>
            )}
          </div>
          <div className="max-h-96 overflow-y-auto animate-fadeIn">
            {filteredProducts.length === 0 ? (
              <p className="text-center text-muted-foreground py-4">
                No results found for &quot;{searchTerm}&quot;.
              </p>
            ) : (
              <div className="space-y-2">
                <p className="text-xs text-muted-foreground px-1">
                  Found {filteredProducts.length}{" "}
                  {filteredProducts.length === 1 ? "product" : "products"}
                </p>
                {filteredProducts.map((product: Product, index) => (
                  <div
                    key={product.id}
                    onClick={() => {
                      window.location.href = `/products/${product.id}`;
                      setOpen(false);
                    }}
                    onMouseEnter={() => setActiveIndex(index)}
                    className={`flex justify-between items-center p-3 ${
                      activeIndex === index
                        ? "bg-slate-100 dark:bg-slate-800"
                        : "hover:bg-gray-100 dark:hover:bg-gray-800"
                    } rounded-lg cursor-pointer transition-colors duration-200 animate-fadeIn`}
                    style={{
                      animationDelay: `${index * 50}ms`,
                    }}
                  >
                    <div className="flex flex-col">
                      <span className="font-medium">{product.name}</span>
                      <span className="text-sm text-muted-foreground">
                        {product.category}
                        {product.class ? ` (${product.class})` : ""}
                      </span>
                    </div>
                    <span className="text-sm text-right font-medium">
                      {product.discountInPercent > 0 ? (
                        <>
                          {formatCurrency(
                            product.price -
                              (product.price * product.discountInPercent) / 100
                          )}
                          <br />
                          <div className="ml-2 text-xs text-muted-foreground">
                            <span className="line-through">
                              {formatCurrency(product.price)}
                            </span>{" "}
                            <span className="text-green-600 dark:text-green-400">
                              -{product.discountInPercent}%
                            </span>
                          </div>
                        </>
                      ) : (
                        formatCurrency(product.price)
                      )}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SearchBar;
