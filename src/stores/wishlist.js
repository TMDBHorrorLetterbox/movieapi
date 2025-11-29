import { reactive, computed } from 'vue';
import { defineStore } from 'pinia';

const STORAGE_KEY = 'movieapi.wishlist';

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

export const useWishlistStore = defineStore('wishlist', () => {
  const state = reactive({
    items: loadFromStorage(),
  });

  const wishlist = computed(() => state.items);

  const isInWishlist = (id, type = 'movie') =>
    state.items.some((m) => m.id === id && m.type === type);

  const addToWishlist = (item, type = 'movie') => {
    if (!item || !item.id) return;
    if (!isInWishlist(item.id, type)) {
      const toStore = {
        id: item.id,
        type,
        title: item.title || item.name || '',
        poster_path: item.poster_path || item.backdrop_path || null,
        addedAt: new Date().toISOString(),
      };
      state.items.unshift(toStore);
      saveToStorage(state.items);
    }
  };

  const removeFromWishlist = (id, type = 'movie') => {
    console.log(`Removing from wishlist: id=${id}, type=${type}`);
    console.log('Before removal:', state.items);
    state.items = state.items.filter((m) => !(m.id === id && m.type === type));
    console.log('After removal:', state.items);
    saveToStorage(state.items);
  };

  const clearAll = () => {
    state.items = [];
    saveToStorage(state.items);
  };

  return { wishlist, isInWishlist, addToWishlist, removeFromWishlist, clearAll };
});
