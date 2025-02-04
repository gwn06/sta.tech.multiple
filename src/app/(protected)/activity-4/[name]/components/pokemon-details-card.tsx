import { formatDate } from "@/app/(protected)/activity-3/components/food-grid-photos";
import { PokemonData } from "../../types/types";
import Image from "next/image"

interface PokemonDetailsCardProps {
    pokemonData: PokemonData;
}

export default function PokemonDetailsCard({pokemonData}: PokemonDetailsCardProps) {
  return (
    <div className="bg-white rounded-sm p-2 shadow-sm">
      <div className="flex flex-row">
        <Image
          className="rounded-md shadow-sm h-[200px] w-[200px] sm:h-[300px] sm:w-[300px] md:h-[400px] md:w-[400px] object-cover"
          src={pokemonData.image_url}
          height={500}
          width={500}
          alt={pokemonData.name}
        />
        <div className="flex flex-col text-left mx-4 w-full">
          <div className="flex flex-row justify-between">
            <h1 className=" text-xl font-bold m-2">{pokemonData.name}</h1>
          </div>
          <h1 className=" text-md mb-4  mx-2">
             Date created: {formatDate(pokemonData.inserted_at)}
          </h1>
          <h1 className="text-base md:text-md mt-2 mx-2">Description:</h1>
          <h1 className="text-base md:text-md mx-2">{pokemonData.description}</h1>
        </div>
      </div>
    </div>
  );
}