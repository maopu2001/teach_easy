import Image from "next/image";
import { Card, CardContent, CardFooter, CardHeader } from "./ui/card";
import { AddToCartButton, AddToWishlistButton } from "./CustomButtons";
import RatingBar from "./RatingBar";
import { formatCurrency } from "@/lib/formatter";
import Link from "next/link";

type ProductCardProps = {
  product: {
    id: string;
    name: string;
    price: number;
    discountInPercent: number;
    category: string;
    class?: string;
    tag?: string;
    rating: number;
    noOfRating: number;
    imageUrl: string;
  };
};

const ProductCard = ({ product }: ProductCardProps) => {
  const discountPrice =
    product.price - (product.price * product.discountInPercent) / 100;

  return (
    <Card className="w-80 p-2 relative overflow-hidden shrink-0">
      <CardHeader className="w-full aspect-square relative mx-auto rounded-md overflow-hidden">
        {product.tag && (
          <span className="absolute z-10 flex justify-center items-center font-semibold border border-accent-foreground top-2 left-2 text-accent-foreground text-sm px-4 py-1 rounded-sm">
            {product.tag}
          </span>
        )}
        {product.discountInPercent > 0 && (
          <span className="absolute z-10 flex justify-center items-center font-semibold top-2 right-2 border border-primary text-primary text-sm bg-white px-4 py-1 rounded-sm">
            {product.discountInPercent}% OFF
          </span>
        )}
        <Link className="mb-26" href={`/products/${product.id}`}>
          <Image
            src={product.imageUrl}
            alt={product.name}
            className="object-contain"
            fill
          />
        </Link>
      </CardHeader>
      <CardContent className="mb-26 ">
        <RatingBar rating={product.rating} noOfRating={product.noOfRating} />
        <Link className="mb-26" href={`/products/${product.id}`}>
          <h1 className="space-y-2 font-semibold hover:text-primary line-clamp-2 text-lg/tight mt-3 cursor-pointer">
            {product.name}
          </h1>
        </Link>
      </CardContent>
      <CardFooter className="absolute bottom-4 right-2 left-2">
        <p>
          {product.category} {product.class && ` • ${product.class}`}
        </p>
        <p className="inline-flex items-center gap-2">
          <span className="text-lg font-semibold">
            {formatCurrency(discountPrice)}{" "}
          </span>
          {product.discountInPercent > 0 && (
            <>
              <span className="line-through text-muted-foreground">
                {formatCurrency(product.price)}
              </span>
              <span className="text-sm bg-primary/10 text-primary/60 px-2 rounded">
                Saved {formatCurrency(product.price - discountPrice)}
              </span>
            </>
          )}
        </p>
        <div className="grid grid-cols-2 gap-2 mt-2 text-primary text-base">
          <AddToWishlistButton id={product.id} />
          <AddToCartButton id={product.id} />
        </div>
      </CardFooter>
    </Card>
  );
};

export default ProductCard;
