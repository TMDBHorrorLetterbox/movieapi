import { reactive, computed } from 'vue';
import { defineStore } from 'pinia';

const STORAGE_KEY = 'movieapi.ratings';

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

export const useRatingsStore = defineStore('ratings', () => {
  const state = reactive({
    items: loadFromStorage(),
  });

  const ratings = computed(() => state.items);

  const getRating = (id, type = 'movie') => {
    const item = state.items.find((m) => m.id === id && m.type === type);
    return item ? item.rating : 0;
  };

  const setRating = (id, rating, type = 'movie', itemData = {}) => {
    if (!id || rating < 0 || rating > 5) return;
    
    const existingIndex = state.items.findIndex((m) => m.id === id && m.type === type);
    
    if (existingIndex >= 0) {
      state.items[existingIndex].rating = rating;
      state.items[existingIndex].ratedAt = new Date().toISOString();
    } else {
      const toStore = {
        id,
        type,
        rating,
        title: itemData.title || itemData.name || '',
        ratedAt: new Date().toISOString(),
      };
      state.items.push(toStore);
    }
    
    saveToStorage(state.items);
  };

  const removeRating = (id, type = 'movie') => {
    state.items = state.items.filter((m) => !(m.id === id && m.type === type));
    saveToStorage(state.items);
  };

  return { ratings, getRating, setRating, removeRating };
});
