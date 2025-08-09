import { Star } from "lucide-react";

const RatingBar = ({
  rating,
  noOfRating,
}: {
  rating: number;
  noOfRating: number;
}) => {
  // Ensure rating is a valid number
  const validRating = typeof rating === "number" && !isNaN(rating) ? rating : 0;
  const validNoOfRating =
    typeof noOfRating === "number" && !isNaN(noOfRating) ? noOfRating : 0;
  const renderStar = (index: number) => {
    const starValue = index + 1;

    if (validRating >= starValue) {
      return <Star className="size-4" key={index} fill="gold" color="gold" />;
    } else if (validRating > index) {
      const percentage = ((validRating - index) * 100).toFixed(0);
      return (
        <div key={index} className="relative size-4">
          <Star className="size-4 absolute" fill="none" color="gold" />
          <Star
            className="size-4 absolute"
            fill="gold"
            color="gold"
            style={{
              clipPath: `inset(0 ${100 - parseInt(percentage)}% 0 0)`,
            }}
          />
        </div>
      );
    } else {
      // Empty star
      return <Star className="size-4" key={index} fill="none" color="gold" />;
    }
  };

  return (
    <div className="flex items-center">
      {Array.from({ length: 5 }, (_, index) => renderStar(index))}
      <span className="mx-2 font-semibold">{validRating.toFixed(1)}</span>(
      {validNoOfRating} {validNoOfRating < 2 ? "review" : "reviews"})
    </div>
  );
};
export default RatingBar;
