<script setup>
  import { ref, onMounted, onUnmounted } from 'vue';
  import { useRouter } from 'vue-router';
  import api from './plugins/axios';

  const moviesGenres = ref([]);
  const TVGenres = ref([]);

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


const showNav = ref(true);
let lastScroll = 0;

const handleScroll = () => {
  const currentScroll = window.scrollY;

  if (currentScroll < lastScroll) {
    showNav.value = true;
  } else {
    showNav.value = false;
  }

  lastScroll = currentScroll;
};

onMounted(() => {
  window.addEventListener('scroll', handleScroll);
});

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll);
});

</script>

<template>
  <header>
    <nav :class="{ visible: showNav }" class="navbar">
      <div class="nav-left">
        <router-link to="/">
          <img src="/public/Group 5.svg" alt="">
        </router-link>
        <router-link to="/">Home</router-link>
        <router-link to="/filmes">Filmes</router-link>
        <router-link to="/tv">Séries</router-link>
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
            <small class="muted">{{ s.type === 'movie' ? 'Filme' : 'Série' }}</small>
          </div>
        </div>
      </div>

      <div class="nav-right">
        <router-link to="/assistidos"><span class="fa-solid fa-eye"></span></router-link>
        <router-link to="/curtidos"><span class="fa-solid fa-heart"></span></router-link>
        <router-link to="/lista-desejos"><span class="fa-solid fa-bookmark"></span></router-link>
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
.router-link-exact-active {
  color: #ffdbdb;
}
.navbar {
 position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 63px;
  display: flex;
  align-items: center;
  padding: 0 20px;
  background: rgba(255, 25, 25, 0.5);
  backdrop-filter: blur(5px);
  transition: transform 0.3s ease;
}


header {
  height: 4rem;
  display: flex;
  background-color: #110000;
  color: #fff;
  font-size: 1.2rem;
  padding-left: 3rem;
}
nav span {
  padding-top: 01px;
  padding-right: 20px;
  padding-left: 10px;
  font-size: 1rem;
  text-align: justify;
}

nav input {
  height: 2.2rem;
  width: 24rem;
  border-radius: 2px;
  border: none;
}

nav {
  font-family: julius sans one, sans-serif;
  font-weight: bold;
  font-size: 1.4rem;
  column-gap: 2rem;
  margin-bottom: 0;
  display: flex;
  align-items: center;
}

nav a {
  text-decoration: none;
  color: #000000;

}

nav img {
  height: 2.3rem;
  margin-top: 0.7rem;
}

.nav-left {
  display:flex;
  align-items:center;
  gap:4rem;
}
.nav-search {
  position:relative;
  margin-left:5rem;
}
.nav-search input {
  padding:0.3rem 0.5rem;
  border-radius:4px;
  border:1px solid #000000;
  background:#ffffff;
  color:#000000;
}

.navbar:not(.visible) {
  transform: translateY(-100%);
}

.navbar.visible {
  transform: translateY(0);
}
.search-suggestions {
  position:absolute;
  top:2.6rem;
  left:0;
  background:#770000;
  border:1px solid #222;
  width:24rem;
  max-height:18rem;
  overflow:auto;
  z-index:40;
  padding:0.5rem;
  border-radius:4px;
}
.suggestion {
  display:flex;
  gap:0.5rem;
  align-items:center;
  padding:0.35rem;
  cursor:pointer;
}
.suggestion img {
  width:40px;
  height:auto;
  border-radius:4px;
}
.suggestion:hover {
  background:rgba(255,255,255,0.03);
}
.muted {
  color:#aaa;
  margin-left:auto;
  font-size:0.75rem;
  margin-right: 10px;
}
.nav-right {
  margin-left: auto;
  display: flex;
  gap: 1rem;
  align-items: center;
}

.nav-right a, .nav-right span {
  color: #fff;
}

.nav-right span {
  font-size: 1.4rem;
  cursor: pointer;
}

footer {
  height: 10rem;
  background-color: #770000;
  color: #000000;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.3rem;
}
</style>
