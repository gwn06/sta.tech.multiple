import { use } from "react";
import { formatDate } from "./food-grid-photos";
import FoodReviewOptions from "./food-review-options";
import { FoodReview } from "./food_review";
import Image from "next/image";

export default function FoodReviewCard({
  foodReviewPromise,
  currentUserId,
}: {
  foodReviewPromise: Promise<FoodReview>;
  currentUserId: string;
}) {
  const foodReview = use(foodReviewPromise);
  return (
    <div className="bg-white rounded-sm p-2 shadow-sm">
      <div className="flex flex-row">
        <Image
          className="rounded-md shadow-sm h-[200px] w-[200px] sm:h-[300px] sm:w-[300px] md:h-[400px] md:w-[400px] object-cover"
          src={foodReview.image_url}
          height={500}
          width={500}
          alt={foodReview.name}
        />
        <div className="flex flex-col text-left mx-4 w-full">
          <div className="flex flex-row justify-between">
            <h1 className=" text-xl font-bold m-2">{foodReview.name}</h1>
            {currentUserId === foodReview.user_id && (
              <FoodReviewOptions foodReview={foodReview} />
            )}
          </div>
          <h1 className=" text-md mb-4  mx-2">
            Last update: {formatDate(foodReview.updated_at)}
          </h1>
          <h1 className=" text-lg font-bold m-2">
            {"\u20b1"}
            {foodReview.price}
          </h1>
          <h1 className="text-base md:text-md mt-2 mx-2">Description:</h1>
          <h1 className="text-base md:text-md mx-2">{foodReview.description}</h1>
        </div>
      </div>
    </div>
  );
}
