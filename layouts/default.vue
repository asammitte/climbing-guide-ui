<template>
  <v-app>
    <TopNavigation />
    <!-- <v-content> -->
    <v-main app>
      <v-container fluid>
        <slot />
      </v-container>
    </v-main>
    <!-- </v-content> -->
    <v-footer app class="d-none d-md-flex">
      <v-spacer></v-spacer>
      <div>&copy; {{ new Date().getFullYear() }}</div>
    </v-footer>
    <BottomNavigation />
  </v-app>
</template>

<script setup>
import TopNavigation from '@/components/common/TopMenu.vue'
import BottomNavigation from '@/components/common/BottomNavigation.vue'

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
