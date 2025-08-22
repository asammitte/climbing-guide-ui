<template>
  <div
    class="sector-page"
    @touchstart.passive="onTouchStart"
    @touchmove.passive="onTouchMove"
    @touchend.passive="onTouchEnd"
    @touchcancel.passive="onTouchCancel"
  >
    <!-- TOP: photo + overlays (clipped for slide) -->
    <div class="stage-clip swap-clip">
      <Transition :name="transitionName" mode="out-in">
        <SectorRoutesStage
          v-if="activePhoto"
          :key="activePhoto.imageId"
          class="stage"
          :photo-url="activePhoto.imageUrl"
          :routes="activePhoto.routesStage"
          :active-route-id="activeRouteId"
          @hover="onHoverRoute"
          @select="onSelectRoute"
        />
      </Transition>
    </div>

    <!-- MIDDLE: bullets (photos pager) -->
    <PhotoDots
      v-if="photos.length > 1"
      class="photo-dots"
      :total="photos.length"
      :current-index="activePhotoIndex"
      @go="goByDots"
    />

    <!-- BOTTOM: scrollable table (clipped for slide) -->
    <div class="table-swap-clip swap-clip">
      <Transition :name="transitionName" mode="out-in">
        <RoutesScrollableTable
          v-if="activePhoto"
          :key="'tbl-' + activePhoto.imageId"
          class="routes-table"
          :routes="activePhoto.routesTable"
          :active-route-id="activeRouteId"
          @hover="onHoverRoute"
          @leave="onLeaveRoute"
          @select="onSelectRoute"
          @active-change="onActiveFromTable"
        />
      </Transition>
    </div>

    <loading-status
      v-if="sectorRoutesStatus !== 'success'"
      :status="sectorRoutesStatus"
    />
  </div>
</template>


<script setup lang="ts">
import { computed, ref, watch, onUnmounted } from 'vue'
import { useAsyncData, useNuxtApp, useRoute, useHead } from '#app'
import LoadingStatus from '~/components/common/LoadingStatus.vue'
import SectorRoutesStage from '~/components/sectors/SectorRoutesStage.vue'
import PhotoDots from '~/components/sectors/PhotoDots.vue'
import RoutesScrollableTable from '~/components/sectors/RoutesScrollableTable.vue'
import type { IRoutesListItem } from '~/types/routes/IRoutesListItem'

useHead({ title: 'Sector' })

const { $api } = useNuxtApp()
const route = useRoute()
const sectorId = +route.params.sectorId

const { data: sectorRoutesAsync, status: sectorRoutesStatus } = await useAsyncData(
  `sectorRoutes:${sectorId}`,
  async () => {
    const res = await $api.routes.getAll(sectorId)
    return res
  },
)

type PhotoBucket = {
  imageId: number
  imageUrl: string
  routesStage: IRoutesListItem[]
  routesTable: IRoutesListItem[]
}

const allRoutes = computed<IRoutesListItem[]>(() => sectorRoutesAsync.value?.items ?? [])

function byPosThenName(a: IRoutesListItem, b: IRoutesListItem) {
  return (a.position - b.position) || a.name.localeCompare(b.name)
}

