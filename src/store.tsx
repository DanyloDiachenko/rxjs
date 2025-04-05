import { BehaviorSubject } from "rxjs";

interface Pokemon {
  id: number;
  name: string;
  type: string[];
  hp: number;
  attack: number;
  defense: number;
  special_attack: number;
  special_defense: number;
  speed: number;
}

export const rawPokemon$ = new BehaviorSubject<Pokemon[]>([]);

fetch("/pokemon-data.json")
  .then((res) => res.json())
  .then((data) => rawPokemon$.next(data));
