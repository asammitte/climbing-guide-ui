<template>
  <div>
    <TopMenu />
    <!-- <AppHeader /> -->
    <div class="main-content">
      <slot />
    </div>
    <!-- <AppFooter /> -->
  </div>
</template>

<script setup>
import TopMenu from '@/components/common/topMenu.vue'
</script>

<style lang="scss">
.main-content {
  padding-top: 80px;
}
</style>