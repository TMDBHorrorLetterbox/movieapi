<script setup>
  import { ref, onMounted } from 'vue';
  import { useRouter } from 'vue-router';
  import api from './plugins/axios';

  const moviesGenres = ref([]);
  const TVGenres = ref([]);

  // gêneros forçados conforme especificado pelo usuário
  const forcedMovieGenres = [27, 53];
  const forcedTvGenres = [18, 9648];

  const searchTerm = ref('');
  const suggestions = ref([]);
  const isSearching = ref(false);
  let debounceTimer = null;
  const router = useRouter();

  onMounted(async () => {
    let response = await api.get('genre/movie/list?language=pt-BR');
    moviesGenres.value = response.data.genres;
    response = await api.get('genre/tv/list?language=pt-BR');
    TVGenres.value = response.data.genres;
  });

  const doSuggest = async (term) => {
    if (!term || term.length < 2) {
      suggestions.value = [];
      return;
    }
    isSearching.value = true;
    try {
      const [mRes, tRes] = await Promise.all([
        api.get('search/movie', { params: { query: term, language: 'pt-BR' } }),
        api.get('search/tv', { params: { query: term, language: 'pt-BR' } }),
      ]);

      const movies = (mRes.data.results || []).filter(r => {
        const gids = r.genre_ids || [];
        return forcedMovieGenres.some(g => gids.includes(g));
      }).map(r => ({ id: r.id, type: 'movie', title: r.title, poster_path: r.poster_path }));

      const tvs = (tRes.data.results || []).filter(r => {
        const gids = r.genre_ids || [];
        return forcedTvGenres.some(g => gids.includes(g));
      }).map(r => ({ id: r.id, type: 'tv', title: r.name, poster_path: r.poster_path }));

      // combinar e limitar
      suggestions.value = [...movies.slice(0,6), ...tvs.slice(0,6)].slice(0,8);
    } catch (err) {
      console.error('Erro na busca de sugestões', err);
      suggestions.value = [];
    } finally {
      isSearching.value = false;
    }
  };

  const onInput = () => {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => doSuggest(searchTerm.value.trim()), 300);
  };

  const clearSuggestions = () => { suggestions.value = []; };

  const openSuggestion = (item) => {
    clearSuggestions();
    if (item.type === 'movie') router.push({ name: 'MovieDetails', params: { movieId: item.id } });
    else router.push({ name: 'TvShowDetails', params: { tvShowId: item.id } });
  };
</script>

<template>
  <header>
    <nav>
      <div class="nav-left">
        <router-link to="/">
          <img src="/public/Group 5.svg" alt="">
        </router-link>
        <router-link to="/">Home</router-link>
        <router-link to="/filmes">Filmes</router-link>
        <router-link to="/tv">Programas de TV</router-link>
      </div>

      <div class="nav-search">
        <input
          v-model="searchTerm"
          @input="onInput"
          @focus="onInput"
          type="search"
          placeholder="Pesquisar filmes/TV..."
        />
        <div class="search-suggestions" v-if="suggestions.length">
          <div v-for="s in suggestions" :key="s.type + '-' + s.id" class="suggestion" @mousedown.prevent="openSuggestion(s)">
            <img v-if="s.poster_path" :src="`https://image.tmdb.org/t/p/w92${s.poster_path}`" alt="" />
            <span>{{ s.title }}</span>
            <small class="muted">{{ s.type === 'movie' ? 'Filme' : 'TV' }}</small>
          </div>
        </div>
      </div>

      <div class="nav-right">
        <router-link to="/assistidos">Assistidos</router-link>
        <router-link to="/curtidos">Curtidos</router-link>
        <router-link to="/lista-desejos">Lista de Desejos</router-link>
      </div>
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
  height: 3rem;
  display: flex;
  background-color: black;
  color: #fff;
  font-size: 1.2rem;
  padding-left: 2rem;
}

nav {
  column-gap: 2rem;
  margin-bottom: 0;
  display: flex;
  align-items: center;
}

nav a {
  text-decoration: none;
  color: #fff;
}

.nav-left { display:flex; align-items:center; gap:1rem; }
.nav-search { position:relative; margin-left:1rem; }
.nav-search input { padding:0.3rem 0.5rem; border-radius:4px; border:1px solid #333; background:#111; color:#fff; }
.search-suggestions { position:absolute; top:2.6rem; left:0; background:#0b0b0b; border:1px solid #222; width:24rem; max-height:18rem; overflow:auto; z-index:40; padding:0.5rem; border-radius:4px; }
.suggestion { display:flex; gap:0.5rem; align-items:center; padding:0.35rem; cursor:pointer; }
.suggestion img { width:40px; height:auto; border-radius:4px; }
.suggestion:hover { background:rgba(255,255,255,0.03); }
.muted { color:#aaa; margin-left:auto; font-size:0.75rem; }
.nav-right { margin-left: auto; display:flex; gap:1rem; align-items:center; }
</style>
