<script setup>
  import { ref, onMounted } from 'vue';
  import api from './plugins/axios';

  const moviesGenres = ref([]);
  const TVGenres = ref([]);

  onMounted(async () => {
    let response = await api.get('genre/movie/list?language=pt-BR');
    moviesGenres.value = response.data.genres;
    response = await api.get('genre/tv/list?language=pt-BR');
    TVGenres.value = response.data.genres;
  });

</script>

<template>
  <header>
    <nav>
      <span><router-link to="/">
        <img src="/public/Group 5.svg" alt="">
      </router-link></span>
      <router-link to="/">Início</router-link>
      <router-link to="/filmes">Filmes</router-link>
      <router-link to="/tv">Séries</router-link>
      <input type="text" name="searchBar" id="bar">
      <router-link to="/assistidos">Assistidos</router-link>
      <router-link to="/curtidos">Curtidos</router-link>
      <router-link to="/lista-desejos">Lista de Desejos</router-link>
    </nav>
  </header>
  <main>
    <router-view />
  </main>
  <footer>
    <p>Darklist ©2025. Todos os direitos reservados.</p>
    <p>Gabriela Senderski</p>
    <p>Henrique Santiago</p>
    <router-link to="/"><img src="/public/Group 5.svg" alt=""></router-link>
  </footer>
</template>

<style scoped>
header {
  height: 4rem;
  display: flex;
  background-color: #770000;
  color: #fff;
  font-size: 1.2rem;
  padding-left: 2rem;
}
nav span {
  padding-top: 10px;
  padding-right: 300px;
  padding-left: 30px;
}

nav input {
  height: 1.8rem;
  width: 20rem;
  border-radius: 2px;
  border: none;
}

nav {
  font-size: 1.5rem;
  column-gap: 4rem;
  margin-bottom: 0;
  display: flex;
  align-items: center;
}

nav a {
  text-decoration: none;
  color: #000000;
  
}
</style>
