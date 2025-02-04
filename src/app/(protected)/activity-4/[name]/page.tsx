import { getPokemonReviewsBy } from "@/app/actions";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import PokemonDetailsCard from "./components/pokemon-details-card";
import { PokemonData } from "../types/types";
import PokemonReviewsCardList from "./components/pokemon-reviews-card-list";

export default async function PokemonReview({
  params,
}: {
  params: Promise<{ name: string }>;
}) {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getUser();
  if (error || !data?.user) {
    redirect("/sign-in");
  }

  const name = (await params).name;
  const pokemonData: PokemonData = await getPokemonReviewsBy(name);
  console.log(pokemonData)

  return (
    <div className="max-w-full text-center mx-auto bg-slate-50 h-full">
      <div className="lg:mx-[350px] py-8">
        <Suspense fallback={<div>Loading...</div>}>
          <PokemonDetailsCard pokemonData={pokemonData} />
        </Suspense>
        <div className="py-2"></div>
        <Suspense fallback={<div>Loading...</div>}>
          <PokemonReviewsCardList pokemonData={pokemonData} user={data.user} />
        </Suspense>
      </div>
    </div>
  );
}
