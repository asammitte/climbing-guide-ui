<template>
  <div class="loading-status-component">
    <div v-if="props.status === 'pending'">Loading...</div>
    <div v-if="props.status === 'error'">Error</div>
  </div>
</template>


<script setup lang='ts'>
const props = defineProps<{
  status: 'error' | 'pending' | 'idle'
}>()
</script>
