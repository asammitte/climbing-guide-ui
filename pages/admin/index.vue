<template>
  <div class="admin-index">
    <cg-breadcrumbs
      :items="[
        { label: 'areas', to: '/areas' },
        { label: 'Climbing', to: '/shop/climbing' },
        { label: 'Quickdraws' } // current page (no link)
      ]"
      :home="{ label: 'Home', to: '/' }"
      :max-items="5"
      class="mb-4"
      separator="chevron"
    />
    <NuxtPage />
  </div>
</template>


<script setup lang="ts">
import CgBreadcrumbs from '~/components/navigation/CgBreadcrumbs.vue'
</script>
