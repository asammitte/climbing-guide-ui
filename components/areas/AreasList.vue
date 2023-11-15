<template>
  <div class="areas-list-component">
    <div
      v-for="(a, i) in props.areas"
      :key="i"
      class="area-list-item"
    >
      <nuxt-link
        :to="localePath({ name: 'areas-areaId-sectors', params: { areaId: a.id.toString() } })"
      >
        {{ a.name }}
      </nuxt-link>
    </div>
  </div>
</template>

<script setup lang="ts">
import { type IAreasListItem } from '@/types/areas/IAreasListItem'

const props = defineProps({
  areas: {
    type: Object as () => IAreasListItem[],
    required: true
  }
})
const localePath = useLocalePath()

</script>
