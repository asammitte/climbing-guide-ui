<template>
  <div class="default-layout dark-theme">
    <TopMenu />
    <nuxt-page />
    <footer>
      <div>&copy; {{ new Date().getFullYear() }}</div>
      <BottomNavigation />
    </footer>
  </div>
</template>

<script setup>
import TopMenu from '@/components/navigation/TopMenu.vue'
import BottomNavigation from '@/components/navigation/BottomNavigation.vue'

import { ref } from 'vue'

const items = ref([
  {
    icon: '',
    title: 'la'
  }
])
const drawer = ref(null)

</script>

<style lang="scss"></style>
