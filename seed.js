const pokemonAPIUrl = "https://pokeapi.co/api/v2/pokemon/";
const pokemonDescriptionAPIUrl = "https://pokeapi.co/api/v2/pokemon-species/";

async function fetchPokemons(limit = 100, offset = 0) {
  const resp = await fetch(`${pokemonAPIUrl}?limit=${limit}&offset=${offset}`);
  const data= await resp.json();
  return data.results;
}

async function fetchPokemonDescription(url) {
  const resp = await fetch(url);
  const data = await resp.json();
  const speciesResponse = await fetch(pokemonDescriptionAPIUrl + data.id);
  const speciesData = await speciesResponse.json();

  return {
    id: data.id,
    name: data.name,
    sprite: data.sprites.front_default,
    description:
      speciesData.flavor_text_entries.find(
        (entry) => entry.language.name === "en",
      )?.flavor_text || "No description available",
  };
}

const limit = 100;
let offset = 0;
const pokemons = [];
const pokemonsData = []

const {createClient} = require("@supabase/supabase-js")
const supabase = createClient("", "")

const getPokemons = async() => {

  for(let i = 1; i < 15; i++) {
    offset = (i - 1) * limit;
   const result =  await fetchPokemons(limit, offset)
   pokemons.push(...result)
  }
  console.log(pokemons)

  for(const pokemon of pokemons) {
    const pk =  await fetchPokemonDescription(pokemon.url)
    const {data, error} =  await supabase.from("pokemons").insert({id: pk.id, name: pk.name, image_url: pk.sprite, description: pk.description})
    console.log(pk.id)
  }

  console.log("DONE!!!!");
}

getPokemons();
