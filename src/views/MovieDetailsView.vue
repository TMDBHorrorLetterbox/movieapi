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
  <div class="main" :style="{ background: `url(https://image.tmdb.org/t/p/original${movieStore.currentMovie.backdrop_path})`, backgroundPosition: 'center', backgroundSize: 'cover', backgroundRepeat: 'no-repeat' }">
    <div class="content">
      
      <div class="details">
        <img
        :src="`https://image.tmdb.org/t/p/w185${movieStore.currentMovie.poster_path}`"
        :alt="movieStore.currentMovie.title"
      />

        <div class="left"> 
        <h1>Filme: {{ movieStore.currentMovie.title }}</h1>
        <p>{{ movieStore.currentMovie.tagline }}</p>
        <p>{{ movieStore.currentMovie.overview }}</p>
        <p>Orçamento: ${{ movieStore.currentMovie.budget }}</p>
        <p>Avaliação: {{ movieStore.currentMovie.vote_average }}</p>
        </div>
        <div class="box">
        <button
          v-if="!watchedStore.isWatched(movieStore.currentMovie.id, 'movie')"
          @click="watchedStore.addWatched(movieStore.currentMovie, 'movie')"
        >
          <span class="fa-solid fa-eye"></span>
        </button>
        <button
          v-else
          @click="watchedStore.removeWatched(movieStore.currentMovie.id, 'movie')"
        >
          <span class="fa-solid fa-eye-slash"></span>
        </button>
        <button
          v-if="!likedStore.isLiked(movieStore.currentMovie.id, 'movie')"
          @click="likedStore.addLiked(movieStore.currentMovie, 'movie')"
        >
          <span class="fa-regular fa-heart"></span>
        </button>
        <button
          v-else
          @click="likedStore.removeLiked(movieStore.currentMovie.id, 'movie')"
        >
          <span class="fa-solid fa-heart"></span>
        </button>
        <button
          v-if="!wishlistStore.isInWishlist(movieStore.currentMovie.id, 'movie')"
          @click="wishlistStore.addToWishlist(movieStore.currentMovie, 'movie')"
        >
          <span class="fa-solid fa-list"></span>
        </button>
        <button
          v-else
          @click="wishlistStore.removeFromWishlist(movieStore.currentMovie.id, 'movie')"
        >
          <span class="fa-solid fa-list-check"></span>
        </button>
        <div>
          <p>Sua avaliação:</p>
          <StarRating
            :itemId="movieStore.currentMovie.id"
            :itemType="'movie'"
            :itemData="movieStore.currentMovie"
          />
        </div>
        </div>
        
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
  .main {
    padding: 5rem;
    height: 100vh;
    color: white;
    text-shadow: 2px 2px 4px #000000;
  }
  .companies {
    display: flex;
    flex-direction: row;
    column-gap: 3rem;
    align-items: center;
    margin-bottom: 2rem;
  }
  .details {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    margin-left: 3rem;
    height: 600px;
  }
  .details img {
    border-radius: 10px;
    box-shadow: 0 0 20px #000000;
  }
  .left {
    max-width: 40%;
    margin-left: -10rem;
  } 
  .left h1 {
    font-size: 4rem;
    font-family: julius sans one, sans-serif;
  }
  .box {
    display: flex;
    flex-direction: column;
    row-gap: 1rem;
    align-items: flex-start;
    margin-top: 300px;
    background-color: #111111;
    padding: 2rem;
  }
  .box button {
    background: none;
    border: none;
    color: white;
    cursor: pointer;
  }

  
</style>
