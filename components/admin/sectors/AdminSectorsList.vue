<template>
  <div class="admin-sectors-list-component">
    <table class="cg-table admin-sectors-list-table">
      <thead>
        <tr>
          <th>
            {{  t('sectorName') }}
          </th>
          <th>
            {{  t('routes') }}
          </th>
          <th>
            {{  t('ascents') }}
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(s, i) in props.sectors" :key="i">
          <td class="col-name">
            <nuxt-link
              :to="localePath({
                name: 'admin-sectors-sectorId-routes',
                params: {
                  sectorId: s.id,
                }
              })" 
            >
              {{ s.name }}
            </nuxt-link>
          </td>
          <td>
            {{ s.totalLines }}
          </td>
          <td>
            {{ s.totalAscents }}
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup lang="ts">
import type { ISectorsListItem } from '~/types/sectors/ISectorsListItem'

const props = defineProps<{
  sectors: ISectorsListItem[]
}>()

const localePath = useLocalePath()

const { t } = useI18n({
  useScope: 'local',
  messages: {
    en: {
      ascents: 'Ascents',
      routes: 'Routes',
      sectorName: 'Name',
    },
    ua: {
      ascents: 'Пролази',
      routes: 'Маршрути',
      sectorName: 'Назва',
    },
  }
})
</script>


<style lang="scss" scoped>
.admin-sectors-list-table {
  tbody {
    @include body_medium;
  }

  .col-name {
    @include heading5;
  }
}
</style>
