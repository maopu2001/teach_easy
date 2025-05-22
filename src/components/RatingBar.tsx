import { Star } from "lucide-react";

const RatingBar = ({ rating }: { rating: number }) => {
  return (
    <div className="flex">
      {Array.from({ length: 5 }, (_, index) => (
        <Star
          className="size-4"
          key={index}
          fill={index < Math.round(rating) ? "gold" : "none"}
          color={index < Math.round(rating) ? "gold" : "currentColor"}
        />
      ))}
    </div>
  );
};
export default RatingBar;
