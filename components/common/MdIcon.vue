<template>
  <svg-icon
    type="mdi"
    :path="props.path"
    :size="props.size"
  />
</template>

<script setup lang="ts">
import SvgIcon from '@jamescoyle/vue-icon'

const props = defineProps({
  path: {
    type: String,
    required: true
  },
  size: {
    type: Number,
    required: true
  }
})

</script>
