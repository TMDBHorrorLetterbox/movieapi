<script setup>
import { onMounted } from 'vue';
import { useWishlistStore } from '@/stores/wishlist';
import { useRouter } from 'vue-router';

const wishlistStore = useWishlistStore();
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
  wishlistStore.removeFromWishlist(item.id, item.type);
};

onMounted(() => {
  // nothing special for now; wishlistStore reads from localStorage
});
</script>

<template>
  <div>
    <h1>Lista de Desejos</h1>
    <p v-if="wishlistStore.wishlist.length === 0">Nenhum filme ou série adicionado à lista de desejos.</p>
    <div class="wishlist-list">
      <div v-for="item in wishlistStore.wishlist" :key="`${item.id}-${item.type}`" class="wishlist-card">
        <img
          v-if="item.poster_path"
          :src="`https://image.tmdb.org/t/p/w185${item.poster_path}`"
          :alt="item.title"
          @click="openItem(item)"
        />
        <div class="wishlist-details">
          <p class="wishlist-title">{{ item.title }}</p>
          <p class="wishlist-date">Adicionado em: {{ new Date(item.addedAt).toLocaleString() }}</p>
          <div class="wishlist-actions">
            <button @click="openItem(item)">Ver detalhes</button>
            <button @click="handleRemove(item)">Remover</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.wishlist-list {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
}
.wishlist-card {
  width: 15rem;
  border-radius: 0.5rem;
  overflow: hidden;
  box-shadow: 0 0 0.5rem #000;
  background: #111;
  color: #fff;
  padding: 0.5rem;
}
.wishlist-card img {
  width: 100%;
  height: auto;
  border-radius: 0.25rem;
}
.wishlist-details {
  margin-top: 0.5rem;
}
.wishlist-title {
  font-weight: bold;
}
.wishlist-actions button {
  margin-right: 0.5rem;
}
</style>
