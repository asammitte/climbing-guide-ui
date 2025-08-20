<template>
  <div class="admin-areas-list-component">
    <table class="cg-table admin-areas-list-table">
      <thead>
        <tr>
          <th>
            {{  t('areaName') }}
          </th>
          <th>
            {{  t('sectors') }}
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
        <tr v-for="(a, i) in props.areas" :key="i">
          <td class="col-name">
            <nuxt-link
              :to="localePath({
                name: 'admin-areas-areaId',
                params: {
                  areaId: a.id
                }
              })"
            >
              {{ a.name }}
            </nuxt-link>
          </td>
          <td>
            {{ a.totalSectors }}
          </td>
          <td>
            {{ a.totalLines }}
          </td>
          <td>
            {{ a.totalAscents }}
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup lang="ts">
import type { IAreasListItem } from '~/types/areas/IAreasListItem'

const props = defineProps<{
  areas: IAreasListItem[]
}>()

const localePath = useLocalePath()

const { t } = useI18n({
  useScope: 'local',
  messages: {
    en: {
      areaName: 'Name',
      ascents: 'Ascents',
      routes: 'Routes',
      sectors: 'Sectors',
    },
    ua: {
      areaName: 'Назва',
      ascents: 'Пролази',
      routes: 'Маршрути',
      sectors: 'Сектори',
    },
  }
})
</script>


<style lang="scss" scoped>
.admin-areas-list-table {
  tbody {
    @include body_medium;
  }

  .col-name {
    @include heading5;
  }
}
</style>
