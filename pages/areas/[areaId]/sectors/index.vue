<template>
  <sectors-list :sectors="sectors"/>
</template>

<script setup lang="ts">
import SectorsList from '@/components/sectors/SectorsList.vue'

const route = useRoute()
const { $api } = useNuxtApp()

const page = computed(() => route.query.page ? +route.query.page - 1 : 0)

const { data: paginatedSectors, error } = await useAsyncData(
  'paginatedSectors',
  () => {
    const areaId = +route.params.areaId
    return $api.sectors.getAll(areaId, page.value, 50)
  },
  { watch: [ page ] }
)

const sectors = paginatedSectors.value?.items || []
</script>
