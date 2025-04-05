import { useEffect, useMemo, useState } from "react";
import "./App.css";
import { Pokemon, pokemonsWithPower$ } from "./store";

const Search = () => {
  const [search, setSearch] = useState("");
  const [pokemons, setPokemons] = useState<Pokemon[]>([]);

  useEffect(() => {
    const pokemonsSubscriber = pokemonsWithPower$.subscribe((pokemonsData) =>
      setPokemons(pokemonsData)
    );

    return () => pokemonsSubscriber.unsubscribe();
  }, []);

  const filteredPokemons = useMemo(() => {
    return pokemons.filter((pokemon) =>
      pokemon.name.toLowerCase().includes(search.toLowerCase())
    );
  }, [search, pokemons]);

  return (
    <div>
      <input
        type="text"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      <div>
        {filteredPokemons.map((pokemon) => (
          <div key={pokemon.id}>
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
    </div>
  );
};

export default App;
