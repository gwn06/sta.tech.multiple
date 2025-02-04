import { Suspense } from "react";
import SortingGroupContainer from "../../activity-2/components/sorting-group-container";
import PokemonsGridView from "./pokemons-grid-view";
import { PokemonData } from "../types/types";


interface PokemonsProps {
  pokemonsPromise: Promise<PokemonData[]>;
}

export default function PokemonsView({ pokemonsPromise }: PokemonsProps) {

  return (
    <div className="">
      <Suspense fallback={<div>Loading...</div>}>
        <div className="flex justify-end items-center md:mx-36">
          <SortingGroupContainer sortByRowName="inserted_at" />
        </div>
      </Suspense>
      <Suspense fallback={<div>Loading...</div>}>
        <div className="flex justify-center max-h-[300px] md:max-h-[500px] lg:max-h-[600px] overflow-y-auto">
            <PokemonsGridView pokemonsPromise={pokemonsPromise} />
        </div>
      </Suspense>
    </div>
  );
}
