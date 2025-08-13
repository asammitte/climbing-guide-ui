<template>
  <div class="parallax-scrolling-component">
    <div class="back-controls">
      <slot name="backControls"></slot>
    </div>
    <div class="parallax" @scroll="weAreScrolling">
      <div class="parallax__layer parallax__layer--back">
        <div class="image-container">
          <img :src="imageUrl" />
        </div>
        <div class="image-container-overlay" :style="{ background: imageBackgroundColor }"></div>
      </div>
      <div :style="{ 'margin-top': '350px' }"></div>
      <div
        class="parallax__layer title-wrapper"
        :style="{
          background: menuBackgroundColor,
        }"
      >
        <div
          class="title-block"
          :style="{
            display: 'flex',
            'align-items': 'center',
            'height': `${toolbarSize}px`,
            'padding-left': `${titleLeftMargin}px`
          }"
        >
          <div
            class="scalable-title title-large"
            :style="{
              // 'font-size': `${titleRem}px`,
              'font-size': `40px`,
              'transform': `scale(${titleScale})`
            }"
          >
            {{ title }}
          </div>
        </div>

        <!-- HEADER SLOT -->
        <!-- <div v-show="isHeaderSlotVisible">
          <slot name="header">
            232323
          </slot>
        </div> -->
      </div>
      <div class="parallax__layer parallax__layer--base">
        <slot name="body">
          23232323
        </slot>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'

enum DensityEnum {
  Default = 'default',
  Comfortable = 'comfortable',
  Compact = 'compact'
}

const props = defineProps({
  title: {
    type: String,
    default: ''
  },
  imageUrl: {
    type: String,
    default: '/images/vinnitsya.jpg'
  },
  density: {
    type: String,
    default: DensityEnum.Default,
    validator(value: DensityEnum) {
      return [DensityEnum.Default, DensityEnum.Comfortable, DensityEnum.Compact].includes(value)
    }
  },
  imageLayerHeight: {
    type: Number,
    default: 400
  },
  maxTitleFontSize: {
    type: Number,
    default: 40
  },
  minTitleFontSize: {
    type: Number,
    default: 22
  },
  minTitleLeftMargin: {
    type: Number,
    default: 10
  },
  maxTitleLeftMargin: {
    type: Number,
    default: 64
  }
})


const toolbarSize = computed<number>(() => {
  if (props.density == DensityEnum.Default) return 64
  if (props.density == DensityEnum.Comfortable) return 56
  if (props.density == DensityEnum.Compact) return 48
})

const fontScaleStep = computed<number>(() => {
  return (1 - (props.minTitleFontSize / props.maxTitleFontSize)) / (props.imageLayerHeight - toolbarSize.value)
})

const marginScaleStep = computed<number>(() => {
  return (props.maxTitleLeftMargin - props.minTitleLeftMargin) / (props.imageLayerHeight - toolbarSize.value)
})

const opacityScaleStep = computed<number>(() => {
  return 1 / (props.imageLayerHeight - toolbarSize.value)
})

const titleScale = ref(1)
const titleRem = ref(22)
const titleLeftMargin = ref(10)
const imageBackgroundColor = ref("rgba(250, 249, 252, 0)")
const menuBackgroundColor = ref("rgba(250, 249, 252, 0)")
const isHeaderSlotVisible = ref(false)

onMounted(() => {

})
const weAreScrolling = (e: any) => {
  const scrollTop = e.target.scrollTop

  isHeaderSlotVisible.value = scrollTop >= 350 ? true : false

  if (scrollTop >= (props.imageLayerHeight - toolbarSize.value)) {
    titleLeftMargin.value = props.maxTitleLeftMargin
    // titleRem.value = props.minTitleFontSize
    titleScale.value = props.minTitleFontSize / props.maxTitleFontSize
    
    imageBackgroundColor.value = `rgba(250, 249, 252, 1)`
    menuBackgroundColor.value = `rgba(250, 249, 252, 1)`
  } else if (scrollTop >= 0) {
    titleLeftMargin.value = props.minTitleLeftMargin + (scrollTop * marginScaleStep.value)
    // titleRem.value = props.maxTitleFontSize - (scrollTop * fontSizeScaleStep.value)
    titleScale.value = 1 - (fontScaleStep.value * scrollTop)

    const opacity = opacityScaleStep.value * scrollTop
    imageBackgroundColor.value = `rgba(250, 249, 252, ${opacity})`
    menuBackgroundColor.value = `rgba(250, 249, 252, 0)`
  }
}
</script>

<style scoped>
.parallax-scrolling-component {
  position: absolute;
  top: 0;
  left: 0;
}

.parallax {
  position: relative;
  height: 100vh;
  overflow-x: hidden;
  overflow-y: auto;
  -webkit-perspective: 1px;
  perspective: 1px;
}

.parallax::-webkit-scrollbar{
  display: none;
}

.parallax__layer--back {
  position: absolute;
  top: 0;
  height: 100vh;
  -webkit-transform: translateZ(-2px) scale(3);
  transform: translateZ(-2px) scale(3);
}

.back-controls {
  position: absolute;
  top: 20px;
  left: 16px;
  z-index:6;
}

.title-wrapper {
  -webkit-transform: translateZ(0);
  transform: translateZ(0);
  position: -webkit-sticky;
  position: sticky;
  top: 0;
  bottom: 0;
  color: var(--md-sys-color-on-surface);
  width: 50%;
  z-index: 9999;
  width: 100%;
}

.scalable-title {
  transform-origin: left center;
  font-weight: 400;
  background-color: rgba(250, 249, 252, .4);
  border-radius: 16px;
  padding: 0 12px;
}

.parallax__layer--base {
  -webkit-transform: translateZ(0);
  transform: translateZ(0);
  /* background-color: rgba(0, 0, 0, 0.5); */
  background-color: white;
  min-height: calc(100vh - 64px);
  width: 100vw;
}

.image-container {
  position: relative;
}

.image-container img{
  max-height: 100%;
}

.image-container-overlay {
  position: absolute;
  top: 0;
  width: 100%;
  height: 100%;
}
</style>
