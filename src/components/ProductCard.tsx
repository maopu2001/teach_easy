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
    rating: number;
    imageUrl: string;
    category: string;
  };
};

const ProductCard = ({ product }: ProductCardProps) => {
  const discountPrice =
    product.price - (product.price * product.discountInPercent) / 100;

  return (
    <Card className="max-w-100 p-2 relative overflow-hidden">
      <Link href={`/products/${product.id}`}>
        <CardHeader className="w-full aspect-square relative mx-auto rounded-md overflow-hidden">
          {product.discountInPercent > 0 && (
            <span className="absolute z-10 flex justify-center items-center font-semibold top-2 left-2 bg-primary text-white px-4 py-1 rounded-sm">
              {product.discountInPercent}% OFF
            </span>
          )}

          <Image
            src={product.imageUrl}
            alt={product.name}
            className="object-contain"
            fill
          />
        </CardHeader>
        <CardContent className="font-semibold">
          <p className="hover:text-primary line-clamp-2 text-lg/tight h-12 cursor-pointer">
            {product.name}
          </p>
        </CardContent>
      </Link>
      <CardFooter className="">
        <p className="inline-flex items-center gap-2 text-lg font-semibold">
          {formatCurrency(discountPrice)}{" "}
          {product.discountInPercent > 0 && (
            <span className="text-base line-through text-muted-foreground">
              {formatCurrency(product.price)}
            </span>
          )}
        </p>
        <div className="flex justify-between items-center">
          <RatingBar rating={product.rating} />
          <div className="flex gap-2 text-primary">
            <AddToWishlistButton id={product.id} />
            <AddToCartButton id={product.id} />
          </div>
        </div>
      </CardFooter>
    </Card>
  );
};

export default ProductCard;
