<template>
  <div class="sectors-list-component">
    <table class="cg-table sectors-list-table">
      <thead>
        <tr>
          <th>
            {{  t('sectorName') }}
          </th>
          <th class="col-grades">
            {{  t('grades') }}
          </th>
          <th>
            {{  t('routes') }}
          </th>
          <th>
            {{  t('ascents') }}
          </th>
          <th>
            {{  t('videos') }}
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(s, i) in props.sectors" :key="i">
          <td class="col-name">
            <nuxt-link
              :to="localePath({
                name: 'areas-areaId-sectors-sectorId',
                params: {
                  areaId: s.areaId.toString(),
                  sectorId: s.id.toString()
                }
              })" 
            >
              {{ s.name }}
            </nuxt-link>
          </td>
          <td class="col-grades">
            {{  t('grades') }}
          </td>
          <td>
            {{ s.totalLines }}
          </td>
          <td>
            {{ s.totalAscents }}
          </td>
          <td>
            {{ s.totalVideos }}
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup lang="ts">
import { type ISectorsListItem } from '@/types/sectors/ISectorsListItem'

const props = defineProps<{
  sectors: ISectorsListItem[]
}>()
const localePath = useLocalePath()

const { t } = useI18n({
  useScope: 'local',
  messages: {
    en: {
      ascents: 'Ascents',
      grades: 'Grades',
      routes: 'Routes',
      sectorName: 'Name',
      videos: 'Routes'
    },
    ua: {
      ascents: 'Пролази',
      grades: 'Категорії',
      routes: 'Маршрути',
      sectorName: 'Назва',
      videos: 'Відео'
    },
  }
})
</script>


<style lang="scss" scoped>
.sectors-list-table {
  tbody {
    @include body_medium;
  }

  .col-name {
    @include heading5;
  }

  .col-grades {
    display: none;
  }
}

@media (min-width: $laptop-breakpoint) {
  .sectors-list-table {
    .col-grades {
      display: unset;
    }
  } 
}
</style>
