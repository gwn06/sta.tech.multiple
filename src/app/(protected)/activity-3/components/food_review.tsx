import { Suspense } from "react";
import FoodGridPhotos from "./food-grid-photos";
import NewFoodButton from "./new-food-button";
import SortingGroupContainer from "../../activity-2/components/sorting-group-container";
import {type User} from "@supabase/supabase-js"

export interface FoodReview {
    id: number;
    name: string;
    slug: string;
    description: string;
    price: number;
    image_url: string;
    image_path: string;
    user_id: string;
    created_at: string;
    updated_at: string;
    food_review_reviews: FoodReviewReviews[]
}

export interface FoodReviewReviews {
    id: number;
    user_id: string;
    review: string;
    created_at: string;
    updated_at: string;
    email: string;
    rating: number;
}

interface FoodReviewProps {
    foodReviews: Promise<FoodReview[]>;
    user: User;
}
export default function FoodReviewApp({ foodReviews, user }: FoodReviewProps) {
  return (
    <div className="">
      <Suspense fallback={<div>Loading...</div>}>
        <div className="flex justify-end items-center md:mx-36">
          <SortingGroupContainer sortByRowName="updated_at" />
            <NewFoodButton userId={user.id}/>
        </div>
      </Suspense>
      <Suspense fallback={<div>Loading...</div>}>
        <div className="flex justify-center max-h-[300px] md:max-h-[500px] lg:max-h-[600px] overflow-y-auto">
            <FoodGridPhotos imagesPromise={foodReviews} />
        </div>
      </Suspense>
    </div>
  );
}