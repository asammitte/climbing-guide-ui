<template>
  <div class="bottom-navigation-component">
    <nuxt-link
      v-for="(item, index) in menuItems"
      :key="index"
      :to="item.url"
    >
      {{ item.title }}
    </nuxt-link>
  </div>
</template>

<script setup lang="ts">
import useMenuItems from '@/composables/MenuItems'

const menuItems = useMenuItems()
</script>
