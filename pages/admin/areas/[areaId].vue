<template>
  <div class="admin-area-id-page">
    <div class="left-menu">
      <nuxt-link
        :to="localePath({
          name: 'admin-areas-areaId',
          params: {
            areaId: route.params.areaId
          }
        })"
        class="left-menu-item"
      >
        {{ t('mainInfo') }}
      </nuxt-link>
      <nuxt-link
        :to="localePath({
          name: 'admin-areas-areaId-sectors',
          params: {
            areaId: route.params.areaId
          }
        })"
        class="left-menu-item"
      >
        {{ t('sectors') }}
      </nuxt-link>
    </div>
    <div class="center-content">
      <NuxtPage
        v-if="areaItemStatus === 'success' && areaItemAsync"
        :key="+route.params.areaId"
        :area="areaItemAsync"
      />
    </div>
  </div>
</template>


<script setup lang="ts">
import { useAsyncData, useNuxtApp, useRoute } from '#app'

const { $api } = useNuxtApp()
const route = useRoute()
const localePath = useLocalePath()

const { data: areaItemAsync, status: areaItemStatus } = await useAsyncData(
  'areaResponse',
  () => {
    const areaId = +route.params.areaId
    return $api.areas.get(areaId)
  }
)

const { t } = useI18n({
  useScope: 'local',
  messages: {
    en: {
      mainInfo: 'Info',
      sectors: 'Sectors',
    },
    ua: {
      mainInfo: 'Інфо',
      sectors: 'Сектори',
    },
  }
})
</script>


<style lang="scss" scoped>
@media (min-width: $laptop-breakpoint) {
  .admin-area-id-page {
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
