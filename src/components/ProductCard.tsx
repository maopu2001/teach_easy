import Image from "next/image";
import { Card, CardContent, CardFooter, CardHeader } from "./ui/card";
import { AddToCartButton, BuyNowButton } from "./CustomButtons";

type ProductCardProps = {
  product: {
    id: number;
    name: string;
    price: number;
    description: string;
    imageUrl: string;
    category: string;
    stock: number;
    rating: {
      rate: number;
      count: number;
    };
  };
};

const ProductCard = ({ product }: ProductCardProps) => {
  return (
    <Card className="max-w-120 p-5">
      <div className="w-full aspect-square relative mx-auto rounded-md overflow-hidden">
        <Image
          src={product.imageUrl}
          alt={product.name}
          className="object-contain"
          fill
        />
      </div>
      <div>
        <CardHeader className="bg-gradient-to-b to-card to-50% relative -translate-y-20 -mb-20 z-10 text-lg font-semibold text-center">
          <div className="text-primary dark:text-background">
            {product.name}
          </div>
          <div className="h-0.5 bg-primary translate-y-6"></div>
          <div className="relative z-10 w-fit h-8 bg-foreground flex items-center justify-center text-background rounded-full px-4 mx-auto">
            {product.price} &#2547;
          </div>
        </CardHeader>
        <CardContent className="text-center text-muted-foreground py-2">
          {product.category}
        </CardContent>
        <CardFooter className="flex justify-center items-center gap-2 flex-wrap">
          <AddToCartButton id={product.id.toString()} />
          <BuyNowButton id={product.id.toString()} />
        </CardFooter>
      </div>
    </Card>
  );
};

export default ProductCard;
