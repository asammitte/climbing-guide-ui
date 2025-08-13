<template>
  <div class="form-field-component">
    <div v-if="label" class="form-field-label">
      {{ label }}
    </div>
    <div class="form-field-input">
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps({
  label: {
    type: String,
    default: ''
  },
  required: {
    type: Boolean,
    default: false
  }
})
</script>

<style lang="scss" scoped>
.form-field-component {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 4px;
}
</style>
