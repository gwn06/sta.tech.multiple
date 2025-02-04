import { Suspense } from "react";
import Search from "../activity-2/components/search";
import { getPokemons } from "@/app/actions";
import PokemonsView  from "./components/pokemons";
import { PokemonData } from "./types/types";

export default async function Activitiy4(props: {
  searchParams?: Promise<{ search: string; sortBy: string; sort: string }>;
}) {
  const searchParams = await props.searchParams;
  const query = searchParams?.search || "";
  const sortBy = searchParams?.sortBy || "id";
  const sort = searchParams?.sort || "asc";

  
  const pokemons: Promise<PokemonData[]> = getPokemons(query, sortBy, sort);

  return (
    <div className="max-w-full text-center mx-auto mt-4">
      <h1 className="text-2xl font-bold mb-2">Google Drive lite</h1>
      <Search />
      <Suspense fallback={<div>Loading...</div>}>
      <PokemonsView pokemonsPromise={pokemons} />
      </Suspense>
    </div>
  );
}
