<template>
  <div class="dots">
    <button
      v-for="i in total"
      :key="i"
      :class="['dot', (i-1) === currentIndex ? 'is-active' : '']"
      @click="$emit('go', i-1)"
      :aria-label="`Go to photo ${i}`"
    />
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  total: number
  currentIndex: number
}>()
const emit = defineEmits<{ (e: 'go', idx: number): void }>()
</script>

<style scoped lang="scss">
.dots {
  display: flex;
  gap: 6px;
  align-items: center;
  justify-content: center;
  padding: 6px 0 2px 0;
}
.dot {
  width: 8px; height: 8px; border-radius: 999px;
  background: #c7d0d9; border: 0; padding: 0; cursor: pointer;
}
.dot.is-active { width: 24px; background: #2a3b47; }
@media (min-width: 768px) {
  .dot { width: 10px; height: 10px; }
  .dot.is-active { width: 28px; }
}
</style>
