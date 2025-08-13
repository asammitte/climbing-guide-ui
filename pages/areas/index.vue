<template>
  <div class="areas-list-page">
    <top-app-bar icon="cg_arrow_back" :title="t('guide')" />
    <div class="desktop-title">{{ t('guide') }}</div>
    <template v-if="paginatedAreasStatus === 'success'">
      <div class="areas-list-container">
        <areas-list :areas="paginatedAreasAsync.items" />
      </div>
    </template>
    <loading-status v-else :status="paginatedAreasStatus" />
  </div>
</template>


<script setup lang="ts">
import { useLayoutStore } from '~/stores/LayoutStore'
import AreasList from '~/components/areas/AreasList.vue'
import LoadingStatus from '~/components/common/LoadingStatus.vue'
import TopAppBar from '~/components/navigation/TopAppBar.vue'

const layoutStore = useLayoutStore()
const route = useRoute()
const { $api } = useNuxtApp()

const { t } = useI18n({
  useScope: 'local',
  messages: {
    en: {
      guide: 'Guide',
    },
    ua: {
      guide: 'Гайдбук',
    },
  }
})

const page = computed(() => route.query.page ? +route.query.page - 1 : 0)
const { data: paginatedAreasAsync, status: paginatedAreasStatus } = await useAsyncData(
  'paginatedAreasAsync',
  async () => await $api.areas.getAll(page.value, 50),
  {
    lazy: true,
    watch: [ page ]
  }
)
</script>


<style lang="scss" scoped>
.areas-list-page {
  padding: 24px 16px;

  .desktop-title {
    display: none;
  }
}

@media (min-width: $laptop-breakpoint) {
  .areas-list-page {
    padding: 0;

    .desktop-title {
      display: block;
      @include heading2;
      text-align: center;
      margin-bottom: 24px;
    }
  }
}
</style>
