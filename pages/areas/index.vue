<template>
  <div class="areas-list-page">
    <!-- <Suspense>
      <template #default> -->
      <template v-if="pending">
        Loading...
      </template>
      <template v-else>
        <AreasList :areas="paginatedAreas!.items" />
        <Pagination :page-count="paginatedAreas!.pagination.totalPages" />
      </template>

      <button @click="refresh">Refresh</button>
      <!-- </template>
      <template #fallback>
        loading
      </template>
    </Suspense> -->
  </div>
</template>

<script setup lang="ts">
import AreasList from '@/components/areas/AreasList.vue'
import Pagination from '@/components/common/Pagination.vue'

const route = useRoute()
const { $api } = useNuxtApp()

const page = computed(() => route.query.page ? +route.query.page - 1 : 0)

const { data: paginatedAreas, pending } = await useAsyncData(
  'paginatedAreas',
  () => $api.areas.getAll(page.value, 50), {
    watch: [
      page
    ]
  }
)

const refresh = () => refreshNuxtData("paginatedAreas")

const areas = paginatedAreas.value?.items || []
</script>