const photos = computed<PhotoBucket[]>(() => {
  const map = new Map<number, { imageUrl: string; routes: IRoutesListItem[] }>()
  const noImage: IRoutesListItem[] = []

  // Split routes into “with image” buckets vs “no image”
  for (const r of allRoutes.value) {
    if (r.imageId == null) {
      noImage.push(r)
      continue
    }
    const entry = map.get(r.imageId) ?? { imageUrl: r.imageUrl || '', routes: [] }
    if (!entry.imageUrl && r.imageUrl) entry.imageUrl = r.imageUrl
    entry.routes.push(r)
    map.set(r.imageId, entry)
  }

  // Build initial buckets (stage+table equal for now) and sort by earliest position
  let buckets = Array.from(map.entries()).map(([imageId, v]) => {
    const stageSorted = v.routes.slice().sort(byPosThenName)
    return {
      imageId,
      imageUrl: v.imageUrl || (stageSorted[0]?.imageUrl ?? ''),
      routesStage: stageSorted,
      routesTable: stageSorted.slice(), // will inject no-image later
      _start: stageSorted[0]?.position ?? Number.MAX_SAFE_INTEGER,
    }
  })

  // No photos? Nothing to place into – bail out (UI already guards on activePhoto)
  if (buckets.length === 0) return []

  // Order photos by their starting position
  buckets.sort((a, b) => a._start - b._start)

  // Compute photo start markers (ascending)
  const starts = buckets.map(b => b._start)

  // Partition no-image routes
  const preFirst: IRoutesListItem[] = []
  const postLast: IRoutesListItem[] = []
  const between: IRoutesListItem[][] = buckets.map(() => [])

  noImage.sort(byPosThenName).forEach(r => {
    const p = r.position
    if (p < starts[0]) {
      preFirst.push(r)            // prepend to first table
    } else if (p >= starts[starts.length - 1]) {
      postLast.push(r)           // append to last table
    } else {
      // find i such that starts[i] ≤ p < starts[i+1]
      let i = 0
      for (let k = 0; k < starts.length - 1; k++) {
        if (p >= starts[k] && p < starts[k + 1]) { i = k; break }
      }
      between[i].push(r)         // insert into table i by position
    }
  })

  // Inject into tables
  for (let i = 0; i < buckets.length; i++) {
    const b = buckets[i]
    const addMid = between[i].slice().sort(byPosThenName)

    if (i === 0) {
      // prepend preFirst (keep their order), then merge rest by position
      const merged = b.routesTable.slice().concat(addMid)
      merged.sort(byPosThenName)
      b.routesTable = preFirst.concat(merged)
    } else if (i === buckets.length - 1) {
      // merge middles by position, then append postLast regardless of position
      const merged = b.routesTable.slice().concat(addMid)
      merged.sort(byPosThenName)
      b.routesTable = merged.concat(postLast)
    } else {
      // middle buckets: just merge by position
      const merged = b.routesTable.slice().concat(addMid)
      merged.sort(byPosThenName)
      b.routesTable = merged
    }
  }

  // Strip helper
  return buckets.map(({ _start, ...rest }) => rest)
})

const activePhotoIndex = ref(0)
const activePhoto = computed(() => photos.value[activePhotoIndex.value] ?? null)
const activeRouteId = ref<number | null>(null)

/** ---- Slide transition direction (left when going forward, right when going back) ---- */
const transitionDir = ref<'left'|'right'>('left')
const transitionName = computed(() => transitionDir.value === 'left' ? 'slide-left' : 'slide-right')

function setPhotoIndex(nextIndex: number) {
  const prev = activePhotoIndex.value
  const clamped = Math.min(Math.max(0, nextIndex), photos.value.length - 1)
  transitionDir.value = clamped > prev ? 'left' : 'right'
  activePhotoIndex.value = clamped
}

function goByDots(i: number) {
  const prev = activePhotoIndex.value
  transitionDir.value = i > prev ? 'left' : 'right'
  setPhotoIndex(i)
}

watch(activePhoto, (p) => {
  if (!p) return
  if (!p.routesTable.length) { activeRouteId.value = null; return }
  if (activeRouteId.value && p.routesTable.some(r => r.id === activeRouteId.value)) return
  activeRouteId.value = p.routesTable[0].id
})

function onHoverRoute(id: number | null) { activeRouteId.value = id ?? activeRouteId.value }
function onLeaveRoute() {}
function onSelectRoute(id: number) { activeRouteId.value = id }
function onActiveFromTable(id: number) { activeRouteId.value = id }

/** ---- Mobile swipe on the Stage area ---- */
type Pt = { x: number; y: number; t: number }
let start: Pt | null = null
const SWIPE_PX = 50
const SWIPE_SLOPE = 1.2
const SWIPE_TIME = 600

function onTouchStart(e: TouchEvent) {
  if (e.touches.length !== 1) return;   // ignore pinch/second finger
  const t = e.touches[0];
  start = { x: t.clientX, y: t.clientY, t: Date.now() };
}

function onTouchMove(_e: TouchEvent) { /* passive; keep vertical scroll natural */ }
function onTouchEnd(e: TouchEvent) {
  if (!start || photos.value.length <= 1) { start = null; return }
  const t = e.changedTouches[0]; if (!t) { start = null; return }
  const dt = Date.now() - start.t
  const dx = t.clientX - start.x
  const dy = t.clientY - start.y
  const absX = Math.abs(dx), absY = Math.abs(dy)
  const horizontalEnough = absX >= SWIPE_PX && absX > absY * SWIPE_SLOPE
  const fastEnough = dt <= SWIPE_TIME || absX >= SWIPE_PX * 1.5
  if (horizontalEnough && fastEnough) {
    if (dx < 0) setPhotoIndex(activePhotoIndex.value + 1) // swipe left → next
    else setPhotoIndex(activePhotoIndex.value - 1)        // swipe right → prev
  }
  start = null
}
function onTouchCancel() { start = null }

