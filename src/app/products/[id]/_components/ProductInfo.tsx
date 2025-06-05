import RatingBar from "@/components/RatingBar";
import { formatCurrency } from "@/lib/formatter";
import { Product } from "./ProductClientWrapper";

interface ProductInfoProps {
  product: Product;
  keyFeatures: string[];
}

export default function ProductInfo({
  product,
  keyFeatures,
}: ProductInfoProps) {
  const discountPrice =
    product.price - (product.price * product.discountInPercent) / 100;
  const saved = product.price - discountPrice;

  return (
    <>
      <div className="flex items-center gap-2 mb-2 text-yellow-500">
        <RatingBar rating={product.rating} noOfRating={product.noOfRating} />
      </div>
      <h1 className="text-3xl font-bold mb-2 leading-tight">{product.name}</h1>
      <div className="text-muted-foreground mb-2">
        {product.category} • {product.class}
      </div>
      <div className="flex items-center gap-3 mb-4">
        <span className="text-2xl font-bold text-foreground">
          {formatCurrency(discountPrice)}
        </span>
        {product.discountInPercent > 0 && (
          <>
            <span className="line-through text-muted-foreground">
              {formatCurrency(product.price)}
            </span>
            <span className="bg-red-100 text-red-500 text-xs font-semibold px-2 py-1 rounded">
              Save {formatCurrency(saved)}
            </span>
          </>
        )}
      </div>
      <p className="mb-4 text-muted-foreground">{product.description}</p>
      <div className="mb-4">
        <span className="font-semibold">Key Features:</span>
        <ul className="list-none mt-2 space-y-1">
          {keyFeatures.map((feature) => (
            <li
              key={feature}
              className="flex items-center gap-2 text-green-600"
            >
              <span className="text-lg">✓</span> <span>{feature}</span>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}
