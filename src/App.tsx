import { useMemo, useState } from "react";
import "./App.css";
import { PokemonsProvider, usePokemons } from "./store";
import { useObservableState } from "observable-hooks";
import { BehaviorSubject, combineLatestWith, map } from "rxjs";

const SelectedPokemons = () => {
  const { selectedPokemons$ } = usePokemons();

  const selectedPokemons = useObservableState(selectedPokemons$, []);

  return (
    <PokemonsProvider>
      <div>
        <h4>Deck</h4>
        <div>
          {selectedPokemons.map((pokemon) => (
            <div key={pokemon.id} style={{ display: "flex" }}>
              <img
                src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemon.id}.png`}
                alt={pokemon.name}
              />
              <div>
                <div>{pokemon.name}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </PokemonsProvider>
  );
};

const Search = () => {
  const { pokemons$, selectedPokemonIds$ } = usePokemons();

  const search$ = useMemo(() => new BehaviorSubject(""), []);

  const pokemons = useObservableState(pokemons$, []);

  const [filteredPokemons] = useObservableState(
    () =>
      pokemons$.pipe(
        combineLatestWith(search$),
        map(([pokemons, search]) =>
          pokemons.filter((pokemon) =>
            pokemon.name.toLowerCase().includes(search.toLowerCase())
          )
        )
      ),
    []
  );

  return (
    <div>
      <input
        type="text"
        value={search$.value}
        onChange={(e) => search$.next(e.target.value)}
      />
      <div>
        {filteredPokemons.map((pokemon) => (
          <div key={pokemon.id}>
            <input
              type="checkbox"
              checked={pokemon.isSelected}
              onChange={() => {
                if (selectedPokemonIds$.value.includes(pokemon.id)) {
                  selectedPokemonIds$.next(
                    selectedPokemonIds$.value.filter((id) => id !== pokemon.id)
                  );
                } else {
                  selectedPokemonIds$.next([
                    ...selectedPokemonIds$.value,
                    pokemon.id,
                  ]);
                }
              }}
            />
            <strong>{pokemon.name}</strong> - {pokemon.power}
          </div>
        ))}
      </div>
    </div>
  );
};

const App = () => {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
      }}
    >
      <Search />
      <SelectedPokemons />
    </div>
  );
};

export default App;
