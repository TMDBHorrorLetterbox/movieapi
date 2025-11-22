import { createRouter, createWebHistory } from 'vue-router';

const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import('../views/HomeView.vue'),
  },
  {
    path: '/filmes',
    name: 'Movies',
    component: () => import('../views/MoviesView.vue'),
  },
  {
    path: '/tv',
    name: 'TV',
    component: () => import('../views/TvView.vue'),
  },
  {
    path: '/assistidos',
    name: 'Assistidos',
    component: () => import('../views/AssistidosView.vue'),
  },
  {
    path: '/curtidos',
    name: 'Curtidos',
    component: () => import('../views/CurtidosView.vue'),
  },
  {
    path: '/lista-desejos',
    name: 'ListaDeDesejos',
    component: () => import('../views/ListaDeDesejosView.vue'),
  },
  {
  path: '/movie/:movieId',
  name: 'MovieDetails',
  component: () => import('../views/MovieDetailsView.vue'),
  props: true,
},
  {
  path: '/tv/:tvShowId',
  name: 'TvShowDetails',
  component: () => import('../views/TvDetailsView.vue'),
  props: true,
},
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;