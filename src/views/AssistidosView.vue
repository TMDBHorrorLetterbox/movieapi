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
  <section>
    <h1>Assistidos</h1>
    <p v-if="watchedStore.watched.length === 0" style="color: white;">Nenhum filme ou série assistido.</p>
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
            <button @click="handleRemove(item)"><span class="fa-solid fa-trash-can"></span></button>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
section {
  padding: 3rem;
  background-color: rgb(0, 0, 0);
  min-height: 100vh;
}

section h1 {
  margin-bottom: 2rem;
  font-family: julius-sans-one;
  color: #ffff;
  font-size: 2.5rem;
}

.watched-list {
  display: flex;
  flex-direction: column;
}

.watched-card {
  display: flex;
  height: 10rem;
  width: 40rem;
  border-radius: 0.5rem;
  overflow: hidden;
  box-shadow: 0 0 0.5rem #000;
  background: #3d0909;
  color: #fff;
  padding: 0.5rem;
  margin-bottom: 1rem;
  
}


.watched-card img {
  
  width: auto;
  height: auto;
  border-radius: 0.25rem;
}

.watched-details {
  display: flex;
  flex-direction: column;
  align-items: top;
  display: flex;
  margin: 0.5rem 0 0 1rem;
}

.watched-title {
  font-weight: bold;
  font-family: julius sans one, sans-serif;
  font-size: 1.3rem;
}

.watched-actions button {
  font-size: 0.9rem;
  background: none;
  border: none;
  color: #fff;
  margin-right: 2rem;
  padding: 0;
}

.watched-actions button:hover {
  cursor: pointer;
}
</style>
