<template>
  <div class="area-sub-navigation-component">
    <cg-tabs>
      <template #tabs>
        <nuxt-link
          class="tab-item"
          :to="localePath({ name: 'areas-areaId' })"
        >
          {{ t('info') }}
        </nuxt-link>

        <nuxt-link
          class="tab-item"
          :to="localePath({ name: 'areas-areaId-sectors' })"
        >
          {{ t('sectors') }}
        </nuxt-link>

        <nuxt-link
          class="tab-item"
          :to="localePath({ name: 'areas-areaId-routes' })"
        >
          {{ t('routes') }}
        </nuxt-link>

        <nuxt-link
          class="tab-item"
          :to="localePath({ name: 'areas-areaId-ascents' })"
        >
          {{ t('ascents') }}
        </nuxt-link>

        <nuxt-link
          class="tab-item"
          :to="localePath({ name: 'areas-areaId-videos' })"
        >
          {{ t('videos') }}
        </nuxt-link>
        
      </template>
    </cg-tabs>
  </div>
</template>

<script setup lang="ts">
import { useRoute } from '#app'
import CgTabs from '@/components/common/CgTabs.vue'

const props = defineProps<{
  area: any
}>()

const { t } = useI18n({
  useScope: 'local',
  messages: {
    en: {
      ascents: 'ASCENTS',
      info: 'INFO',
      routes: 'ROUTES',
      sectors: 'SECTORS',
      videos: 'VIDEOS'
    },
    ua: {
      ascents: 'ПРОЛАЗИ',
      info: 'ІНФО',
      routes: 'МАРШРУТИ',
      sectors: 'СЕКТОРИ',
      videos: 'ВІДЕО'
    },
  }
})

const localePath = useLocalePath()
const route = useRoute()

const linkParams = {
  country: route.params.country,
  area: route.params.area
}
</script>

<style lang="scss" scoped>
.area-sub-navigation-component {
  background-color: var(--neutral_100);
}
</style>
