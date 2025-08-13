<template>
  <div class="area-id-page">
    <!-- <template v-if="areaItemStatus === 'success'">
      <ParallaxScrolling :title="areaItemAsync.name" :image-url="areaItemAsync?.image">
        <template v-slot:backControls>
          <nuxt-link :to="localePath({ name: 'areas' })">
            <svg-icon icon="cg_arrow_back" />
          </nuxt-link>
        </template>
        <template v-slot:body>
          <area-sub-navigation :area="areaItemAsync" />
          <div class="area-child-page-container">
            <NuxtPage :area="areaItemAsync" />
          </div>
        </template>
      </ParallaxScrolling>
    </template>
    <loading-status v-else :status="areaItemStatus" /> -->
    <template v-if="areaItemStatus === 'success'">
      <div class="top-mobile-bar-container">
        <top-app-bar icon="cg_arrow_back" :title="areaItemAsync.name" />
      </div>
      <div
        class="full-bleed hero"
        :style="`--hero-url: url('${areaItemAsync.image}')`"
      >
        <nuxt-img
          :src="areaItemAsync.image"
          :alt="areaItemAsync.name"
          class="cover-top"
          sizes="(min-width: 768px) 720px, 100vw"
          format="webp"
        />
        <!-- Text overlay (hidden on mobile, shown on laptop) -->
        <div class="hero__content">
          <div class="laptop-area-name">{{ areaItemAsync.name }}</div>
          <!-- Optional subtext if you have it -->
          <div class="laptop-general-stats">
            <area-general-stats
              :total-sectors="areaItemAsync.totalSectors"
              :total-lines="areaItemAsync.totalLines"
              :total-ascents="areaItemAsync.totalAscents"
              :total-videos="areaItemAsync.totalVideos"
            />
          </div>
        </div>
      </div>
      <div class="area-sticky-container">
        <div class="area-sticky-sub-navigation">
          <area-sub-navigation :area="areaItemAsync" />
        </div>
        <div class="area-child-page-container">
          <NuxtPage :area="areaItemAsync" />
        </div>
      </div>
    </template>
    <loading-status v-else :status="areaItemStatus" />
  </div>
</template>


<script setup lang="ts">
import AreaGeneralStats from '~/components/areas/AreaGeneralStats.vue'
import AreaSubNavigation from '~/components/areas/AreaSubNavigation.vue'
import TopAppBar from '~/components/navigation/TopAppBar.vue'
// import ParallaxScrolling from '@/components/common/ParallaxScrolling.vue'
import LoadingStatus from '~/components/common/LoadingStatus.vue'
// import SvgIcon from '~/components/common/SvgIcon.vue'

const localePath = useLocalePath()
const route = useRoute()
const { $api } = useNuxtApp()

const { data: areaItemAsync, status: areaItemStatus } = await useAsyncData(
  'areaResponse',
  () => {
    const areaId = +route.params.areaId
    return $api.areas.get(areaId)
  }
)
</script>


<style lang="scss" scoped>
.area-id-page {
  .top-mobile-bar-container {
    position: fixed;
    top: 0;
    width: 100%;
    background-color: var(--neutral_100);
    z-index: 999;
  }

  .ratio-9-5 {
    aspect-ratio: 9 / 5;   /* 1.8:1 */
    width: 100%;           /* or set a fixed width, e.g. 360px */
    overflow: hidden;
  }

  .cover-top {
    width: 100%;
    height: 100%;
    object-fit: cover;     /* fill the box */
    object-position: top;  /* keep the top of the image visible */
    display: block;
  }

  .hero {
    position: relative;
    /* same mobile height behavior as before; image defines height */
    .hero__img { height: 360px; } // keep your existing mobile height
  }

  .hero__content {
    display: none; // only show on laptop+
  }

  .area-sticky-container {
    .area-sticky-sub-navigation {
      position: sticky;
      top: 44px;
    }

  }
}

@media (min-width: $laptop-breakpoint) {
  .area-id-page {
    .full-bleed {
      margin-left:  calc(50% - 50vw);
      margin-right: calc(50% - 50vw);
    }

    /* Switch hero to layered background on laptop */
    .hero {
      /* Height for the background hero on laptop */
      height: 360px;

      /* Your requested layered background:
         gradient on top, image underneath.
         Replace position/size values if you want different cropping. */
      background:
        linear-gradient(0deg, rgba(17,16,17,0.60) 0%, rgba(17,16,17,0.60) 100%),
        var(--hero-url) lightgray 0px -212px / 100% 266.667% no-repeat;

      /* Hide the <img> since we're using background now */
      .cover-top {
        display: none;
      }
    }

    /* Text overlay on top of the hero background */
    .hero__content {
      display: grid;
      position: absolute;
      inset: 0;
      align-content: end;     /* text near bottom of hero */
      padding-bottom: 40px;
      color: #fff;
      row-gap: 24px;
      /* optional: subtle text shadow for legibility */
      text-shadow: 0 1px 2px rgba(0,0,0,0.35);
    }

    .laptop-area-name {
      @include heading2;
      text-align: center;
      color: var(--neutral_100);
    }

    .laptop-general-stats {
      width: 100%;
      margin: auto;
    }

    .area-sticky-container {
      .area-sticky-sub-navigation {
        margin: 32px 0;

        :deep(.tab-container) {
          border: 0;
        }
      }
    }
  }
}
</style>
