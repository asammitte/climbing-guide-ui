<template>
  <div class="areas-list-component">
    <nuxt-link
      v-for="(a, i) in props.areas"
      :key="i"
      class="areas-list-item"
      :to="localePath({ name: 'areas-areaId-sectors', params: { areaId: a.id.toString() } })"
    >
      <div
        class="item-background"
        :style="{ '--bg-img': `url(${a.image || '/images/area-1.png'})` }"
      >
        <div class="area-title">
          {{  a.name }}
        </div>
        <div class="area-stats">
          <div class="area-stats-item">
            <div class="icon-container">
              <svg-icon icon="cg_carabiner" size="14px" />
            </div>
            <div class="subtitle-container">{{ t('routes') }}:</div>
            <div class="count-container">{{ a.totalLines }}</div>
          </div>
          <div class="area-stats-item">
            <div class="icon-container">
              <svg-icon icon="cg_sectors" size="14px" />
            </div>
            <div class="subtitle-container">{{ t('ascents') }}:</div>
            <div class="count-container">{{ a.totalAscents }}</div>
          </div>
        </div>
      </div>
    </nuxt-link>
  </div>
</template>


<script setup lang="ts">
import { type IAreasListItem } from '~/types/areas/IAreasListItem'
import SvgIcon from '~/components/common/SvgIcon.vue'

const props = defineProps<{
  areas: IAreasListItem[]
}>()

const localePath = useLocalePath()
const { t } = useI18n({
  useScope: 'local',
  messages: {
    en: {
      ascents: 'Ascents',
      routes: 'Routes'
    },
    ua: {
      ascents: 'Пролази',
      routes: 'Маршрути'
    },
  }
})
</script>


<style lang="scss" scoped>
.areas-list-component {
  display: grid;
  grid-gap: 16px;
  grid-template-columns: 1fr;

  .areas-list-item {
    border-radius: 16px;
    overflow: hidden;
    
    /* Card Shadow +- */
    box-shadow: -4px -4px 10px 0 rgba(33, 34, 36, 0.10),
                 4px  4px 10px 0 rgba(33, 34, 36, 0.10);

    .item-background {
      display: flex;
      flex-direction: column;
      justify-content: flex-end;
      row-gap: 8px;
      align-items: flex-start;

      height: 130px;
      padding: 16px;
      color: var(--neutral_100);

      /* gradient first = on top, image second = underneath */
      background-image:
        linear-gradient(0deg, rgba(17,16,17,0.60) 0%, rgba(17,16,17,0.60) 100%),
        var(--bg-img);
      background-position: top;
      background-size: cover;
      background-repeat: no-repeat;
      background-color: lightgray; /* fallback while image loads */

      .area-title {
        @include heading5;
      }

      .area-stats {
        display: flex;
        justify-content: flex-start;
        column-gap: 8px;

        .area-stats-item {
          @include body_small;
          display: flex;
          column-gap: 8px;
          margin-right: 20px;
          align-items: center;

          .icon-container {
            background-color: var(--secondary_500);
            border-radius: 16px;
            width: 20px;
            height: 20px;
          }
        }
      }
    }
  }
}

@media (min-width: $laptop-breakpoint) {
  .areas-list-component {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
}
</style>