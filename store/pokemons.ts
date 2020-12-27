import { Module, VuexModule, Mutation } from 'vuex-module-decorators'
import { Pokemon, PokemonData } from '~/types'

@Module({ name: 'pokemons', namespaced: true, stateFactory: true, preserveState: true })
export default class PokemonModule extends VuexModule {
  list: Pokemon[] = []

  @Mutation
  set(pokemons: Array<Pokemon>) {
    this.list = pokemons
  }
  @Mutation
  load(data: PokemonData) {
    this.list[data.id - 1].data = data
  }

  get getList() {
    return this.list
  }
}