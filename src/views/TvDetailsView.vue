<script setup>
import { defineProps, onMounted, watch, computed, ref } from 'vue';
import { useTvStore } from '@/stores/tv';
import { useWatchedStore } from '@/stores/watched';
import { useLikedStore } from '@/stores/liked';
import { useWishlistStore } from '@/stores/wishlist';
import StarRating from '@/components/StarRating.vue';
const tvStore = useTvStore();
const watchedStore = useWatchedStore();
const likedStore = useLikedStore();
const wishlistStore = useWishlistStore();

const loading = ref(true);

const loadTvShow = async () => {
  loading.value = true;
  await tvStore.getTvShowDetail(props.tvShowId);
  loading.value = false;
};

const props = defineProps({
  tvShowId: {
    type: Number,
    required: true,
  },
});



onMounted(loadTvShow);

watch(() => props.tvShowId, loadTvShow);


const trailerKey = computed(() => {
  const videos = tvStore.currentTvShow.videos?.results || [];
  const trailer = videos.find(v => v.type === 'Trailer' && v.site === 'YouTube');
  return trailer?.key || null;
});

const trailerUrl = computed(() => {
  return trailerKey.value ? `https://www.youtube.com/embed/${trailerKey.value}` : null;
});
</script>

<template>

<div v-if="loading" class="loading">
  <div class="loading-spinner"></div>
  <div class="loading-text">Carregando...</div>
</div>

<div v-else class="main" :style="{
    background: tvStore.currentTvShow.backdrop_path
      ? `linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,1.0)), url(https://image.tmdb.org/t/p/w1280${tvStore.currentTvShow.backdrop_path})`
      : 'none',
    backgroundPosition: 'center',
    backgroundSize: 'cover',
    backgroundRepeat: 'no-repeat'
  }">
    <div class="content">
      <div class="details">

        <div class="capatrailer">
          <img v-if="tvStore.currentTvShow.poster_path"
            :src="`https://image.tmdb.org/t/p/w185${tvStore.currentTvShow.poster_path}`"
            :alt="tvStore.currentTvShow.title" />
          <div class="serie-trailer">
            <div v-if="trailerUrl" class="trailer-section">
              <iframe class="trailer" :src="trailerUrl + '?autoplay=0'" title="Trailer" frameborder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowfullscreen></iframe>
            </div>
          </div>
        </div>

        <div class="left">
          <h1>Série: {{ tvStore.currentTvShow.title }}</h1>
          <p>{{ tvStore.currentTvShow.tagline }}</p>
          <p>{{ tvStore.currentTvShow.overview }}</p>
          <p>Avaliação: {{ tvStore.currentTvShow.vote_average }}</p>
        </div>

        <div class="box">
          <div class="buttons">

            <button v-if="!watchedStore.isWatched(tvStore.currentTvShow.id, 'tv')"
              @click="watchedStore.addWatched(tvStore.currentTvShow, 'tv')">
              <span class="fa-solid fa-eye"></span>
            </button>
            <button v-else @click="watchedStore.removeWatched(tvStore.currentTvShow.id, 'tv')">
              <span class="fa-solid fa-eye-slash"></span>
            </button>

            <button v-if="!likedStore.isLiked(tvStore.currentTvShow.id, 'tv')"
              @click="likedStore.addLiked(tvStore.currentTvShow, 'tv')">
              <span class="fa-regular fa-heart"></span>
            </button>
            <button v-else @click="likedStore.removeLiked(tvStore.currentTvShow.id, 'tv')">
              <span class="fa-solid fa-heart" style="color: red;"></span>
            </button>

            <button v-if="!wishlistStore.isInWishlist(tvStore.currentTvShow.id, 'tv')"
              @click="wishlistStore.addToWishlist(tvStore.currentTvShow, 'tv')">
              <span class="fa-regular fa-bookmark"></span>
            </button>
            <button v-else @click="wishlistStore.removeFromWishlist(tvStore.currentTvShow.id, 'tv')">
              <span class="fa-solid fa-bookmark" style="color: #d9b100;"></span>
            </button>
          </div>

          <div class="rating">
            <p>Sua avaliação:</p>
            <StarRating :itemId="tvStore.currentTvShow.id" :itemType="'tv'" :itemData="tvStore.currentTvShow" />
          </div>
        </div>
      </div>
    </div>
  </div>

  <div class="body-details">
    <p>Produtoras</p>
    <div class="companies">
      <template v-for="company in tvStore.currentTvShow.production_companies" :key="company.id">
        <img v-if="company.logo_path" :src="`https://image.tmdb.org/t/p/w92${company.logo_path}`" :alt="company.name" />
        <p v-else>{{ company.name }}</p>
      </template>
    </div>

    <p>Elenco</p>
    <div class="cast">
      <div v-for="actor in tvStore.currentTvShow.credits?.cast?.slice(0, 12)" :key="actor.id" class="cast-member">
        <img v-if="actor.profile_path" :src="`https://image.tmdb.org/t/p/w185${actor.profile_path}`"
          :alt="actor.name" />
        <div v-else class="no-photo">Sem foto</div>
        <p class="actor-name">{{ actor.name }}</p>
        <p class="character-name">{{ actor.character || 'N/A' }}</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.loading {
  width: 100%;
  height: 60vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 15px;
  color: #ffffff;
  font-size: 1.2rem;
  letter-spacing: 1px;
  text-align: center;
  animation: fadeIn 0.4s ease-in-out;
  background-color: #000000;
}

