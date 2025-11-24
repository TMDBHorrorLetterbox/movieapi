<script setup>
import { onMounted } from 'vue';
import { useWatchedStore } from '@/stores/watched';
import { useRouter } from 'vue-router';

const watchedStore = useWatchedStore();
const router = useRouter();

const openMovie = (item) => {
  if (item.type === 'tv') {
    router.push({ name: 'TvShowDetails', params: { tvShowId: item.id } });
  } else {
    router.push({ name: 'MovieDetails', params: { movieId: item.id } });
  }
};

const handleRemove = (item) => {
  console.log('handleRemove called with:', item);
  watchedStore.removeWatched(item.id, item.type);
};

onMounted(() => {
  // nothing special for now; watchedStore reads from localStorage
});
</script>

<template>
  <div>
    <h1>Assistidos</h1>
    <p v-if="watchedStore.watched.length === 0">Nenhum filme marcado como assistido.</p>
    <div class="watched-list">
      <div v-for="item in watchedStore.watched" :key="`${item.id}-${item.type}`" class="watched-card">
        <img
          v-if="item.poster_path"
          :src="`https://image.tmdb.org/t/p/w185${item.poster_path}`"
          :alt="item.title"
          @click="openMovie(item)"
        />
        <div class="watched-details">
          <p class="watched-title">{{ item.title }}</p>
          <p class="watched-date">Assistido em: {{ new Date(item.watchedAt).toLocaleString() }}</p>
          <div class="watched-actions">
            <button @click="openMovie(item)">Ver detalhes</button>
            <button @click="handleRemove(item)">Remover</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.watched-list {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
}
.watched-card {
  width: 15rem;
  border-radius: 0.5rem;
  overflow: hidden;
  box-shadow: 0 0 0.5rem #000;
  background: #111;
  color: #fff;
  padding: 0.5rem;
}
.watched-card img {
  width: 100%;
  height: auto;
  border-radius: 0.25rem;
}
.watched-details {
  margin-top: 0.5rem;
}
.watched-title {
  font-weight: bold;
}
.watched-actions button {
  margin-right: 0.5rem;
}
</style>
