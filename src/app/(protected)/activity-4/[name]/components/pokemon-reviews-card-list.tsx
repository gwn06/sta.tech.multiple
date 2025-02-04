"use client"
import { User } from "@supabase/supabase-js";
import { PokemonData, PokemonReview } from "../../types/types";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import { useState } from "react";
import Rating from "@/app/(protected)/activity-3/components/rating";

interface PokemonReviewsCardListProps {
    user: User;
    pokemonData: PokemonData;
}

export default function PokemonReviewsCardList({user, pokemonData}: PokemonReviewsCardListProps) {
  const router = useRouter();
  const supabase = createClient();

  const findUserPokemonReview = () =>
    pokemonData.pokemons_reviews.find((review) => review.user_id === user.id);
  const userReview = findUserPokemonReview();
  
  const [comment, setComment] = useState(userReview?.review ?? "");
  const [userRating, setUserRating] = useState(userReview?.rating ?? 0);
  const [reviewsList, setReviewsList] = useState( pokemonData.pokemons_reviews);


  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (comment.trim() && userRating !== 0) {
      const userReviewToUpsert = {
        pokemon_id: pokemonData.id,
        user_id: user.id,
        review: comment,
        email: user.email,
        rating: userRating,
      };

      if (userReview) {
        Object.assign(userReviewToUpsert, { id: userReview.id });
      }
      const { data } = await supabase
        .from("pokemons_reviews")
        .upsert(userReviewToUpsert)
        .select()
        .single();

      setReviewsList((prevReviews) => {
        const filteredReviews = prevReviews.filter(
          (review) => review.id !== data.id
        );
        return [data, ...filteredReviews].sort(
          (a, b) =>
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );
      });
      router.refresh();
    }
  };


  const handleDeleteReview = async (review: PokemonReview) => {
    await supabase.from("pokemons_reviews").delete().eq("id", review.id);
    setReviewsList((prevReviews) => {
      const filteredReviews = prevReviews.filter((r) => r.id !== review.id);
      return [...filteredReviews].sort(
        (a, b) =>
          new Date(b.inserted_at).getTime() - new Date(a.inserted_at).getTime()
      );
    });

    setComment("");
    router.refresh();
  };

  return (
    <div className=" p-4 border rounded-lg shadow-sm bg-white">
      <h2 className="text-lg text-left font-semibold mb-4">Leave a review</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <Rating
            setUserRating={(rating: number) => setUserRating(rating)}
            initialRating={userRating}
            isDisabled={false}
          />
        </div>
        <div className="flex flex-row space-x-2">
          <div className="w-10 h-10 rounded-xl bg-gray-800 text-white justify-center items-center flex">
            {(user.email?.[0] ?? "?").toUpperCase()}
          </div>
          <textarea
            className="w-full p-2 border border-gray-300 rounded-md"
            rows={4}
            placeholder="Write your comment..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />
        </div>
        <div className="w-full flex justify-end">
          <button
            type="submit"
            className="mt-2 bg-green-500 text-white p-2 rounded-md hover:bg-green-600"
          >
            Submit
          </button>
        </div>
      </form>
      <div className="mt-4">
        <h3 className="text-lg font-semibold text-left">Reviews</h3>
        {reviewsList?.length === 0 && (
          <div className="w-full flex items-center justify-center font-bold h-52">
            Empty
          </div>
        )}
        <ul className="text-left">
          {reviewsList.map((review, index) => (
            <li key={index} className="mt-1">
              <div className="flex flex-row">
                <div className="w-10 h-10 rounded-xl bg-gray-800 text-white justify-center items-center flex">
                  {review.email[0].toUpperCase()}
                </div>
                <div className="w-full flex flex-col ml-4">
                  <div className=" flex justify-between">
                    <div className="font-bold">{review.email}</div>
                    {user.id === review.user_id && (
                      <button
                        onClick={() => handleDeleteReview(review)}
                        className="text-red-500 hover:text-red-700"
                      >
                        delete
                      </button>
                    )}
                  </div>
                  <div className="flex justify-start">
                    <Rating initialRating={review.rating} isDisabled={true} />
                  </div>
                  <div>{review.review}</div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}