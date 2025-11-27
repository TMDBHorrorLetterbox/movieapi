<script setup>
  import { defineProps, onMounted, watch, computed } from 'vue';
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

  const loadMovie = async () => {
    await movieStore.getMovieDetail(props.movieId);
  };

  onMounted(loadMovie);

  watch(() => props.movieId, loadMovie);

  // Extrai o primeiro trailer (YouTube) ou null
  const trailerKey = computed(() => {
    const videos = movieStore.currentMovie.videos?.results || [];
    const trailer = videos.find(v => v.type === 'Trailer' && v.site === 'YouTube');
    return trailer?.key || null;
  });

  const trailerUrl = computed(() => {
    return trailerKey.value ? `https://www.youtube.com/embed/${trailerKey.value}` : null;
  });
</script>

<template>
  <div
  class="main"
  :style="{
    background: `
      linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,1.0)),
      url(https://image.tmdb.org/t/p/original${movieStore.currentMovie.backdrop_path})
    `,
    backgroundPosition: 'center',
    backgroundSize: 'cover',
    backgroundRepeat: 'no-repeat'
  }"
>
    <div class="content">
      <!-- Trailer Section -->
      <div v-if="trailerUrl" class="trailer-section">
        <iframe
          class="trailer"
          :src="trailerUrl + '?autoplay=0'"
          title="Trailer"
          frameborder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowfullscreen
        ></iframe>
      </div>

      <div class="details">
        <img
        :src="`https://image.tmdb.org/t/p/w185${movieStore.currentMovie.poster_path}`"
        :alt="movieStore.currentMovie.title"
      />

        <div class="left">
        <h1>Filme: {{ movieStore.currentMovie.title }}</h1>
        <p>{{ movieStore.currentMovie.tagline }}</p>
        <p>{{ movieStore.currentMovie.overview }}</p>
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
          <span class="fa-regular fa-bookmark"></span>
        </button>
        <button
          v-else
          @click="wishlistStore.removeFromWishlist(movieStore.currentMovie.id, 'movie')"
        >
          <span class="fa-solid fa-bookmark"></span>
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

  <p>Elenco</p>
  <div class="cast">
    <div v-for="actor in movieStore.currentMovie.credits?.cast?.slice(0, 12)" :key="actor.id" class="cast-member">
      <img
        v-if="actor.profile_path"
        :src="`https://image.tmdb.org/t/p/w185${actor.profile_path}`"
        :alt="actor.name"
      />
      <div v-else class="no-photo">Sem foto</div>
      <p class="actor-name">{{ actor.name }}</p>
      <p class="character-name">{{ actor.character || 'N/A' }}</p>
    </div>
  </div>
</template>

<style scoped>
  .main {
    padding: 5rem;
    height: 100vh;
    color: white;
    text-shadow: 2px 2px 4px #000000;
  }

  .trailer-section {
    width: 100%;
    max-width: 800px;
    margin-bottom: 2rem;
    aspect-ratio: 16 / 9;
    border-radius: 8px;
    overflow: hidden;
    background: #000;
  }

  .trailer {
    width: 100%;
    height: 100%;
    border: none;
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
  .left p {
    font-size: 1.2rem;
    font-family: junge, sans-serif;
    margin: 0.5rem 0;
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

  .cast {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
    gap: 1rem;
    margin-bottom: 2rem;
  }

  .cast-member {
    background: #1a1a1a;
    border-radius: 8px;
    padding: 0.5rem;
    text-align: center;
  }

  .cast-member img {
    width: 100%;
    height: auto;
    border-radius: 4px;
    margin-bottom: 0.5rem;
  }

  .no-photo {
    width: 100%;
    height: 240px;
    background: #333;
    border-radius: 4px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #999;
    margin-bottom: 0.5rem;
  }

  .actor-name {
    font-weight: bold;
    font-size: 0.9rem;
    margin: 0.25rem 0;
  }

  .character-name {
    font-size: 0.8rem;
    color: #aaa;
    margin: 0;
  }
</style>
