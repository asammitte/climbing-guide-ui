<template>
  <div class="sectors-list-component">
    <div>
      БУКИ
      <div v-for="(s, i) in props.sectors" :key="i">
        <nuxt-link
          :to="localePath({
            name: 'areas-areaId-sectors-sectorId',
            params: {
              areaId: s.areaId.toString(),
              sectorId: s.id.toString()
            }
          })"
          :value="s"
        >
          {{ s.name }}
        </nuxt-link>
        <hr />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { type ISectorsListItem } from '@/types/sectors/ISectorsListItem'

const props = defineProps({
  sectors: {
    type: Object as () => ISectorsListItem[],
    required: true
  }
})
const localePath = useLocalePath()

</script>
