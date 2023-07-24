<template>
  <v-bottom-navigation
    app
    grow
    mode="shift"
    color="primary"
    class="d-md-none"
    :absolute="true"
  >
    <v-btn
      v-for="(item, index) in menuItems"
      :key="index"
      nuxt
      :to="item.url"
    >
      <v-icon>{{ item.icon }}</v-icon>

      <span>{{ item.title }}</span>
    </v-btn>
  </v-bottom-navigation>
</template>

<script setup lang="ts">
import useMenuItems from '@/composables/MenuItems'

const menuItems = useMenuItems()
</script>
