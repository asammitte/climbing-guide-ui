<template>
  <div
    class="icon-container"
    :class="{ 'override-color': overrideColor, pointer }"
    :style="cssProps"
    v-html="iconContent"
    v-bind="$attrs"
  ></div>
</template>


<script setup lang="ts">
import { withDefaults } from 'vue'
import { useSvgLoader } from '~/composables/useSvgLoader'

// inheritAttrs: false,
const props = withDefaults(defineProps<{
  icon: string,
  color?: string,
  overrideColor?: boolean,
  size?: string,
  height?: string,
  width?: string,
  pointer?: boolean
}>(), {
  color: 'currentColor',
  overrideColor: true,
  size: '24px',
  height: '24px',
  width: '24px',
  pointer: false
})

const { loadSvg } = useSvgLoader()

// No require(), no async, no watchers — SSR-safe and instant
const iconContent = computed(() => {
  const svg = loadSvg(props.icon)
  if (!svg) {
    if (process.dev) console.error(`Could not find svg icons/${props.icon}.svg`)
    return ''
  }
  return svg
})

const cssProps = computed(() => {
  return {
    '--fill-color': props.color,
    '--height': props.size,
    '--width':  props.size
  }
})
</script>


<style lang="scss" scoped>
.icon-container {
  display: flex;
  align-items: center;
  justify-content: center;

  :deep(svg) {
    height: var(--height);
    width: var(--width);
  }

  &.override-color {
    :deep(svg) {
      path { fill: var(--fill-color) !important; }
    }
  }

  &.pointer { cursor: pointer; }
}
</style>
