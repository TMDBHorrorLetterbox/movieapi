<script setup>
  import { defineProps, onMounted } from 'vue';
  import { useMovieStore } from '@/stores/movie';
  import { useWatchedStore } from '@/stores/watched';
  import { useLikedStore } from '@/stores/liked';
  import { useWishlistStore } from '@/stores/wishlist';
  import StarRating from '@/components/StarRating.vue';
  const movieStore = useMovieStore();
  const watchedStore = useWatchedStore();
  const likedStore = useLikedStore();
  const wishlistStore = useWishlistStore();

  const props = defineProps({
    movieId: {
      type: Number,
      required: true,
    },
  });

  onMounted(async () => {
    await movieStore.getMovieDetail(props.movieId);
  });
</script>

<template>
  <div class="main">
    <div class="content">
      <img
        :src="`https://image.tmdb.org/t/p/w185${movieStore.currentMovie.poster_path}`"
        :alt="movieStore.currentMovie.title"
      />

      <div class="details">
        <h1>Filme: {{ movieStore.currentMovie.title }}</h1>
        <button
          v-if="!watchedStore.isWatched(movieStore.currentMovie.id, 'movie')"
          @click="watchedStore.addWatched(movieStore.currentMovie, 'movie')"
        >
          Marcar como assistido
        </button>
        <button
          v-else
          @click="watchedStore.removeWatched(movieStore.currentMovie.id, 'movie')"
        >
          Remover dos assistidos
        </button>
        <button
          v-if="!likedStore.isLiked(movieStore.currentMovie.id, 'movie')"
          @click="likedStore.addLiked(movieStore.currentMovie, 'movie')"
        >
          Curtir
        </button>
        <button
          v-else
          @click="likedStore.removeLiked(movieStore.currentMovie.id, 'movie')"
        >
          Descurtir
        </button>
        <button
          v-if="!wishlistStore.isInWishlist(movieStore.currentMovie.id, 'movie')"
          @click="wishlistStore.addToWishlist(movieStore.currentMovie, 'movie')"
        >
          Adicionar à lista de desejos
        </button>
        <button
          v-else
          @click="wishlistStore.removeFromWishlist(movieStore.currentMovie.id, 'movie')"
        >
          Remover da lista de desejos
        </button>
        <div>
          <p>Sua avaliação:</p>
          <StarRating 
            :itemId="movieStore.currentMovie.id" 
            :itemType="'movie'"
            :itemData="movieStore.currentMovie"
          />
        </div>
        <p>{{ movieStore.currentMovie.tagline }}</p>
        <p>{{ movieStore.currentMovie.overview }}</p>
        <p>Orçamento: ${{ movieStore.currentMovie.budget }}</p>
        <p>Avaliação: {{ movieStore.currentMovie.vote_average }}</p>
      </div>
    </div>
  </div>

  <p>Produtoras</p>
  <div class="companies">
    <template
      v-for="company in movieStore.currentMovie.production_companies"
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