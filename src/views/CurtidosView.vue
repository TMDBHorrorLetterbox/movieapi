<script setup>
import { onMounted } from 'vue';
import { useLikedStore } from '@/stores/liked';
import { useRouter } from 'vue-router';

const likedStore = useLikedStore();
const router = useRouter();

const openItem = (item) => {
  if (item.type === 'tv') {
    router.push({ name: 'TvShowDetails', params: { tvShowId: item.id } });
  } else {
    router.push({ name: 'MovieDetails', params: { movieId: item.id } });
  }
};

const handleRemove = (item) => {
  console.log('handleRemove called with:', item);
  likedStore.removeLiked(item.id, item.type);
};

onMounted(() => {
  // nothing special for now; likedStore reads from localStorage
});
</script>

<template>
  <section>
    <h1>Curtidos</h1>
    <p v-if="likedStore.liked.length === 0" style="color: white;">Nenhum filme ou série curtido.</p>
    <div class="liked-list">
      <div v-for="item in likedStore.liked" :key="`${item.id}-${item.type}`" class="liked-card">
        <img
          v-if="item.poster_path"
          :src="`https://image.tmdb.org/t/p/w185${item.poster_path}`"
          :alt="item.title"
          @click="openItem(item)"
        />
        <div class="liked-details">
          <p class="liked-title">{{ item.title }}</p>
          <p class="liked-date">Curtido em: {{ new Date(item.likedAt).toLocaleString() }}</p>
          <div class="liked-actions">
            <button @click="openItem(item)">Ver detalhes</button>
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

.liked-list {
  display: flex;
  flex-direction: column;
}

.liked-card {
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


.liked-card img {
  
  width: auto;
  height: auto;
  border-radius: 0.25rem;
}

.liked-details {
  display: flex;
  flex-direction: column;
  align-items: top;
  display: flex;
  margin: 0.5rem 0 0 1rem;
}

.liked-title {
  font-weight: bold;
  font-family: julius sans one, sans-serif;
  font-size: 1.3rem;
}

.liked-actions button {
  font-size: 0.9rem;
  background: none;
  border: none;
  color: #fff;
  margin-right: 2rem;
  padding: 0;
}

.liked-actions button:hover {
  cursor: pointer;
}
</style>
