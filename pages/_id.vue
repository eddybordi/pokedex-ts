<template>
  <vs-dialog
    v-if="pokemons().length && pokemon()"
    v-model="active"
    overflow-hidden
    scroll
  >
    <ListElement :pokemon="pokemon()" />
    <div class="general">
      <div>
        <div class="title">Height</div>
        <div class="data">{{ pokemon().data.height / 10 }} m</div>
      </div>
      <div>
        <div class="title">Weight</div>
        <div class="data">{{ pokemon().data.weight / 10 }} kg</div>
      </div>
    </div>
    <div class="title">Types</div>
    <div class="types">
      <div
        class="type"
        v-for="(t, $index) in pokemon().data.types"
        :key="$index"
      >
        {{ t.type.name }}
      </div>
    </div>
    <div class="title">Abilities</div>
    <div class="types">
      <div
        class="type"
        v-for="(a, $index) in pokemon().data.abilities"
        :key="$index"
      >
        {{ a.ability.name }}
      </div>
    </div>
    <div class="title">Stats</div>
    <radar-chart :data="chartData()" :options="chartOptions" />
  </vs-dialog>
</template>

<script lang="ts">
import draggable from 'vuedraggable'
import { Component, Vue, Watch } from 'nuxt-property-decorator'
import { pokemonsStore } from '~/store'
import { teamStore } from '~/store'
import { Pokemon, PokemonData } from '~/types'

@Component({})
export default class PokemonDetails extends Vue {
  active: boolean = true

  chartOptions: object = {
    legend: {
      display: false,
    },
    scale: {
      angleLines: {
        display: false,
      },
      ticks: {
        suggestedMin: 0,
      },
    },
  }

  pokemons(): Array<Pokemon> {
    return pokemonsStore.getList
  }
  pokemon() {
    return pokemonsStore.getList[<any>this.$route.params.id - 1]
  }

  @Watch('active')
  onActiveChange(active: boolean) {
    if (!this.active) {
      this.$router.push('/')
      this.active = true
    }
  }

  chartData() {
    const labels = []
    for (let e of this.pokemon().data.stats) {
      labels.push(e.stat.name)
    }

    const data = []
    for (let e of this.pokemon().data.stats) {
      data.push(e.base_stat)
    }

    return {
      labels,
      datasets: [
        {
          borderColor: '#fe4758',
          data,
        },
      ],
    }
  }
}
</script>

<style lang="scss" scoped>
.title {
  font-weight: bold;
  margin-top: 1rem;
}

.general {
  display: flex;

  & > div {
    width: 50%;
  }

  .data {
    margin-top: 1rem;
  }
}

.types {
  display: flex;
  margin-top: 1rem;

  .type {
    background-color: #fe4758;
    border-radius: 5px;
    color: #fff;
    padding: 3px 8px;
    text-transform: capitalize;
    font-weight: 500;

    &:not(:first-child) {
      margin-left: 1rem;
    }
  }
}
</style>