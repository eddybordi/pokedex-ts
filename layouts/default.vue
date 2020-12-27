<template>
  <div class="container">
    <img
      class="pokeball"
      src="@/static/pokeball.svg"
      @click="toggleTeam(true)"
    />
    <div class="main">
      <i
        class="bx bx-x search-close"
        v-if="name"
        @click="
          name = ''
          search()
        "
      ></i>
      <vs-input
        color="#FE4758"
        border
        type="text"
        v-model="name"
        @keyup="search"
        placeholder="Search"
        class="search"
      >
        <template #icon>
          <i class="bx bx-search"></i>
        </template>
      </vs-input>

      <div class="list-ct">
        <div class="list">
          <div
            v-for="(pokemon, $index) in currentList"
            :key="$index"
            @click="$router.push('/' + pokemon.data.id)"
          >
            <ListElement :pokemon="pokemon" />
          </div>
        </div>

        <infinite-loading
          v-if="filteredPokemons.length"
          @infinite="infiniteHandler"
          :identifier="scrollId"
        ></infinite-loading>
      </div>
    </div>
    <Team />
    <Nuxt />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'
import { pokemonsStore } from '~/store'
import { teamStore } from '~/store'
import { Pokemon, PokemonData } from '~/types'

@Component({})
export default class DefaultLayout extends Vue {
  currentList: Array<Pokemon> = []
  filteredPokemons: Array<Pokemon> = []
  name: string = ''
  loaded: number = 0
  nbPerPage: number = 25
  nbMax: number = 151
  scrollId: string = 'default'

  pokemons(): Array<Pokemon> {
    return pokemonsStore.getList
  }

  setPokemons(pokemons: Array<Pokemon>) {
    pokemonsStore.set(pokemons)
  }
  loadPokemon(data: PokemonData) {
    pokemonsStore.load(data)
  }
  toggleTeam(val: boolean) {
    teamStore.toggle(val)
  }

  getPokemonDetails(pokemon: Pokemon): Promise<any> {
    return this.$axios.get(pokemon.url).then((res) => {
      const data: PokemonData = {
        id: res.data.id,
        svg: res.data.sprites.other['official-artwork'].front_default,
        types: res.data.types,
        abilities: res.data.abilities,
        height: res.data.height,
        weight: res.data.weight,
        stats: res.data.stats,
      }

      this.loadPokemon(data)
      pokemon.data = data
    })
  }

  addToCurrentList() {
    for (let i = this.loaded; i < this.loaded + this.nbPerPage; i++) {
      if (i >= this.nbMax) break
      this.currentList.push(this.filteredPokemons[i])
    }

    this.loaded += this.nbPerPage
  }

  infiniteHandler($state: any) {
    this.pokemonsDetails($state)
  }

  async pokemonsDetails(infinite: any) {
    if (this.loaded >= this.nbMax) {
      if (infinite) infinite.complete()
      return
    }

    const resolves: Array<Promise<Pokemon>> = []

    for (let i = this.loaded; i < this.loaded + this.nbPerPage; i++) {
      if (i >= this.nbMax) break

      const pokemon = this.filteredPokemons[i]

      if (!pokemon.data) {
        resolves.push(this.getPokemonDetails(pokemon))
      }
    }

    if (resolves.length) await Promise.all(resolves)
    this.addToCurrentList()
    if (infinite) infinite.loaded()
  }

  search() {
    if (!this.name.length || this.name.length > 1) {
      this.currentList = []
      this.loaded = 0

      const reg = new RegExp(this.name, 'i')
      this.filteredPokemons = this.pokemons().filter((pokemon) =>
        pokemon.name.match(reg)
      )
      this.nbMax = this.filteredPokemons.length
      this.scrollId = this.name ? this.name : Date.now().toString()
    }
  }

  async fetch() {
    if (!this.pokemons().length) {
      const pokemons = await this.$axios
        .get('https://pokeapi.co/api/v2/pokemon?offset=0&limit=' + this.nbMax)
        .then((res) => res.data.results)

      for (const pokemon of pokemons) pokemon.data = null

      this.setPokemons(pokemons)
      this.filteredPokemons = this.pokemons()

      if (
        this.$route.params.id &&
        !this.pokemons()[<any>this.$route.params.id - 1].data
      ) {
        this.getPokemonDetails(this.pokemons()[<any>this.$route.params.id - 1])
      }
    } else {
      this.filteredPokemons = this.pokemons()

      if (
        this.$route.params.id &&
        !this.pokemons()[<any>this.$route.params.id - 1].data
      ) {
        this.getPokemonDetails(this.pokemons()[<any>this.$route.params.id - 1])
      }
    }
  }
}
</script>

<style lang="scss">
html {
  font-family: 'Source Sans Pro', -apple-system, BlinkMacSystemFont, 'Segoe UI',
    Roboto, 'Helvetica Neue', Arial, sans-serif;
  font-size: 16px;
  word-spacing: 1px;
  -ms-text-size-adjust: 100%;
  -webkit-text-size-adjust: 100%;
  -moz-osx-font-smoothing: grayscale;
  -webkit-font-smoothing: antialiased;
  box-sizing: border-box;
}

*,
*::before,
*::after {
  box-sizing: border-box;
  margin: 0;
}

.container {
  display: flex;

  .pokeball {
    width: 70px;
    position: fixed;
    bottom: 10px;
    right: 10px;
    z-index: 3;

    @media only screen and (min-width: 768px) {
      display: none;
    }
  }

  .main {
    width: calc(100% - 200px);
    position: relative;

    @media only screen and (max-width: 768px) {
      width: 100%;
    }
  }

  .team {
    width: 200px;
  }
}

.search-close {
  z-index: 3;
  position: fixed;
  font-size: 2rem;
  top: 5px;
  left: calc(100% - 232px);
  cursor: pointer;

  @media only screen and (max-width: 768px) {
    left: auto;
    right: 0;
  }
}
.search {
  z-index: 2;
  top: 0;
  left: 0;
  background: #fff;
  overflow: hidden;
}
.vs-input,
.vs-input__label {
  width: 100%;
  font-size: 1.3rem;
}

.vs-card-content.type-4 .vs-card__img img {
  transform: scale(0.9);
}

.list-ct {
  overflow-y: auto;
  height: calc(100vh - 42px);
}
.list {
  & > div {
    cursor: pointer;
  }

  @media only screen and (max-width: 768px) {
    padding-bottom: 60px;
  }
}

a {
  text-decoration: none;
}
</style>