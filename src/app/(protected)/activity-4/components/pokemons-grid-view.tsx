import { use } from "react";
import Image from "next/image";
import Link from "next/link";
import { PokemonData } from "../types/types";

interface PokemonsProps {
  pokemonsPromise: Promise<PokemonData[]>;
}

export default function PokemonsGridView({ pokemonsPromise }: PokemonsProps) {
  const pokemons = use(pokemonsPromise);
  return (
    <div className=" grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 p-2">
      {pokemons.map((pokemon) => (
        <Link key={pokemon.id} href={`/activity-4/${pokemon.name}`}>
          <div className="max-w-36 sm:max-w-36 md:max-w-40 p-1  rounded-lg border bg-slate-100 text-center hover:bg-slate-200">
            <div className="flex justify-between items-center">
              <div className="mx-2 font-bold my-1 text-sm overflow-hidden whitespace-nowrap text-ellipsis">
                {pokemon.name}
              </div>
            </div>
            <div className="w-20 h-20 sm:w-32 sm:h-32 md:h-36 md:w-36 overflow-hidden rounded-lg  mx-auto">
              <Image
                src={pokemon.image_url}
                width={500}
                height={500}
                alt={pokemon.name}
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}