.loading-spinner {
  width: 55px;
  height: 55px;
  border: 5px solid rgba(255, 255, 255, 0.2);
  border-top-color: #910200;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}


.loading-text {
  animation: pulse 1.4s ease-in-out infinite;
  opacity: 0.85;
}


@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

@keyframes pulse {
  0% {
    opacity: 0.45;
  }
  50% {
    opacity: 1;
  }
  100% {
    opacity: 0.45;
  }
}

@keyframes fadeIn {
  from {
    opacity: 0;
    scale: 1.05;
  }
  to {
    opacity: 1;
    scale: 1;
  }
}
.main {
  padding: 5rem;
  min-height: 100vh;
  color: white;
  text-shadow: 2px 2px 4px #000000;
}


.serie-trailer .trailer-section {
  width: 100%;
  max-width: 400px;
}

.capatrailer {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 260px;
}

.capatrailer img {
  max-height: 300px;
  border-radius: 10px;
  box-shadow: 0 0 20px #000000;
  width: 230px;
  height: auto;
  margin-bottom: 40px;
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
  align-items: flex-start;
  margin-left: 2rem;
  gap: 2rem;
  min-height: 300px;
}


.left {
  max-width: 50%;
  margin-left: 2rem;
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
  border-radius: 10px;
  flex: 0 0 260px;
}


.box .buttons {
  display: flex;
  gap: 1.5rem;
  margin-bottom: 1rem;
  align-items: center;
}

.box button {
  background: none;
  border: none;
  color: white;
  cursor: pointer;
  font-size: 1.1rem;
}

.box .buttons span {
  font-size: 1.5rem;
}


.box .rating {
  display: flex;
  flex-direction: column;
}

.box .rating p {
  font-family: junge, sans-serif;
  font-size: 1.2rem;
}

.body-details {
  padding: 2rem 5rem;
  color: white;
  background-color: #000000;
}

.body-details p {
  font-size: 1.5rem;
  font-family: julius sans one, sans-serif;
  margin: 1rem 0;
}

.companies img {
  max-height: 60px;
  object-fit: contain;
  background-color: rgb(255, 255, 255);
  padding: 6px;
  border-radius: 3px;
}

.cast .actor-name {
  margin: 0;
  font-family: junge, sans-serif;
  font-size: 1.2rem;
  display: flex;
  justify-content: center;
}

.cast .character-name {
  margin: 0;
  font-family: junge, sans-serif;
  font-size: 1rem;
  display: flex;
  justify-content: center;
}

.cast {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 3.5rem;
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
