<template>
  <vs-card type="4" class="list-element">
    <template #img>
      <img :src="pokemon.data.svg" />
      <vs-button class="button move" icon @click.stop="">
        <i class="bx bx-move"></i>
      </vs-button>
    </template>
    <template #interactions>
      <vs-button class="button" icon @click.stop="removeFromTeam(position)">
        <i class="bx bx-trash"></i>
      </vs-button>
    </template>
  </vs-card>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'nuxt-property-decorator'
import { teamStore } from '~/store'
import { Pokemon } from '~/types'

@Component({})
export default class TeamElement extends Vue {
  @Prop()
  pokemon!: Pokemon
  @Prop()
  position!: number

  removeFromTeam(position: number) {
    teamStore.remove(position)
  }
}
</script>

<style lang="scss">
.list-element {
  cursor: pointer;

  h3 {
    text-transform: capitalize;
  }

  .button {
    background: #efefef;
    color: #000000;
  }
  .move {
    bottom: 5px;
    position: absolute;
    left: 10px;
    cursor: grab;
  }

  .vs-card__img {
    position: initial;

    img {
      width: auto;
      height: 150px;
      min-width: auto !important;
    }
  }
  .vs-card__interactions {
    left: auto;
    right: 0;
  }
  .vs-card {
    max-width: none !important;
    border-radius: 0;
    cursor: inherit;
    &:hover {
      transform: scale(1) !important;
    }
  }
  .vs-card__text {
    display: flex;
    flex-direction: column;
    justify-content: center;
  }
  .vs-card__title {
    padding-top: 0;
  }
}
</style>