export interface PokemonData {
  id: number;
  name: string;
  image_url: string;
  description: string;
  inserted_at: string;
  pokemons_reviews: PokemonReview[];
}

export interface PokemonReview {
  id: number;
  pokemon_id: number;
  user_id: string;
  review: string;
  rating: number;
  email: string;
  inserted_at: string;
}