import { Star } from "lucide-react";

const RatingBar = ({
  rating,
  noOfRating,
}: {
  rating: number;
  noOfRating: number;
}) => {
  return (
    <div className="flex items-center">
      {Array.from({ length: 5 }, (_, index) => (
        <Star
          className="size-4"
          key={index}
          fill={index < Math.round(rating) ? "gold" : "none"}
          color={index < Math.round(rating) ? "gold" : "currentColor"}
        />
      ))}
      <span className="mx-2 font-semibold">{rating}</span>({noOfRating}{" "}
      {noOfRating < 2 ? "review" : "reviews"})
    </div>
  );
};
export default RatingBar;
