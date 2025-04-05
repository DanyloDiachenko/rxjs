import { BehaviorSubject, map } from "rxjs";

export interface Pokemon {
  id: number;
  name: string;
  type: string[];
  hp: number;
  attack: number;
  defense: number;
  special_attack: number;
  special_defense: number;
  speed: number;
  power?: number;
}

const rawPokemons$ = new BehaviorSubject<Pokemon[]>([]);

export const pokemonsWithPower$ = rawPokemons$.pipe(
  map((pokemons) =>
    pokemons.map((pokemon) => ({
      ...pokemon,
      power:
        pokemon.hp +
        pokemon.attack +
        pokemon.defense +
        pokemon.special_attack +
        pokemon.special_defense +
        pokemon.speed,
    }))
  )
);

fetch("/pokemon-data.json")
  .then((res) => res.json())
  .then((data) => rawPokemons$.next(data));
