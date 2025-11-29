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
  <section>
    <h1>Lista de Desejos</h1>
    <p v-if="wishlistStore.wishlist.length === 0" style="color: white;">Nenhum filme ou série adicionado à lista de
      desejos.</p>
    <div class="wishlist-list">
      <div v-for="item in wishlistStore.wishlist" :key="`${item.id}-${item.type}`" class="wishlist-card">
        <img v-if="item.poster_path" :src="`https://image.tmdb.org/t/p/w185${item.poster_path}`" :alt="item.title"
          @click="openItem(item)" />
        <div class="wishlist-details">
            <p class="wishlist-title">{{ item.title }}</p>
            <p class="wishlist-date">Salvo em: {{ new Date(item.addedAt).toLocaleDateString() }}</p>
            <div class="wishlist-actions">
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

.wishlist-list {
  display: flex;
  flex-direction: column;
}

.wishlist-card {
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

.wishlist-card img {
  
  width: auto;
  height: auto;
  border-radius: 0.25rem;
}

.wishlist-details {
  display: flex;
  flex-direction: column;
  align-items: top;
  display: flex;
  margin: 0.5rem 0 0 1rem;
}

.wishlist-title {
  font-weight: bold;
  font-family: julius sans one, sans-serif;
  font-size: 1.3rem;
}


.wishlist-actions button {
  font-size: 0.9rem;
  background: none;
  border: none;
  color: #fff;
  margin-right: 2rem;
  padding: 0;
}

.wishlist-actions button:hover {
  cursor: pointer;
}
</style>
