<template>
  <div class="top-app-bar-component">
    <div class="top-app-bar-icon">
      <svg-icon :icon="props.icon" size="lg" />
    </div>
    <div class="top-app-bar-title">
      {{  props.title }}
    </div>
  </div>
</template>


<script setup lang="ts">
import SvgIcon from '~/components/common/SvgIcon.vue'

const props = defineProps<{
  icon: string,
  title: string
}>()
</script>


<style lang="scss" scoped>
.top-app-bar-component {
  display: flex;
  padding: 10px 16px;
  column-gap: 8px;
  justify-content: flex-start;
  align-items: center;

  .top-app-bar-title {
    @include heading4;
  }
}

@media (min-width: $laptop-breakpoint) {
  .top-app-bar-component {
    display: none;
  }
}
</style>
