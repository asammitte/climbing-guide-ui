<template>
  <div class="default-layout">
    <header>
      <!-- <top-app-bar /> -->
    </header>
    <mobile-slide-menu />
    <top-desktop-menu />
    <div class="container">
      <slot />
    </div>
    <footer>
      <!-- <div>&copy; {{ new Date().getFullYear() }}</div> -->
      <bottom-navigation />
    </footer>
  </div>
</template>

<script setup>
import MobileSlideMenu from '~/components/navigation/MobileSlideMenu.vue'
import BottomNavigation from '~/components/navigation/BottomNavigation.vue'
import TopDesktopMenu from '~/components/navigation/TopDesktopMenu.vue'

import { ref } from 'vue'

const { status } = useAuth()

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
  width: 100vw;
  // background-color: var(--md-sys-color-surface);
  min-height: calc(100vh - 77px);
  padding-bottom: 77px;
  // padding-top: 64px;

  // height: calc(100% - 77px); // 77px default height of BottomNavigation
  // overflow-y: scroll;
  // position: fixed;
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
