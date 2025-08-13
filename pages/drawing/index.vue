<template>
  <div class="admin-drawing-page">
    <ClientOnly fallback-tag="span" fallback="Loading paperjs...">
      <!-- <PaperJS /> -->
      <PaperJS />
    </ClientOnly>
  </div>
</template>

<script setup lang="ts">
import PaperJS from '@/components/drawing/PaperJs.vue'
</script>
