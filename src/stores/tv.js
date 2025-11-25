import { reactive, computed } from 'vue';
import { defineStore } from 'pinia';
import api from '@/plugins/axios';

export const useTvStore = defineStore('tv', () => {
  const state = reactive({
    currentTvShow: {},
  });

  const currentTvShow = computed(() => state.currentTvShow);

  const getTvShowDetail = async (tvShowId) => {
    const response = await api.get(`tv/${tvShowId}`, { params: { append_to_response: 'credits,videos' } });
    state.currentTvShow = response.data;
  };

  return { currentTvShow, getTvShowDetail };
});
