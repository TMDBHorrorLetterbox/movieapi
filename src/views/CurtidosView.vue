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
  <div>
    <h1>Curtidos</h1>
    <p v-if="likedStore.liked.length === 0">Nenhum filme ou série curtido.</p>
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
            <button @click="handleRemove(item)">Remover</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.liked-list {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
}
.liked-card {
  width: 15rem;
  border-radius: 0.5rem;
  overflow: hidden;
  box-shadow: 0 0 0.5rem #000;
  background: #111;
  color: #fff;
  padding: 0.5rem;
}
.liked-card img {
  width: 100%;
  height: auto;
  border-radius: 0.25rem;
}
.liked-details {
  margin-top: 0.5rem;
}
.liked-title {
  font-weight: bold;
}
.liked-actions button {
  margin-right: 0.5rem;
}
</style>
