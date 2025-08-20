<template>
  <div>
    <template v-if="sectorRoutesStatus === 'success'">
      <routes-list :routes="sectorRoutesAsync.items" />
    </template>
    <loading-status v-else :status="sectorRoutesStatus" />
  </div>
</template>

<script setup lang="ts">
import { useAsyncData, useNuxtApp, useRoute } from '#app'
import RoutesList from '~/components/routes/RoutesList.vue'
import LoadingStatus from '~/components/common/LoadingStatus.vue'

const { $api } = useNuxtApp()
const route = useRoute()

const { data: sectorRoutesAsync, status: sectorRoutesStatus } = await useAsyncData(
  'sectorRoutes',
  async () => {
    const sectorId = +route.params.sectorId
    return await $api.routes.getAll(sectorId)
  }
)
</script>
