<!-- to use this component, give every item in the tabs slot the class 'tab-item' -->

<template>
  <div class="outer-container">

    <div ref="tabContainer" class="tab-container">
      <slot name="tabs" />
    </div>

    <div class="fades beginning" :class="{ hide: !fadeBeginning }" @click="scrollFor(-64)">
      <svg-icon icon="cg_arrow_left" />
    </div>
    <div class="fades end" :class="{ hide: !fadeEnd }" @click="scrollFor(64)">
      <svg-icon icon="cg_arrow_right" />
    </div>
  </div>
</template>


<script>
import SvgIcon from '~/components/common/SvgIcon.vue'

export default {
  name: 'CgTabs',

  components: {
    SvgIcon
  },

  props: {
    scrollOnMount: {
      type: Boolean,
      required: false,
      default: true
    }
  },

  onBeforeUnmount() {
    this.$refs.tabContainer.removeEventListener('scroll', this.scrolled)
  },

  mounted() {
    this.processedTabList = document.querySelectorAll('.tab-item')
    if (this.processedTabList.length === 0) return
    this.firstTab = this.processedTabList[0]
    this.lastTab = this.processedTabList[this.processedTabList.length - 1]

    const activeElement = document.querySelector('.outer-container .active')
    if (activeElement && this.scrollOnMount) activeElement.scrollIntoView({block: 'nearest', inline: 'center' })

    this.scrolled()
    this.$refs.tabContainer.addEventListener('scroll', this.scrolled)
  },

  data() {
    return {
      processedTabList: [],
      observer: null,
      firstTab: null,
      lastTab: null,
      fadeBeginning: false,
      fadeEnd: false,
    }
  },

  methods: {
    scrolled() {
      const firstRectangle = this.firstTab.getBoundingClientRect()
      if (firstRectangle.left < -10) {
        this.fadeBeginning = true
      } else {
        this.fadeBeginning = false
      }

      const lastRectangle = this.lastTab.getBoundingClientRect()
      if (window.innerWidth - lastRectangle.right < -10) {
        this.fadeEnd = true
      } else {
        this.fadeEnd = false
      }
    },

    scrollFor(value) {
      this.$refs.tabContainer.scrollLeft += value
    },
  },

}
</script>


<style scoped lang="scss">
.outer-container {
  position: relative;
  height: 48px;
  max-width: 100%;
  min-width: 100%;
}

.tab-container {
  position: absolute;
  max-width: 100%;
  display: flex;
  background-color: var(--neutral_100);
  border-radius: 4px 4px 0px 0px;
  min-width: 100%;
  -ms-overflow-style: none; /* IE and Edge */
  scrollbar-width: none; /* Firefox */
  scroll-behavior: smooth;
  overflow-x: auto;
  flex-wrap: nowrap;
  border-top: 3px solid var(--secondary_100);
  border-bottom: 3px solid var(--secondary_100);
}

.tab-container::-webkit-scrollbar {
  display: none;
}

.tab-container::before, .tab-container::after {
  content: '';  /* Insert pseudo-element */
  margin: auto; /* Make it push flex items to the center */
}

:deep(.tab-item) {
  @include heading5;
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  white-space: nowrap;
  // margin: 0 10px;
  padding: 12px 16px;
  text-decoration: none;
  cursor: default;

  &:first-child {
    margin-left: 16px;
  }
  &:last-child {
    margin-right: 16px;
  }

  &.active-tab:after,
  &.router-link-exact-active:after {
    transform: scaleX(1);
  }

  &:after {
    content: '';
    position: absolute;
    top: 40px;
    width: 100%;
    transform: scaleX(0);
    height: 2px;
    bottom: 0;
    left: 0;
    background-color: var(--primary_100);
    transform-origin: bottom right;
    transition: transform 0.25s ease-out;
  }

  &:hover:after {
    transform: scaleX(1);
    transform-origin: bottom left;
  }

  &.active-tab,
  &.router-link-active {
    color: var(--primary_100);
  }
  &.disabled {
    color: rgba(0, 0, 0, 0.5) !important;
    cursor: not-allowed !important;
  }
  &.disabled:hover {
    background: transparent !important;
  }
  &:not(.router-link-exact-active) {
    cursor: pointer;
  }
  &:hover {
    text-decoration: none;
  }
}

.fades {
  position: absolute;
  display: flex;

  align-items: center;
  justify-content: center;
  height: 42px;
  width: 28px;
  background-color: white;
  cursor: pointer;
  &.beginning {
    left: 0;
    background: linear-gradient(90deg, var(--neutral_100) 50%, rgba(255, 255, 255, 0) 100%);
  }
  &.end {
    right: 0;
    background: linear-gradient(270deg, var(--neutral_100) 50%, rgba(255, 255, 255, 0) 100%);
  }
  &.hide {
    display: none !important;
  }
}

@media (min-width: $laptop-breakpoint) {
  .fades {
    display: none;
  }
}
</style>
