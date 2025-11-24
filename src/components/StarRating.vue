<script setup>
import { defineProps } from 'vue';
import { useRatingsStore } from '@/stores/ratings';

const props = defineProps({
  itemId: {
    type: Number,
    required: true,
  },
  itemType: {
    type: String,
    default: 'movie',
  },
  itemData: {
    type: Object,
    default: () => ({}),
  },
});

const ratingsStore = useRatingsStore();

const currentRating = () => ratingsStore.getRating(props.itemId, props.itemType);

const handleStarClick = (starValue) => {
  ratingsStore.setRating(props.itemId, starValue, props.itemType, props.itemData);
};

const isStar = (starIndex) => starIndex <= currentRating();
</script>

<template>
  <div class="rating-container">
    <span v-for="starIndex in 5" :key="starIndex" class="star" @click="handleStarClick(starIndex)" :class="{ filled: isStar(starIndex) }">
      ★
    </span>
    <span class="rating-text">{{ currentRating() }}/5</span>
  </div>
</template>

<style scoped>
.rating-container {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin: 0.5rem 0;
}

.star {
  font-size: 1.5rem;
  cursor: pointer;
  color: #888;
  transition: color 0.2s;
}

.star:hover,
.star.filled {
  color: #ffc107;
}

.rating-text {
  font-size: 0.9rem;
  color: #fff;
  margin-left: 0.5rem;
}
</style>
