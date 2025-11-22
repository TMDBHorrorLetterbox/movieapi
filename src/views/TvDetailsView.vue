<script setup>
  import { defineProps, onMounted } from 'vue';
  import { useTvStore } from '@/stores/tv';
  import { useWatchedStore } from '@/stores/watched';
  import { useLikedStore } from '@/stores/liked';
  import { useWishlistStore } from '@/stores/wishlist';
  import StarRating from '@/components/StarRating.vue';
  const tvStore = useTvStore();
  const watchedStore = useWatchedStore();
  const likedStore = useLikedStore();
  const wishlistStore = useWishlistStore();

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
        <button
          v-if="!watchedStore.isWatched(tvStore.currentTvShow.id, 'tv')"
          @click="watchedStore.addWatched(tvStore.currentTvShow, 'tv')"
        >
          Marcar como assistido
        </button>
        <button
          v-else
          @click="watchedStore.removeWatched(tvStore.currentTvShow.id, 'tv')"
        >
          Remover dos assistidos
        </button>
        <button
          v-if="!likedStore.isLiked(tvStore.currentTvShow.id, 'tv')"
          @click="likedStore.addLiked(tvStore.currentTvShow, 'tv')"
        >
          Curtir
        </button>
        <button
          v-else
          @click="likedStore.removeLiked(tvStore.currentTvShow.id, 'tv')"
        >
          Descurtir
        </button>
        <button
          v-if="!wishlistStore.isInWishlist(tvStore.currentTvShow.id, 'tv')"
          @click="wishlistStore.addToWishlist(tvStore.currentTvShow, 'tv')"
        >
          Adicionar à lista de desejos
        </button>
        <button
          v-else
          @click="wishlistStore.removeFromWishlist(tvStore.currentTvShow.id, 'tv')"
        >
          Remover da lista de desejos
        </button>
        <div>
          <p>Sua avaliação:</p>
          <StarRating 
            :itemId="tvStore.currentTvShow.id" 
            :itemType="'tv'"
            :itemData="tvStore.currentTvShow"
          />
        </div>
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