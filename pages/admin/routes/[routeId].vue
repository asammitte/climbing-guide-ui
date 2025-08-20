<template>
  <div class="admin-route-id-page">
    <div class="left-menu">
      <nuxt-link
        :to="localePath({
          name: 'admin-sectors-sectorId',
          params: {
            sectorId: route.params.sectorId
          }
        })"
        class="left-menu-item"
      >
        {{ t('mainInfo') }}
      </nuxt-link>
      <nuxt-link
        :to="localePath({
          name: 'admin-sectors-sectorId-routes',
          params: {
            sectorId: route.params.sectorId
          }
        })"
        class="left-menu-item"
      >
        {{ t('videos') }}
      </nuxt-link>
    </div>
    <div class="center-content">
      <template v-if="adminRouteItemStatus === 'success' && adminRouteItemAsync">
        <div>
          <admin-route-details-form
            :sector-id="adminRouteItemAsync.sectorId"
            :route="adminRouteItemAsync"
          />
        </div>
        <!-- <AdminRouteEditor
          v-if="routeHasImage"
          :photo-url="adminRouteItemAsync.imageUrl"
          :existing-routes="routes"
          :grid="grid"
          @save="handleSave"
        /> -->
      </template>
    </div>
  </div>
</template>


<script setup lang="ts">
import { useAsyncData, useNuxtApp, useRoute } from '#app'
import { computed, ref, watch } from 'vue'
import { useBreadcrumbsStore } from '~/stores/breadcrumbsStore'
import { type RouteItem } from '~/types/routes/routes'
import AdminRouteEditor from '~/components/admin/routes/AdminRouteEditor.vue'
import AdminRouteDetailsForm from '~/components/admin/routes/AdminRouteDetailsForm.vue'

const localePath = useLocalePath()
const route = useRoute()
const { $api } = useNuxtApp()

const grid = 10000

const routes = ref<RouteItem[]>([
  // {
  //   id: 1,
  //   name: 'Existing A',
  //   grade: '6a+',
  //   color: '#A1887F',
  //   geometry: { grid, segments: [[[1500, 8200],[1900,7400],[2300,6800],[2700,6100]]], style: { width: 60 } }
  // }
])

const { data: adminRouteItemAsync, status: adminRouteItemStatus } = await useAsyncData(
  'areaResponse',
  () => {
    const routeId = +route.params.routeId
    return $api.routes.get(routeId)
  }
)

const routeHasImage = computed(() => !!adminRouteItemAsync.value?.imageUrl)

function handleSave(r: RouteItem) {
  routes.value = [...routes.value, r]
  // later you'll POST to backend here and refresh from server
}

const { t, locale } = useI18n({
  useScope: 'local',
  messages: {
    en: {
      areas: 'Райони',
      home: 'Home',
      mainInfo: 'Info',
      videos: 'Videos',
      routes: 'Routes',
    },
    ua: {
      areas: 'Райони',
      home: 'Головна',
      mainInfo: 'Інфо',
      videos: 'Відео',
      routes: 'Маршрути',
    },
  }
})

// Breadcrumbs
const bc = useBreadcrumbsStore()
watch(
  [adminRouteItemAsync, locale],
  () => {
    if (!adminRouteItemAsync.value) return
    bc.set([
      { label: t('home'), to: localePath({ name: 'index' }) },
      {
        label: t('areas'),
        to: localePath({ name: 'admin-areas' })
      },
      {
        label: adminRouteItemAsync.value.areaName,
        to: localePath({ name: 'admin-areas-areaId', params: { areaId: adminRouteItemAsync.value.areaId } })
      },
      {
        label: adminRouteItemAsync.value.sectorName,
        to: localePath({ name: 'admin-sectors-sectorId', params: { sectorId: adminRouteItemAsync.value.sectorId } })
      },
      { label: adminRouteItemAsync.value.name }
    ])
  },
  {
    immediate: true
  }
)
</script>


<style lang="scss" scoped>
@media (min-width: $laptop-breakpoint) {
  .admin-route-id-page {
    display: flex;
    align-items: flex-start;
    column-gap: 32px;

    .left-menu {
      @include body_large_bold;
      flex: 0 0 200px;
      padding: 16px;
      border: 1px solid var(--secondary_400);
      border-radius: 16px;
      background: var(--neutral_100);
      box-shadow: 4px 4px 10px 0 rgba(33, 34, 36, 0.05);
      display: grid;
      row-gap: 12px;
      cursor: pointer;

      .router-link-exact-active {
        color: var(--primary_100);
      }
    }

    .center-content {
      flex: 1 1 auto;
    }
  }
}
</style>
