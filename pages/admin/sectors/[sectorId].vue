<template>
  <div class="admin-sector-id-page">
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
        {{ t('routes') }}
      </nuxt-link>
    </div>
    <div class="center-content">
      <NuxtPage
        v-if="adminSectorItemStatus === 'success' && adminSectorItemAsync"
        :key="+route.params.sectorId"
        :sector="adminSectorItemAsync"
      />
    </div>
  </div>
</template>


<script setup lang="ts">
import { useAsyncData, useNuxtApp, useRoute } from '#app'

const { $api } = useNuxtApp()
const route = useRoute()
const localePath = useLocalePath()

const { t } = useI18n({
  useScope: 'local',
  messages: {
    en: {
      mainInfo: 'Info',
      routes: 'Sectors',
    },
    ua: {
      mainInfo: 'Інфо',
      routes: 'Маршрути',
    },
  }
})

const { data: adminSectorItemAsync, status: adminSectorItemStatus } = await useAsyncData(
  'adminSectorItemAsync',
  () => {
    console.log(route)
    const sectorId = +route.params.sectorId
    return $api.sectors.get(sectorId)
  }
)
</script>


<style lang="scss" scoped>
@media (min-width: $laptop-breakpoint) {
  .admin-sector-id-page {
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
