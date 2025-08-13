<template>
  <button
    v-on="$listeners"
    :disabled="disabled"
  >
    <div v-if="label" >{{ label }}</div>
  </button>
</template>

<script setup lang="ts">
const props = defineProps({
  label: {
    type: String,
    default: ''
  },

  disabled: {
    type: Boolean,
    default: false
  }
})
</script>

<style lang="scss" scoped></style>
