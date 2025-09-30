<script setup>
  import { ref, onMounted } from 'vue';
  import api from '@/plugins/axios';

  const genres = ref([]);

  onMounted(async () => {
    const response = await api.get('genre/tv/list?language=pt-BR');
    genres.value = response.data.genres;
  });
</script>

<template>
  <div>
    <h1>Gêneros de programas de TV</h1>
    <ul>
      <li v-for="genre in genres" :key="genre.id">{{ genre.name }}</li>
    </ul>
  </div>
</template>