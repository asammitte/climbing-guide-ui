<template>
  <div class="area-info-page">

    <!-- General stats -->
    <div class="mobile-general-stats">
      <area-general-stats
        :total-sectors="props.area.totalSectors"
        :total-lines="props.area.totalLines"
        :total-ascents="props.area.totalAscents"
        :total-videos="props.area.totalVideos"
      />
    </div>

    <!-- Charts -->
     <div class="area-charts">
      <div class="chart-container">
        <grades-chart :total-by-grades="props.area.totalByGrades" />
      </div>

      <div class="chart-container">
        <area-season-chart :ascents-by-months="props.area.totalByMonths" />
      </div>
    </div>

    <div class="area-description">
      <div v-html="area.description"></div>
      <div v-html="area.stay"></div>
    </div>
  </div>
</template>


<script setup lang="ts">
import type { IArea } from '~/types/areas/IArea'
import AreaGeneralStats from '~/components/areas/AreaGeneralStats.vue'
import AreaSeasonChart from '~/components/areas/AreaSeasonChart.vue'
import GradesChart from '~/components/charts/GradesChart.vue'

const props = defineProps<{
  area: IArea
}>()
</script>


<style lang="scss" scoped>
.area-info-page {
  background-color: var(--secondary_100);
  padding: 0 16px 24px 16px;

  .mobile-general-stats {
    padding: 32px 0;
  }

  .area-charts, .area-description {
    display: flex;
    row-gap: 16px;
    margin-bottom: 24px;
    flex-direction: column;
  }

  .area-charts {
    .chart-container {
      background-color: var(--neutral_100);
      border-radius: 16px;
      box-shadow: 4px 4px 10px 0 rgba(33, 34, 36, 0.05);
      padding: 16px;
    }
  }

  .area-description {
    @include body_large;
  }
}

@media (min-width: $laptop-breakpoint) {
  .area-info-page {
    padding: 0 0 24px 0;
    background-color: unset;

    .mobile-general-stats {
      display: none;
    }

    .area-charts, .area-description {
      display: grid;
      column-gap: 16px;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      margin-bottom: 32px;
    }
  }
}
</style>
