<script setup>
  import { defineProps, onMounted, watch, computed } from 'vue';
  import { useTvStore } from '@/stores/tv';
  import { useWatchedStore } from '@/stores/watched';
  import { useLikedStore } from '@/stores/liked';
  import { useWishlistStore } from '@/stores/wishlist';
  import StarRating from '@/components/StarRating.vue';
  const tvStore = useTvStore();
  const watchedStore = useWatchedStore();
  const likedStore = useLikedStore();
  const wishlistStore = useWishlistStore();

  const props = defineProps({
    tvShowId: {
      type: Number,
      required: true,
    },
  });

  const loadTvShow = async () => {
    await tvStore.getTvShowDetail(props.tvShowId);
  };

  onMounted(loadTvShow);

  watch(() => props.tvShowId, loadTvShow);

  // Extrai o primeiro trailer (YouTube) ou null
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
  <div class="main">
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

      <img
        :src="`https://image.tmdb.org/t/p/w185${tvStore.currentTvShow.poster_path}`"
        :alt="tvStore.currentTvShow.title"
      />

      <div class="details">
        <h1>Série: {{ tvStore.currentTvShow.title }}</h1>
        <button
          v-if="!watchedStore.isWatched(tvStore.currentTvShow.id, 'tv')"
          @click="watchedStore.addWatched(tvStore.currentTvShow, 'tv')"
        >
          Marcar como assistido
        </button>
        <button
          v-else
          @click="watchedStore.removeWatched(tvStore.currentTvShow.id, 'tv')"
        >
          Remover dos assistidos
        </button>
        <button
          v-if="!likedStore.isLiked(tvStore.currentTvShow.id, 'tv')"
          @click="likedStore.addLiked(tvStore.currentTvShow, 'tv')"
        >
          Curtir
        </button>
        <button
          v-else
          @click="likedStore.removeLiked(tvStore.currentTvShow.id, 'tv')"
        >
          Descurtir
        </button>
        <button
          v-if="!wishlistStore.isInWishlist(tvStore.currentTvShow.id, 'tv')"
          @click="wishlistStore.addToWishlist(tvStore.currentTvShow, 'tv')"
        >
          Adicionar à lista de desejos
        </button>
        <button
          v-else
          @click="wishlistStore.removeFromWishlist(tvStore.currentTvShow.id, 'tv')"
        >
          Remover da lista de desejos
        </button>
        <div>
          <p>Sua avaliação:</p>
          <StarRating
            :itemId="tvStore.currentTvShow.id"
            :itemType="'tv'"
            :itemData="tvStore.currentTvShow"
          />
        </div>
        <p>{{ tvStore.currentTvShow.tagline }}</p>
        <p>{{ tvStore.currentTvShow.overview }}</p>
        <p>Orçamento: ${{ tvStore.currentTvShow.budget }}</p>
        <p>Avaliação: {{ tvStore.currentTvShow.vote_average }}</p>
      </div>
    </div>
  </div>

  <p>Produtoras</p>
  <div class="companies">
    <template
      v-for="company in tvStore.currentTvShow.production_companies"
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
    <div v-for="actor in tvStore.currentTvShow.credits?.cast?.slice(0, 12)" :key="actor.id" class="cast-member">
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
