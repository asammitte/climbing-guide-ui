<template>
  <div class="admin-routes-list-page">

    <div class="create-new-route-container">
      <div v-if="!isCreateRouteFormVisible" class="create-route-controls">
        <button
          class="cg-btn"
          type="submit"
          @click="isCreateRouteFormVisible = true"
        >
          {{ t('createRoute') }}
        </button>
      </div>
      <admin-route-details-form
        v-else @cancel="isCreateRouteFormVisible = false"
        :sector-id="+route.params.sectorId"
      />
    </div>

    <template v-if="paginatedAdminRoutesStatus === 'success'">
      <div class="admin-routes-list-container">
        <admin-routes-list :routes="paginatedAdminRoutesAsync.items" />
      </div>
    </template>
    <loading-status v-else :status="paginatedAdminRoutesStatus" />
  </div>
</template>


<script setup lang="ts">
import { ref } from 'vue'
import { useBreadcrumbsStore } from '~/stores/breadcrumbsStore'
import { type ISectorItem } from '~/types/sectors/ISectorItem'
import AdminRouteDetailsForm from '~/components/admin/routes/AdminRouteDetailsForm.vue'
import AdminRoutesList from '~/components/admin/routes/AdminRoutesList.vue'
import LoadingStatus from '~/components/common/LoadingStatus.vue'

const props = defineProps<{
  sector: ISectorItem
}>()

const localePath = useLocalePath()
const route = useRoute()
const { $api } = useNuxtApp()

const isCreateRouteFormVisible = ref(false)

const { t, locale } = useI18n({
  useScope: 'local',
  messages: {
    en: {
      areas: 'Райони',
      createRoute: 'Create route',
      home: 'Home',
      routes: 'Routes',
    },
    ua: {
      areas: 'Райони',
      createRoute: 'Додати маршрут',
      home: 'Головна',
      routes: 'Маршрути',
    },
  }
})

const page = computed(() => route.query.page ? +route.query.page - 1 : 0)
const { data: paginatedAdminRoutesAsync, status: paginatedAdminRoutesStatus } = await useAsyncData(
  'paginatedAdminRoutesAsync',
  async () => {
    const sectorId = +route.params.sectorId
    return await $api.routes.getAll(sectorId)
  },
  {
    lazy: true,
    watch: [ page ]
  }
)

// Breadcrumbs
const bc = useBreadcrumbsStore()
bc.set([
  { label: t('home'), to: localePath({ name: 'index' }) },
  {
    label: t('areas'),
    to: localePath({ name: 'admin-areas' })
  },
  {
    label: props.sector.areaName,
    to: localePath({ name: 'admin-areas-areaId', params: { areaId: props.sector.areaId } })
  },
  {
    label: props.sector.name,
    to: localePath({ name: 'admin-sectors-sectorId', params: { sectorId: props.sector.id } })
  },
  { label: t('routes') }
])
</script>


<style lang="scss" scoped>
.create-new-route-container {
  position: sticky;

  .create-route-controls {
    text-align: right;
  }
}
</style>
