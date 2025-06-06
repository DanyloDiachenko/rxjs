import { createContext, ReactNode, useContext } from "react";
import { BehaviorSubject, map, combineLatestWith } from "rxjs";

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
  isSelected?: boolean;
}

const rawPokemons$ = new BehaviorSubject<Pokemon[]>([]);

const search$ = new BehaviorSubject("");

const selectedPokemonIds$ = new BehaviorSubject<number[]>([]);

const pokemonsWithPower$ = rawPokemons$.pipe(
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

const pokemons$ = pokemonsWithPower$.pipe(
  combineLatestWith(selectedPokemonIds$),
  map(([pokemons, selectedPokemonIds]) =>
    pokemons.map((pokemon) => ({
      ...pokemon,
      isSelected: selectedPokemonIds.includes(pokemon.id),
    }))
  )
);

const selectedPokemons$ = pokemons$.pipe(
  map((pokemons) => pokemons.filter((pokemon) => pokemon.isSelected))
);

fetch("/pokemon-data.json")
  .then((res) => res.json())
  .then((data) => rawPokemons$.next(data));

const PokemonsContext = createContext({
  pokemons$,
  selectedPokemonIds$,
  selectedPokemons$,
  search$,
});

export const usePokemons = () => useContext(PokemonsContext);

export const PokemonsProvider = ({ children }: { children: ReactNode }) => {
  return (
    <PokemonsContext.Provider
      value={{
        pokemons$,
        selectedPokemonIds$,
        selectedPokemons$,
        search$,
      }}
    >
      {children}
    </PokemonsContext.Provider>
  );
};
