"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel";
import TagBadge from "@/components/TagBadge";
import DiscountBadge from "@/components/DiscountBadge";

interface ProductImageGalleryProps {
  product: {
    imageUrl: string;
    name: string;
    tag?: string;
    discountInPercent?: number;
    stock: number;
    isAvailable: boolean;
    isOutOfStock: boolean;
    isLowStock: boolean;
  };
}

export default function ProductImageGallery({
  product,
}: ProductImageGalleryProps) {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);

  // For demo purposes, we'll use the same image twice
  const images = [product.imageUrl, product.imageUrl];

  const handleThumbnailClick = (index: number) => {
    api?.scrollTo(index);
  };

  useEffect(() => {
    if (!api) return;

    const onSelect = () => {
      setCurrent(api.selectedScrollSnap());
    };

    api.on("select", onSelect);
    onSelect();

    return () => {
      api.off("select", onSelect);
    };
  }, [api]);

  return (
    <div className="flex-1 flex flex-col gap-4 min-w-[320px] max-w-[480px]">
      <Carousel setApi={setApi} className="w-full">
        <CarouselContent>
          {images.map((image, index) => (
            <CarouselItem key={index}>
              <div className="relative aspect-square bg-muted rounded-xl flex items-center justify-center overflow-hidden">
                {product.tag && <TagBadge tag={product.tag} />}
                {product.discountInPercent && (
                  <DiscountBadge discount={product.discountInPercent} />
                )}
                <Image
                  src={image}
                  alt={`${product.name} view ${index + 1}`}
                  fill
                  className="object-contain transition-opacity duration-300"
                />
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>

        {/* Navigation buttons - only show if there are multiple images */}
        {images.length > 1 && (
          <>
            <CarouselPrevious className="left-2 bg-background/80 backdrop-blur-sm border border-border hover:bg-background hover:scale-110 transition-all duration-200" />
            <CarouselNext className="right-2 bg-background/80 backdrop-blur-sm border border-border hover:bg-background hover:scale-110 transition-all duration-200" />
          </>
        )}

        {/* Image indicators */}
        {images.length > 1 && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
            {images.map((_, index) => (
              <button
                key={index}
                className={`w-2 h-2 rounded-full transition-all duration-200 ${
                  index === current
                    ? "bg-primary scale-125"
                    : "bg-background/60 hover:bg-background/80"
                }`}
                onClick={() => handleThumbnailClick(index)}
                aria-label={`View image ${index + 1}`}
              />
            ))}
          </div>
        )}
      </Carousel>

      {images.length > 1 && (
        <div className="flex gap-2 mt-2">
          {images.map((image, index) => (
            <button
              key={index}
              className={`w-16 h-16 rounded-lg border-2 bg-muted flex items-center justify-center transition-all duration-200 hover:scale-105 ${
                index === current
                  ? "border-primary ring-2 ring-primary/20"
                  : "border-border hover:border-primary/50"
              }`}
              onClick={() => handleThumbnailClick(index)}
            >
              <Image
                src={image}
                alt={`${product.name} view ${index + 1}`}
                width={56}
                height={56}
                className="object-contain rounded-md"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
