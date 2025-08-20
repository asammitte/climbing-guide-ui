<template>
  <div class="admin-areas-list-page">
    <div class="desktop-title">{{ t('areas') }}</div>
    <template v-if="paginatedAdminAreasStatus === 'success'">
      <div class="admin-areas-list-container">
        <admin-areas-list :areas="paginatedAdminAreasAsync.items" />
      </div>
    </template>
    <loading-status v-else :status="paginatedAdminAreasStatus" />
  </div>
</template>


<script setup lang="ts">
import { useBreadcrumbsStore } from '~/stores/breadcrumbsStore'
import AdminAreasList from '~/components/admin/areas/AdminAreasList.vue'
import LoadingStatus from '~/components/common/LoadingStatus.vue'

const localePath = useLocalePath()
const route = useRoute()
const { $api } = useNuxtApp()

const { t } = useI18n({
  useScope: 'local',
  messages: {
    en: {
      areas: 'Areas',
      home: 'Home'
    },
    ua: {
      areas: 'Райони',
      home: 'Головна'
    },
  }
})

// breadcrumbs
const bc = useBreadcrumbsStore()
bc.set([
  { label: t('home'), to: localePath({ name: 'index' }) },
  { label: t('areas') }
])

const page = computed(() => route.query.page ? +route.query.page - 1 : 0)
const { data: paginatedAdminAreasAsync, status: paginatedAdminAreasStatus } = await useAsyncData(
  'paginatedAdminAreasAsync',
  async () => await $api.areas.getAll(page.value, 50),
  {
    lazy: true,
    watch: [ page ]
  }
)
</script>


<style lang="scss" scoped>
.admin-areas-list-page {
  padding: 24px 16px;

  .desktop-title {
    display: block;
    @include heading2;
    text-align: center;
    margin-bottom: 24px;
  }
}
</style>