/** Optional: keyboard navigation */
function onKey(e: KeyboardEvent) {
  if (!activePhoto.value) return
  if (e.key === 'ArrowLeft') setPhotoIndex(activePhotoIndex.value - 1)
  if (e.key === 'ArrowRight') setPhotoIndex(activePhotoIndex.value + 1)
  if ((e.key === 'ArrowUp' || e.key === 'ArrowDown') && activePhoto.value.routes.length) {
    const idx = activePhoto.value.routes.findIndex(r => r.id === activeRouteId.value)
    const next = e.key === 'ArrowDown' ? idx + 1 : idx - 1
    const clamped = Math.min(Math.max(0, next), activePhoto.value.routes.length - 1)
    activeRouteId.value = activePhoto.value.routes[clamped].id
  }
}
if (process.client) window.addEventListener('keydown', onKey)
onUnmounted(() => process.client && window.removeEventListener('keydown', onKey))
</script>


<style scoped lang="scss">
.sector-page {
  // display: flex;
  // flex-direction: column;
  // overflow-x: clip;      /* guard against accidental horizontal scroll */
  // touch-action: pan-y;   /* allow vertical scrolling while we detect horizontal swipes */
  /* Fill the on-screen viewport (when bars are visible) */
  height: calc(100svh - 69px);
  min-height: calc(100svh - 69px);
  display: flex;
  flex-direction: column;
  overflow: hidden;              /* lock page scroll; children will scroll */
  overscroll-behavior: contain;  /* avoid scroll chaining / rubber banding */
  overflow-x: clip;
  touch-action: pan-y;
}

/* Clip wrappers prevent page-wide horizontal scroll during slides */
.swap-clip { position: relative; overflow: hidden; }
.stage-clip { /* alias for clarity; same as swap-clip */ }

.stage {
  width: 100%;
  aspect-ratio: 4 / 3;
  background: #000;
  overflow: hidden;
  position: relative;
}

.table-swap-clip {
  /* Let the table area take remaining height and host the inner scrollbox */
  position: relative;
  overflow: hidden;
  flex: 1;
  min-height: 0;   /* critical so the child can shrink below content height */
  display: flex;
}

// .routes-table {
//   max-height: 45vh;
//   overflow: auto;
//   border-radius: 8px;
//   background: #fff;
//   box-shadow: 0 0 0 1px rgba(0,0,0,0.06) inset;
// }
/* Make the RoutesScrollableTable’s root (rs-wrap) fill and scroll */
:deep(.rs-wrap) {
  flex: 1;
  min-height: 0;
  height: 100%;
}

/* (Optional) give the scroller safe-area padding so the last rows aren't hidden
   behind iOS home indicator when bars are visible. */
:deep(.rs-wrap) { padding-bottom: env(safe-area-inset-bottom, 0); }

/* Transition animations (direction-aware, fully clipped) */
.slide-left-enter-from  { transform: translateX(100%);  opacity: 0.01; }
.slide-left-leave-to    { transform: translateX(-100%); opacity: 0.01; }
.slide-right-enter-from { transform: translateX(-100%); opacity: 0.01; }
.slide-right-leave-to   { transform: translateX(100%);  opacity: 0.01; }
.slide-left-enter-active,
.slide-left-leave-active,
.slide-right-enter-active,
.slide-right-leave-active {
  transition: transform 260ms ease, opacity 260ms ease;
  will-change: transform, opacity; /* only during animation */
}

/* ---------- Desktop layout: table left, image right (and dots under image) ---------- */
@media (min-width: $laptop-breakpoint) {
  .sector-page {
    /* switch to grid, two columns */
    // display: grid;
    /* On desktop allow normal page scrolling again */
    height: auto;
    min-height: 0;
    overflow: visible;
    display: grid;
    grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
    grid-template-areas:
      "table stage"
      "table dots";
    gap: 12px;
    padding: 12px;
    align-items: start;
  }

  /* assign areas */
  // .table-swap-clip { grid-area: table; min-width: 0; min-height: 0; }
  .table-swap-clip { grid-area: table; min-width: 0; min-height: 0; display: block; }
  .stage-clip      { grid-area: stage; min-width: 0; min-height: 0; }
  .photo-dots      { grid-area: dots;  justify-self: center; margin: 4px 0 0 0; }

  /* give the table more vertical room on desktop */
  // .routes-table {
  //   max-height: none;   /* remove the mobile cap on desktop */
  //   overflow: visible;  /* let the page handle scrolling */
  // }
  :deep(.rs-wrap) { height: auto; overflow: visible; } /* desktop: no inner scrollbox */

  /* keep the stage nicely sized on the right */
  .stage { aspect-ratio: 4 / 3; }
}
</style>

