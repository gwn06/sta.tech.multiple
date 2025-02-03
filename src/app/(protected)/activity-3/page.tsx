import { getFoodReviews } from "@/app/actions";
import { Suspense } from "react";
import FoodReviewApp, { FoodReview } from "./components/food_review";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

export default async function Activity3(props: {
  searchParams?: Promise<{ sortBy: string; sort: string }>;
}) {
  const searchParams = await props.searchParams;
  const sortBy = searchParams?.sortBy || "name";
  const sort = searchParams?.sort || "asc";

  const supabase = await createClient();
  const { data, error } = await supabase.auth.getUser();
  if (error || !data?.user) {
    redirect("/sign-in");
  }


  const foodReviews: Promise<FoodReview[]> = getFoodReviews(sortBy, sort);
  return (
    <div className="max-w-full text-center mx-auto mt-4">
      <h1 className="text-2xl font-bold mb-2">Food Review App</h1>
      <Suspense fallback={<div>Loading...</div>}>
        <FoodReviewApp foodReviews={foodReviews} user={data.user}/>
      </Suspense>
    </div>
  );
}
