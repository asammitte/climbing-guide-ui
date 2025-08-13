<template>
  <nuxt-img :src="url || 'undefined'" :placeholder="'/images/area-1.png'" />
</template>

<script setup lang="ts">
const props = defineProps({
  url: {
    type: String,
    required: true
  }
})
</script>
