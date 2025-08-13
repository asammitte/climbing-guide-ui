<template>
  <div class="form-text-input-component">
    <input
      v-bind="$attrs"
      :type="type"
      class="form-text-input"
      v-model="model"
    />
  </div>
</template>

<script setup lang="ts">
const model = defineModel()

const props = defineProps({
  type: {
    type: String,
    default: 'text',
  }
})
</script>

<style lang="scss" scoped>
.form-text-input {
  padding: 8px 12px;
  // border: 1px solid black;
  border-radius: 4px;
  box-shadow: none;
  margin: 0;
}
</style>
