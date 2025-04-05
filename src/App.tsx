import "./App.css";
import { useObservableState } from "observable-hooks";
import { combineLatestWith, map } from "rxjs";
import { PokemonsProvider, usePokemons } from "./store";

const SelectedPokemons = () => {
  const { selectedPokemons$ } = usePokemons();

  const selectedPokemons = useObservableState(selectedPokemons$, []);

  return (
    <PokemonsProvider>
      <div>
        <h2>Deck</h2>
        <ul>
          {selectedPokemons.length ? (
            selectedPokemons.map((pokemon) => (
              <li
                key={pokemon.id}
                style={{ display: "flex", alignItems: "center", gap: 12 }}
              >
                <img
                  src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemon.id}.png`}
                  alt={pokemon.name}
                  width={80}
                  height={80}
                />
                <strong>{pokemon.name}</strong>
              </li>
            ))
          ) : (
            <p>Nothing found...</p>
          )}
        </ul>
      </div>
    </PokemonsProvider>
  );
};

const AllPokemons = () => {
  const { pokemons$, selectedPokemonIds$, search$ } = usePokemons();

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

  const onSelectPokemonClick = (pokemonId: number) => {
    return () => {
      if (selectedPokemonIds$.value.includes(pokemonId)) {
        selectedPokemonIds$.next(
          selectedPokemonIds$.value.filter(
            (selectedPokemonId) => selectedPokemonId !== pokemonId
          )
        );
      } else {
        selectedPokemonIds$.next([...selectedPokemonIds$.value, pokemonId]);
      }
    };
  };

  return (
    <ul style={{ marginTop: 12 }}>
      {filteredPokemons.length ? (
        filteredPokemons.map((pokemon) => (
          <li
            key={pokemon.id}
            style={{
              marginTop: 4,
              padding: 4,
              display: "flex",
              alignItems: "center",
              gap: 8,
              cursor: "pointer",
            }}
            onClick={onSelectPokemonClick(pokemon.id)}
          >
            <input
              type="checkbox"
              checked={pokemon.isSelected}
              onChange={() => {}}
            />
            <strong>{pokemon.name}</strong> | {pokemon.power} 💪
          </li>
        ))
      ) : (
        <p>Nothing found...</p>
      )}
    </ul>
  );
};

const Search = () => {
  const { search$ } = usePokemons();

  const search = useObservableState(search$, "");

  return (
    <input
      type="text"
      value={search}
      onChange={(e) => search$.next(e.target.value)}
      placeholder="Search..."
    />
  );
};

const App = () => {
  return (
    <>
      <h1>Reactive Pokemons</h1>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 40,
          marginTop: 40,
        }}
      >
        <div>
          <Search />
          <AllPokemons />
        </div>
        <SelectedPokemons />
      </div>
    </>
  );
};

export default App;
