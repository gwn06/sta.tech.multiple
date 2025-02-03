import { getFoodReviewBy } from "@/app/actions";
import { FoodReview } from "../components/food_review";
import { createClient as supabseClient } from "@/utils/supabase/client";
import FoodReviewCard from "../components/food-review-card";
import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import { Suspense } from "react";
import ReviewCard from "../components/review-card";

export const revalidate = 60;
export const dynamicParams = true;

export async function generateStaticParams() {
  const supabase = supabseClient();
  const { data } = await supabase
    .from("food_review")
    .select("*")
    .order("name", { ascending: true });

  return data?.map((food) => ({ slug: food.slug }));
}

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getUser();
  if (error || !data?.user) {
    redirect("/sign-in");
  }

  const slug = (await params).slug;
  const foodReview: Promise<FoodReview> = getFoodReviewBy(slug);
  return (
    <div className="max-w-full text-center mx-auto bg-slate-50 h-full">
      <div className="lg:mx-[350px] py-8">
        <FoodReviewCard
          currentUserId={data.user.id}
          foodReviewPromise={foodReview}
        />
        <div className="py-2"></div>
        <Suspense fallback={<div>Loading...</div>}>
          <ReviewCard foodReviewPromise={foodReview} user={data.user} />
        </Suspense>
      </div>
    </div>
  );
}
