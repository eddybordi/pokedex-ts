export interface Pokemon {
  name: string,
  url: string,
  data: any
}

export interface PokemonData {
  id: number,
  svg: string,
  types: Array<any>,
  abilities: Array<any>,
  height: number,
  weight: number,
  stats: Array<any>,
}