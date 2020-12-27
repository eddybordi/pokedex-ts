import { Store } from 'vuex'
import { getModule } from 'vuex-module-decorators'
import pokemons from '~/store/pokemons'
import team from '~/store/team'

let pokemonsStore: pokemons
let teamStore: team

function initialiseStores(store: Store<any>): void {
  pokemonsStore = getModule(pokemons, store)
  teamStore = getModule(team, store)
}

export { initialiseStores, pokemonsStore, teamStore }