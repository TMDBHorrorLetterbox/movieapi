<script setup>
import { ref, onMounted } from 'vue';
import api from '@/plugins/axios';
import { useRouter } from 'vue-router';

const popular = ref([]);
const premieres = ref([]);
const topRated = ref([]);
const popularRef = ref(null);
const premieresRef = ref(null);
const topRatedRef = ref(null);
const router = useRouter();

const fetchLists = async () => {
  try {
    const [p, n, t] = await Promise.all([
      api.get('movie/popular', { params: { language: 'pt-BR', page: 1 } }),
      api.get('movie/now_playing', { params: { language: 'pt-BR', page: 1 } }),
      api.get('movie/top_rated', { params: { language: 'pt-BR', page: 1 } }),
    ]);
    popular.value = p.data.results || [];
    premieres.value = n.data.results || [];
    topRated.value = t.data.results || [];
  } catch (err) {
    console.error('Erro ao buscar listas:', err);
  }
};

onMounted(fetchLists);

const openMovie = (id) => router.push({ name: 'MovieDetails', params: { movieId: id } });

const scrollBy = (elRef, dir = 1) => {
  const el = elRef?.value;
  if (!el) return;
  const cardWidth = el.querySelector('.card')?.offsetWidth || 200;
  const gap = 16; // approx gap set in CSS
  const distance = (cardWidth + gap) * 3 * dir; // scroll by 3 cards
  el.scrollBy({ left: distance, behavior: 'smooth' });
};

const handleKeydown = (e, elRef) => {
  if (!elRef?.value) return;
  const key = e.key;
  if (key === 'ArrowLeft' || key === 'PageUp') {
    e.preventDefault();
    scrollBy(elRef, -1);
  } else if (key === 'ArrowRight' || key === 'PageDown') {
    e.preventDefault();
    scrollBy(elRef, 1);
  }
};

// explicit helpers bound from template (safer than inline ref expressions)
const scrollPopular = (dir = 1) => scrollBy(popularRef, dir);
const scrollPremieres = (dir = 1) => scrollBy(premieresRef, dir);
const scrollTopRated = (dir = 1) => scrollBy(topRatedRef, dir);
</script>

<template>
  <section class="inicio">
    <div class="espacer">
      <div class="bemVindo">
        <h1>BEM-VINDO À DARKLIST</h1>
        <h3>Pronto para descobrir o verdadeiro horror?</h3>
      </div>
      <div class="inferior">
        <div class="start">
          <router-link to="/filmes"><button>COMEÇAR</button></router-link>
        </div>
        <div class="slogan">
          <h3>Aqui, os fãs de terror encontram o paraíso! Com um catálogo restrito à horror e crimes, permitimos a
            avaliação e resenha de filmes vistos por você.</h3>
        </div>
      </div>
    </div>
    <hr>
  </section>
  <section class="destaqueCla">
    <div class="cla">
      <h2>Populares</h2>
      <div class="carousel-wrap">
        <button type="button" class="arrow left" aria-label="Rolar para esquerda - Populares"
          @click="scrollPopular(-1)">‹</button>
        <div class="carousel" ref="popularRef" tabindex="0" @keydown="(e) => handleKeydown(e, popularRef)">
          <div v-for="m in popular" :key="m.id" class="card" @click="openMovie(m.id)">
            <img :src="`https://image.tmdb.org/t/p/w300${m.poster_path}`" :alt="m.title" />
            <p class="title">{{ m.title }}</p>
          </div>
        </div>
        <button type="button" class="arrow right" aria-label="Rolar para direita - Populares"
          @click="scrollPopular(1)">›</button>
      </div>
    </div>

    <div class="Estreias">
      <h2>Estreias</h2>
      <div class="carousel-wrap">
        <button type="button" class="arrow left" aria-label="Rolar para esquerda - Estreias"
          @click="scrollPremieres(-1)">‹</button>
        <div class="carousel" ref="premieresRef" tabindex="0" @keydown="(e) => handleKeydown(e, premieresRef)">
          <div v-for="m in premieres" :key="m.id" class="card" @click="openMovie(m.id)">
            <img :src="`https://image.tmdb.org/t/p/w300${m.poster_path}`" :alt="m.title" />
            <p class="title">{{ m.title }}</p>
          </div>
        </div>
        <button type="button" class="arrow right" aria-label="Rolar para direita - Estreias"
          @click="scrollPremieres(1)">›</button>
      </div>
    </div>

    <div class="avaliados">
      <h2>Mais bem avaliados</h2>
      <div class="carousel-wrap">
        <button type="button" class="arrow left" aria-label="Rolar para esquerda - Mais bem avaliados"
          @click="scrollTopRated(-1)">‹</button>
        <div class="carousel" ref="topRatedRef" tabindex="0" @keydown="(e) => handleKeydown(e, topRatedRef)">
          <div v-for="m in topRated" :key="m.id" class="card" @click="openMovie(m.id)">
            <img :src="`https://image.tmdb.org/t/p/w300${m.poster_path}`" :alt="m.title" />
            <p class="title">{{ m.title }}</p>
          </div>
        </div>
        <button type="button" class="arrow right" aria-label="Rolar para direita - Mais bem avaliados"
          @click="scrollTopRated(1)">›</button>
      </div>
    </div>
  </section>
