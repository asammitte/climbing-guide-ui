<template>
  <div class="areas-list-component">
    <ul>
      <li v-for="a in props.areas" :key="a.id">
        {{ a.name }}
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import IAreasListItem from '@/types/areas/IAreasListItem'

const props = defineProps({
  areas: {
    type: Object as () => IAreasListItem[],
    required: true
  }
})
</script>
