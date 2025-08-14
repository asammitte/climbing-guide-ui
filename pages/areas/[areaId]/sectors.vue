<template>
  <div class="area-sectors-page">
    <template v-if="areaSectorsStatus === 'success'">
      <sectors-list :sectors="areaSectorsAsync.items"/>
    </template>
    <loading-status v-else :status="areaSectorsStatus" />
  </div>
</template>

<script setup lang="ts">
import { useAsyncData, useNuxtApp, useRoute } from '#app'
import LoadingStatus from '~/components/common/LoadingStatus.vue'
import SectorsList from '@/components/sectors/SectorsList.vue'

const route = useRoute()
const { $api } = useNuxtApp()

const page = computed(() => route.query.page ? +route.query.page - 1 : 0)

const { data: areaSectorsAsync, status: areaSectorsStatus } = await useAsyncData(
  'areaSectorsAsync',
  async () => {
    const areaId = +route.params.areaId
    return await $api.sectors.getAll(areaId, page.value, 50)
  },
  {
    watch: [ page ]
  }
)
</script>