</template>
<style scoped>
body {
  margin: 0;
  padding: 0;
  background: #000;
  color: #fff;
  font-family: "Cinzel", serif;
}

section {
  width: 100%;
}

.inicio {
  width: 100%;
  padding: 180px 40px 80px;
  background:
    linear-gradient(to bottom, rgba(0, 0, 0, 0.2), #000),
    url('/bannerArt.png');

  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
}

.espacer {
  margin: 305px 30px 0 30px;
}

.bemVindo h1 {
  font-size: 4rem;
  letter-spacing: 2px;
  margin-bottom: 2px;
  color: #fff;
  font-family: julius sans one, sans-serif;
}

.bemVindo h3 {
  font-weight: 300;
  font-size: 2rem;
  color: #ccc;
  margin-bottom: 10px;
  font-family: junge, sans-serif;
}

.inferior {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-family: junge, sans-serif;
}

.start {
  max-width: 600px;
}

.start button {
  background: #7a0b0b;
  border: none;
  padding: 17px 40px;
  font-size: 2rem;
  color: white;
  margin-bottom: 0px;
  cursor: pointer;
  border-radius: 4px;
  transition: 0.3s ease;
  font-family: junge, sans-serif;
}

.start button:hover {
  background: #a01111;
}

.slogan h3 {
  font-size: 2rem;
  line-height: 1.8rem;
  font-weight: 300;
  color: #ddd;
  text-align: right;
  padding-left: 750px;
  padding-right: 30px;
  letter-spacing: 2px;
}

.inicio hr {
  margin-top: 30px;
  border: none;
  height: 1px;
  background: #333;
}

.destaqueCla {
  background-color: black;
  padding: 40px;
}

.destaqueCla h2 {
  font-size: 2rem;
  margin: 40px 0 20px;
  font-weight: 600;
  letter-spacing: 1px;
  color: #fff;
  font-family: julius sans one, sans-serif;
}

.carousel {
  display: flex;
  gap: 1rem;
  overflow-x: auto;
  padding: 1rem 0;
}

.card {
  flex: 0 0 auto;
  width: 180px;
  cursor: pointer;
}

.card img {
  width: 100%;
  border-radius: 8px;
  display: block;
}

.card .title {
  font-size: 1rem;
  margin-top: 0.4rem;
  color: #ddd;
}

/* hide scrollbar */
.carousel::-webkit-scrollbar {
  height: 0px;
}

.carousel::-webkit-scrollbar-thumb {
  background: #333;
  border-radius: 4px;
}

.carousel-wrap {
  position: relative;
  display: flex;
  align-items: center;
  padding: 0 40px;
}

.arrow {
  position: absolute;
  background: rgba(133, 0, 0, 0.6);
  border: none;
  color: #fff;
  width: 36px;
  height: 48px;
  font-size: 28px;
  cursor: pointer;
  z-index: 40;
  pointer-events: auto;
}

.arrow.left {
  left: 8px;
}

.arrow.right {
  right: 8px;
}

.arrow:focus {
  outline: 2px solid #666;
}
</style>
