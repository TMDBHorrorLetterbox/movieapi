import { reactive, computed } from 'vue';
import { defineStore } from 'pinia';

const STORAGE_KEY = 'movieapi.liked';

const loadFromStorage = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

const saveToStorage = (list) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
  } catch {
    // ignore
  }
};

export const useLikedStore = defineStore('liked', () => {
  const state = reactive({
    items: loadFromStorage(),
  });

  const liked = computed(() => state.items);

  const isLiked = (id, type = 'movie') =>
    state.items.some((m) => m.id === id && m.type === type);

  const addLiked = (item, type = 'movie') => {
    if (!item || !item.id) return;
    if (!isLiked(item.id, type)) {
      const toStore = {
        id: item.id,
        type,
        title: item.title || item.name || '',
        poster_path: item.poster_path || item.backdrop_path || null,
        likedAt: new Date().toISOString(),
      };
      state.items.unshift(toStore);
      saveToStorage(state.items);
    }
  };

  const removeLiked = (id, type = 'movie') => {
    console.log(`Removing liked: id=${id}, type=${type}`);
    console.log('Before removal:', state.items);
    state.items = state.items.filter((m) => !(m.id === id && m.type === type));
    console.log('After removal:', state.items);
    saveToStorage(state.items);
  };

  const clearAll = () => {
    state.items = [];
    saveToStorage(state.items);
  };

  return { liked, isLiked, addLiked, removeLiked, clearAll };
});
