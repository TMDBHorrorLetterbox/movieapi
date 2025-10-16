<script setup>
  import { defineProps, onMounted } from 'vue';
  import { useTvStore } from '@/stores/tv';
  const tvStore = useTvStore();

  const props = defineProps({
    tvShowId: {
      type: Number,
      required: true,
    },
  });

  onMounted(async () => {
    await tvStore.getTvShowDetail(props.tvShowId);
  });
</script>

<template>
  <div class="main">
    <div class="content">
      <img
        :src="`https://image.tmdb.org/t/p/w185${tvStore.currentTvShow.poster_path}`"
        :alt="tvStore.currentTvShow.title"
      />

      <div class="details">
        <h1>Série: {{ tvStore.currentTvShow.title }}</h1>
        <p>{{ tvStore.currentTvShow.tagline }}</p>
        <p>{{ tvStore.currentTvShow.overview }}</p>
        <p>Orçamento: ${{ tvStore.currentTvShow.budget }}</p>
        <p>Avaliação: {{ tvStore.currentTvShow.vote_average }}</p>
      </div>
    </div>
  </div>

  <p>Produtoras</p>
  <div class="companies">
    <template
      v-for="company in tvStore.currentTvShow.production_companies"
      :key="company.id"
    >
      <img
        v-if="company.logo_path"
        :src="`https://image.tmdb.org/t/p/w92${company.logo_path}`"
        :alt="company.name"
      />
      <p v-else>{{ company.name }}</p>
    </template>
  </div>
</template>

<style scoped>
  .companies {
    display: flex;
    flex-direction: row;
    column-gap: 3rem;
    align-items: center;
    margin-bottom: 2rem;
  }
</style>