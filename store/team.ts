import { Module, VuexModule, Mutation } from 'vuex-module-decorators'
import { Pokemon } from '~/types'

@Module({ name: 'team', namespaced: true, stateFactory: true, preserveState: true })
export default class TeamModule extends VuexModule {
  list: Pokemon[] = []
  active: boolean = false

  @Mutation
  add(pokemon: Pokemon) {
    this.list.push(pokemon)
  }
  @Mutation
  remove(position: number) {
    this.list.splice(position, 1)
  }
  @Mutation
  update(team: Array<Pokemon>) {
    this.list = team
  }
  @Mutation
  toggle(val: boolean) {
    this.active = val
  }

  get getList() {
    return this.list
  }
  get getActive() {
    return this.active
  }
}