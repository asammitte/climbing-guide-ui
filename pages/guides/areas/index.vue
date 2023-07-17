<template>
  <div class="areas-list-page">
    <AreasList :areas="paginatedAreas!.items" />
    <Pagination :page-count="paginatedAreas!.pagination.totalPages" />
  </div>
</template>

<script setup lang="ts">
import AreasList from '@/components/areas/AreasList.vue'
import Pagination from '@/components/common/Pagination.vue'

const route = useRoute()
const { $api } = useNuxtApp()

const page = computed(() => route.query.page ? +route.query.page - 1 : 0)

const { data: paginatedAreas, error } = await useAsyncData(
  'paginatedAreas',
  () => $api.areas.getAll(page.value, 3), {
    watch: [
      page
    ]
  }
)
</script>
