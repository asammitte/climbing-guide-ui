<template>
  <div class="default-layout">
    <header>
      <TopMenu />
    </header>
    <nuxt-page />
    <footer>
      <!-- <div>&copy; {{ new Date().getFullYear() }}</div> -->
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

<style lang="scss">
.default-layout {
  background-color: var(--md-sys-color-surface);
  min-height: 100vh;
}

header {
  display: none;
}

footer {
  position: fixed;
  bottom: 0;
  width: 100%;
  /* Height of the footer*/
  height: fit-content;
  background: grey;
}

@media (min-width: $laptop-breakpoint) {
  header {
    display: block;
  }
}
</style>
