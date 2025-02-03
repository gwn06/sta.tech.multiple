import Image from "next/image";
import { use } from "react";
import { FoodReview } from "./food_review";
import Link from "next/link";

interface GridPhotosProps {
  imagesPromise: Promise<FoodReview[]>;
}

export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  return `${day}/${month}/${year} ${hours}:${minutes}`;
}

export default function FoodGridPhotos({ imagesPromise }: GridPhotosProps) {
  const foods = use(imagesPromise);
  return (
    <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4">
      {foods.map((food) => (
        <Link key={food.id} href={`/activity-3/${food.slug}`}>
          <div
            key={food.id}
            className="hover:bg-slate-200  ease-in-out max-w-36 sm:max-w-44 md:max-w-52 p-2 shadow-sm rounded-lg bg-slate-100 text-center"
          >
            <div className="w-24 h-24 sm:w-36 sm:h-36 md:h-48 md:w-48 overflow-hidden rounded-lg shadow-md mx-auto">
              <Image
                src={food.image_url}
                width={500}
                height={500}
                alt={food.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="font-bold mx-2 my-1 text-sm overflow-hidden whitespace-nowrap text-ellipsis">
              {food.name}
            </div>
            <div className="mt-2  text-sm md:text-base overflow-hidden whitespace-nowrap text-ellipsis">
              PHP{food.price}
            </div>

            <div className=" text-sm  overflow-hidden whitespace-nowrap text-ellipsis">
              {formatDate(food.updated_at)}
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}
