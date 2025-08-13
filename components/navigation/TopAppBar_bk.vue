<template>
  <div class="top-app-bar-component" :class="{ 'is-contrast': isContrast}">
    <div class="app-bar-menu">
      <md-icon
        type="mdi"
        :path="mdiArrowLeft"
        :size="24"
      />
    </div>
    <div class="app-bar-title title-large">
      <!-- {{ topAppBarTitle }} -->
      Буки
    </div>
    <!-- <div class="app-bar-profile">
      <md-icon
        type="mdi"
        :path="mdiAccountCircle"
        :size="24"
      />
    </div> -->
  </div>
</template>

<script setup lang="ts">
import MdIcon from '@/components/common/MdIcon.vue'
import {
  mdiArrowLeft
} from '@mdi/js'


import { useLayoutStore } from '@/stores/LayoutStore'

const layoutStore = useLayoutStore()
const topAppBarTitle = useState('counter');

if (process.client) {
  window.addEventListener('scroll', handleScroll)
}

const isContrast = ref(false)

function handleScroll() {
  isContrast.value = window.scrollY > 32 ? true : false
}
</script>

<style lang="scss" scoped>
.top-app-bar-component {
  height: 64px;
  background-color: var(--md-sys-color-surface);
  color: var(--md-sys-color-on-surface);
  display: flex;
  align-items: center;
  transition: background-color 0.5s;

  position: fixed;
  top: 0;
  width: 100%;

  &.is-contrast {
    background-color: var(--md-sys-color-surface-container);
  }

  .app-bar-menu {
    display: flex;
    padding: 0 24px 0 16px;
  }
  
  .app-bar-title {
    display: flex;
    // text-align: center;
    flex-grow: 2;
  }
  
  .app-bar-profile {
    display: flex;
    padding: 0 16px 0 24px;
  }
}
</style>
