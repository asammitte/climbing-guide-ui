<template>
  <div class="admin-sectors-list-page">
    <template v-if="paginatedAdminSectorsStatus === 'success'">
      <div class="admin-sectors-list-container">
        <admin-sectors-list :sectors="paginatedAdminSectorsAsync.items" />
      </div>
    </template>
    <loading-status v-else :status="paginatedAdminSectorsStatus" />
  </div>
</template>


<script setup lang="ts">
import { useNuxtApp } from '#app'
import { useBreadcrumbsStore } from '~/stores/breadcrumbsStore'
import { type IArea } from '~/types/areas/IArea'
import AdminSectorsList from '~/components/admin/sectors/AdminSectorsList.vue'
import LoadingStatus from '~/components/common/LoadingStatus.vue'

const props = defineProps<{
  area: IArea
}>()

const localePath = useLocalePath()
const route = useRoute()
const { $api } = useNuxtApp()

const { t, locale } = useI18n({
  useScope: 'local',
  messages: {
    en: {
      areas: 'Areas',
      home: 'Home',
      sectors: 'Sectors',
    },
    ua: {
      areas: 'Райони',
      home: 'Головна',
      sectors: 'Сектори',
    },
  }
})

const page = computed(() => route.query.page ? +route.query.page - 1 : 0)
const { data: paginatedAdminSectorsAsync, status: paginatedAdminSectorsStatus } = await useAsyncData(
  'paginatedAdminSectorsAsync',
  async () => {
    const areaId = +route.params.areaId
    return await $api.sectors.getAll(areaId, page.value, 50)
  },
  {
    lazy: true,
    watch: [ page ]
  }
)

/* Breadcrumbs: watch for sector */
const bc = useBreadcrumbsStore()
bc.set([
  { label: t('home'), to: localePath({ name: 'index' }) },
  {
    label: t('areas'),
    to: localePath({ name: 'admin-areas' })
  },
  {
    label: props.area.name,
    to: localePath({ name: 'admin-areas-areaId', params: { areaId: props.area.id } })
  },
  { label: t('sectors') }
])
</script>
