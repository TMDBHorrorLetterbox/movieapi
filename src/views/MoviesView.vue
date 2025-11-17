<script setup>
import { ref, onMounted, onUnmounted, nextTick } from 'vue';
import api from '@/plugins/axios';
import Loading from 'vue-loading-overlay';
import { useGenreStore } from '@/stores/genre';
import { useRouter } from 'vue-router'
const router = useRouter()

function openMovie(movieId) {
  router.push({ name: 'MovieDetails', params: { movieId } });
}

const genreStore = useGenreStore();

const formatDate = (date) => new Date(date).toLocaleDateString('pt-BR');
const isLoading = ref(false);

const movies = ref([]);
const currentPage = ref(1);
const totalPages = ref(null);

// rate limiting controls
const requestTimestamps = ref([]); // ms timestamps of recent requests
const maxRequestsPerMinute = 30; // configurable: max requests allowed in 60s window
const minIntervalMs = 500; // configurable: minimum ms between requests
const rateLimited = ref(false);

// infinite scroll observer
const observer = ref(null);
const sentinel = ref(null);
const resumeTimeout = ref(null);

const pruneOldTimestamps = () => {
  const cutoff = Date.now() - 60_000;
  requestTimestamps.value = requestTimestamps.value.filter(t => t > cutoff);
};

const canMakeRequest = () => {
  pruneOldTimestamps();
  const now = Date.now();
  if (requestTimestamps.value.length >= maxRequestsPerMinute) return false;
  const last = requestTimestamps.value[requestTimestamps.value.length - 1] || 0;
  if (now - last < minIntervalMs) return false;
  requestTimestamps.value.push(now);
  return true;
};

const scheduleResume = () => {
  if (resumeTimeout.value) clearTimeout(resumeTimeout.value);
  resumeTimeout.value = setTimeout(() => {
    rateLimited.value = false;
    resumeTimeout.value = null;
  }, 60_000); // reset after 60 seconds
};

const listMovies = async (genreId, page = 1) => {
  genreStore.setCurrentGenreId(genreId);
  isLoading.value = true;
  // rate-limit check
  if (!canMakeRequest()) {
    rateLimited.value = true;
    isLoading.value = false;
    scheduleResume(); // schedule auto-resume after 60s
    return;
  }

  const response = await api.get('discover/movie', {
    params: {
      with_genres: '27,53',
      language: 'pt-BR',
      page,
    },
  });
  // handle append for pages > 1
  if (page > 1) {
    movies.value.push(...response.data.results);
  } else {
    movies.value = response.data.results;
  }
  currentPage.value = response.data.page || page;
  totalPages.value = response.data.total_pages || null;
  isLoading.value = false;
};

const loadMoreMovies = async () => {
  if (isLoading.value) return;
  if (rateLimited.value) return;
  if (totalPages.value && currentPage.value >= totalPages.value) {
    if (observer.value) observer.value.disconnect();
    return;
  }
  const next = currentPage.value + 1;
  await listMovies(genreStore.currentGenreId || (genreStore.genres[0] && genreStore.genres[0].id), next);
};

onMounted(async () => {
  // initial load
  isLoading.value = true;
  await genreStore.getAllGenres('movie');
  if (genreStore.genres && genreStore.genres.length > 0) {
    await listMovies(genreStore.genres[0].id);
  }
  isLoading.value = false;

  // intersection observer for infinite scroll
  observer.value = new IntersectionObserver((entries) => {
    const e = entries[0];
    if (!e) return;
    if (rateLimited.value) {
      if (observer.value) observer.value.disconnect();
      return;
    }
    if (e.isIntersecting && !isLoading.value) {
      loadMoreMovies();
    }
    if (totalPages.value && currentPage.value >= totalPages.value && observer.value) {
      observer.value.disconnect();
    }
  }, { root: null, rootMargin: '300px' });

  nextTick(() => {
    if (sentinel.value) observer.value.observe(sentinel.value);
  });
});

onUnmounted(() => {
  if (observer.value) observer.value.disconnect();
  if (resumeTimeout.value) clearTimeout(resumeTimeout.value);
});
</script>

<template>
  <div>
    <h1>Filmes</h1>
  <loading v-model:active="isLoading" is-full-page />
  <div class="movie-list">
  <div v-for="movie in movies" :key="movie.id" class="movie-card">
    <img
  :src="`https://image.tmdb.org/t/p/w500${movie.poster_path}`"
  :alt="movie.title"
  @click="openMovie(movie.id)"
/>
    <div class="movie-details">
      <p class="movie-title">{{ movie.title }}</p>
      <p class="movie-release-date">{{ formatDate(movie.release_date) }}</p>
      <p class="movie-genres">
            <span
  v-for="genre_id in movie.genre_ids"
  :key="genre_id"
  :class="{ active: genre_id === genreStore.currentGenreId }"
>
  {{ genreStore.getGenreName(genre_id) }}
</span>
</p>
    </div>
  </div>
</div>
  <div style="text-align:center; margin-top:1rem">
    <div v-if="rateLimited" class="rate-limited">Limite de requisições atingido — aguarde alguns segundos</div>
    <div ref="sentinel" style="height:1px"></div>
  </div>
  </div>
</template>
<style scoped>

.genre-list {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 2rem;
  list-style: none;
  margin-bottom: 2rem;
}

.genre-item {
  background-color: #387250;
  border-radius: 1rem;
  padding: 0.5rem 1rem;
  color: #fff;
}

.genre-item:hover {
  cursor: pointer;
  background-color: #4e9e5f;
  box-shadow: 0 0 0.5rem #387250;
}
.movie-list {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
}

.movie-card {
  width: 15rem;
  height: 30rem;
  border-radius: 0.5rem;
  overflow: hidden;
  box-shadow: 0 0 0.5rem #000;
}

.movie-card img {
  width: 100%;
  height: 20rem;
  border-radius: 0.5rem;
  box-shadow: 0 0 0.5rem #000;
}

.movie-details {
  padding: 0 0.5rem;
}

.movie-title {
  font-size: 1.1rem;
  font-weight: bold;
  line-height: 1.3rem;
  height: 3.2rem;
}
.movie-genres {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  align-items: flex-start;
  justify-content: center;
  gap: 0.2rem;
}

.movie-genres span {
  background-color: #748708;
  border-radius: 0.5rem;
  padding: 0.2rem 0.5rem;
  color: #fff;
  font-size: 0.8rem;
  font-weight: bold;
}

.movie-genres span:hover {
  cursor: pointer;
  background-color: #455a08;
  box-shadow: 0 0 0.5rem #748708;
}

.active {
  background-color: #67b086;
  font-weight: bolder;
}

.movie-genres span.active {
  background-color: #abc322;
  color: #000;
  font-weight: bolder;
}
</style>
