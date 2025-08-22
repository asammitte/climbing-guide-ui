<template>
  <div class="default-layout">
    <header>
      <!-- <top-app-bar /> -->
    </header>
    <mobile-slide-menu />
    <div
      class="topbar sticky-top"
      :class="{ 'is-hidden': isLargeScreen && !isMenuVisible }"
    >
      <top-desktop-menu />
    </div>
    <div class="container">
      <slot />
    </div>
    <footer>
      <bottom-navigation />
    </footer>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useBreadcrumbsStore } from '~/stores/breadcrumbsStore'
import BottomNavigation from '~/components/navigation/BottomNavigation.vue'
import CgBreadcrumbs from '~/components/navigation/CgBreadcrumbs.vue'
import MobileSlideMenu from '~/components/navigation/MobileSlideMenu.vue'
import TopDesktopMenu from '~/components/navigation/TopDesktopMenu.vue'

const MEDIA_QUERY = '(min-width: 1024px)' // “laptop and bigger”
const SCROLL_DELTA = 8                     // ignore tiny scrolls (px)
const TOP_OFFSET = 20                      // always show near very top (px)

const isMenuVisible = ref(true)
const isLargeScreen = ref(true)
const lastY = ref(0)
let mql: MediaQueryList | null = null
let rafId: number | null = null

const bc = useBreadcrumbsStore()
const { items } = storeToRefs(bc)

const handleScrollCore = () => {
  if (!isLargeScreen.value) return

  const y = window.scrollY || 0

  // Always show when near the very top
  if (y <= TOP_OFFSET) {
    isMenuVisible.value = true
    lastY.value = y
    return
  }

  // Ignore small deltas to avoid flicker
  if (Math.abs(y - lastY.value) < SCROLL_DELTA) return

  // Down -> hide, Up -> show
  isMenuVisible.value = y < lastY.value
  lastY.value = y
}

const onScroll = () => {
  // Throttle with rAF for smoother updates
  if (rafId != null) return
  rafId = requestAnimationFrame(() => {
    rafId = null
    handleScrollCore()
  })
}

const onMediaChange = (e: MediaQueryListEvent) => {
  isLargeScreen.value = e.matches
  // Reset state when switching into large screens
  if (isLargeScreen.value) {
    isMenuVisible.value = true
    lastY.value = window.scrollY || 0
  }
}

const onResize = () => {
  lastY.value = window.scrollY || 0
}

const addListeners = () => {
  window.addEventListener('scroll', onScroll, { passive: true })
  window.addEventListener('resize', onResize, { passive: true })
}

const removeListeners = () => {
  window.removeEventListener('scroll', onScroll)
  window.removeEventListener('resize', onResize)
  if (mql) mql.removeEventListener('change', onMediaChange)
}

onMounted(() => {
  mql = window.matchMedia(MEDIA_QUERY)
  isLargeScreen.value = mql.matches
  mql.addEventListener('change', onMediaChange)

  lastY.value = window.scrollY || 0
  addListeners()
})

onBeforeUnmount(removeListeners)

// Optional: when navigating to a new route, reveal the menu
const route = useRoute()
watch(() => route.fullPath, () => {
  isMenuVisible.value = true
  lastY.value = window.scrollY || 0
})
</script>

<style lang="scss">
.default-layout {
  width: 100svw;
  min-height: calc(100svh - 69px);
  padding-bottom: 69px;

  .sticky-top {
    position: sticky;
    top: 0;
    z-index: 50;
  }

  /* Smooth slide animation */
  .topbar {
    transition: transform 0.25s ease, opacity 0.25s ease;
    will-change: transform, opacity;
  }
}

footer {
  position: fixed;
  bottom: 0;
  width: 100%;
  /* Height of the footer*/
  height: fit-content;
  background: grey;
}

@media (min-width: $laptop-breakpoint) {
  header {
    display: block;
  }

  .topbar {
    margin-bottom: 32px;
  }

  .topbar.is-hidden {
    transform: translateY(-100%);
    opacity: 0.85; /* optional */
  }
}
</style>
