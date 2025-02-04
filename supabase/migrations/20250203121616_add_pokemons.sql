create table pokemons(
  id bigint primary key,
  name text not null,
  image_url text not null,
  description text not null,
  inserted_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create unique index idx_pokemon ON pokemons (name);

alter table pokemons enable row level security;

create policy "user can insert pok" on pokemons for
    insert with check (true);

create policy "users can view pokemons" on pokemons for
    select using (auth.uid() is not null);


create table pokemons_reviews(
  id bigint generated by default as identity primary key,
  pokemon_id bigint references pokemons on delete cascade not null,
  user_id uuid references auth.users not null,
  review text not null,
  rating integer default 0 not null,
  email text not null,
  inserted_at timestamp with time zone default timezone('utc'::text, now()) not null
);


alter table pokemons_reviews enable row level security;

create policy "Individuals can insert reviews" on pokemons_reviews for
    insert with check ((select auth.uid()) = user_id);

create policy "Individuals can read reviews" on pokemons_reviews for
    select using (auth.uid() is not null);

create policy "Individuals can update their own reviews" on pokemons_reviews for
    update using ((select auth.uid()) = user_id);

create policy "Individuals can delete their own reviews." on pokemons_reviews for
    delete using ((select auth.uid()) = user_id);