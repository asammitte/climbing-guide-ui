<template>
  <div class="area-general-stats-component">

    <!-- Sectors -->
    <div class="general-stats-item">
      <div class="general-stats-item-icon">
        <svg-icon icon="cg_sectors" size="18px" color="var(--secondary_500)" />
      </div>
      <div class="general-stats-item-label">{{ t('sectors') }}:</div>
      <div class="general-stats-item-value">{{ props.totalSectors }}</div>
    </div>

    <!-- Routes -->
    <div class="general-stats-item">
      <div class="general-stats-item-icon">
        <svg-icon icon="cg_carabiner" size="18px" color="var(--secondary_500)" />
      </div>
      <div class="general-stats-item-label">{{ t('routes') }}:</div>
      <div class="general-stats-item-value">{{ props.totalLines }}</div>
    </div>

    <!-- Ascents -->
    <div class="general-stats-item">
      <div class="general-stats-item-icon">
        <svg-icon icon="cg_tick" size="18px" color="var(--secondary_500)" />
      </div>
      <div class="general-stats-item-label">{{ t('ascents') }}:</div>
      <div class="general-stats-item-value">{{ props.totalAscents }}</div>
    </div>

    <!-- Videos -->
    <div class="general-stats-item">
      <div class="general-stats-item-icon">
        <svg-icon icon="cg_video" size="18px" color="var(--secondary_500)" />
      </div>
      <div class="general-stats-item-label">{{ t('videos') }}:</div>
      <div class="general-stats-item-value">{{ props.totalVideos }}</div>
    </div>
  </div>
</template>


<script setup lang="ts">
import SvgIcon from '~/components/common/SvgIcon.vue'

const props = defineProps<{
  totalSectors: number
  totalLines: number
  totalAscents: number
  totalVideos: number
}>()

const { t } = useI18n({
  useScope: 'local',
  messages: {
    en: {
      ascents: 'Ascents',
      routes: 'Routes',
      sectors: 'Sectors',
      videos: 'Videos'
    },
    ua: {
      ascents: 'Пролази',
      routes: 'Маршрути',
      sectors: 'Сектори',
      videos: 'Відео'
    },
  }
})
</script>


<style lang="scss" scoped>
.area-general-stats-component {
  display: grid;
  column-gap: 16px;
  row-gap: 8px;
  grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));

  .general-stats-item {
    display: flex;
    column-gap: 8px;
    align-items: center;

    .general-stats-item-icon {
      border-radius: 30px;
      background-color: var(--neutral_100);
      border: 1px solid var(--secondary_500);
      padding: 7px;
    }

    .general-stats-item-label {
      @include heading5;
    }

    .general-stats-item-value {
      @include body_medium;
    }
  }
}

@media (min-width: $laptop-breakpoint) {
  .area-general-stats-component {
    display: flex;
    justify-content: center;
    column-gap: 24px;
  }
}
</style>