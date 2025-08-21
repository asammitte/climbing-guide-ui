<template>
  <div ref="wrap" class="rs-wrap" @mouseleave="$emit('leave')">
    <table class="rs-table">
      <thead ref="theadRef">
        <tr>
          <th>#</th>
          <th class="col-name">{{ t('routeName') }}</th>
          <th class="col-grade">{{ t('grade') }}</th>
          <th>{{ t('anchors') }}</th>
          <th>{{ t('ascents') }}</th>
          <th>{{ t('videos') }}</th>
        </tr>
      </thead>
      <tbody ref="tbodyRef">
        <tr
          v-for="r in routes"
          :key="r.id"
          :data-id="r.id"
          :class="{ 'is-active': r.id === activeRouteId }"
          @mouseenter="$emit('hover', r.id)"
          @click="$emit('select', r.id)"
        >
          <td>{{ r.position }}</td>
          <td class="col-name">{{ r.name }}</td>
          <td class="col-grade">{{ r.difficulty }}</td>
          <td>{{ r.boltsAmount ?? '-' }}</td>
          <td>{{ r.totalAscents ?? 0 }}</td>
          <td>{{ r.totalVideos ?? 0 }}</td>
        </tr>

        <!-- MOBILE-ONLY spacer so last row can reach the header; hidden on desktop -->
        <tr v-if="!isDesktop" class="rs-spacer" aria-hidden="true">
          <td :colspan="colspan">
            <div :style="{ height: spacerHeight + 'px' }"></div>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>


<script setup lang="ts">
import { onMounted, onUnmounted, ref, watch, nextTick } from 'vue'
import type { IRoutesListItem } from '~/types/routes/IRoutesListItem'

const props = defineProps<{
  routes: IRoutesListItem[]
  activeRouteId: number | null
}>()
const emit = defineEmits<{
  (e: 'hover', id: number): void
  (e: 'leave'): void
  (e: 'select', id: number): void
  (e: 'active-change', id: number): void
}>()

const { t } = useI18n({
  useScope: 'local',
  messages: {
    en: { anchors: 'Anchors', ascents: 'Ascents', grade: 'Grade', routeName: 'Name', videos: 'Videos' },
    ua: { anchors: 'Кількість точок', ascents: 'Пролази', grade: 'Категорія', routeName: 'Назва', videos: 'Відео' }
  }
})

const wrap = ref<HTMLDivElement | null>(null)
const theadRef = ref<HTMLTableSectionElement | null>(null)
const tbodyRef = ref<HTMLTableSectionElement | null>(null)

/** ---- desktop detection ---- */
const isDesktop = ref(false)
let mql: MediaQueryList | null = null
function updateDesktop() { isDesktop.value = !!mql?.matches }

/** ---- IO & spacer state (mobile only) ---- */
let io: IntersectionObserver | null = null
let raf = 0
const visRatio = new Map<number, number>()

const spacerHeight = ref(0)
const colspan = ref(6)
let wrapRO: ResizeObserver | null = null
let headRO: ResizeObserver | null = null
const EPS = 1

/** ---- scroll source flags (mobile only) ---- */
let pendingFromScrollId: number | null = null
let isUserScrolling = false
let scrollTimer: number | null = null

/** ---------- helpers (mobile only) ---------- */
const HIDE_IF_HEADER_COVERS_RATIO = 0.05

function lastDataRow(): HTMLTableRowElement | null {
  const tb = tbodyRef.value
  if (!tb) return null
  const rows = tb.querySelectorAll<HTMLTableRowElement>('tr[data-id]')
  return rows.length ? rows[rows.length - 1] : null
}

function computeDesiredMax(): number {
  const el = wrap.value, row = lastDataRow()
  if (!el || !row) return 0
  const headerH = theadRef.value?.getBoundingClientRect().height ?? 0
  const elRect = el.getBoundingClientRect()
  const rowTopContentY = row.getBoundingClientRect().top - elRect.top + el.scrollTop
  return Math.max(0, Math.round(rowTopContentY - headerH))
}

function recalcSpacer() {
  if (isDesktop.value) { spacerHeight.value = 0; return }
  const el = wrap.value; if (!el) return
  const desiredMax = computeDesiredMax()
  const currentMax = el.scrollHeight - el.clientHeight
  const need = Math.max(0, desiredMax - currentMax)
  spacerHeight.value = need
  if (el.scrollTop > desiredMax + EPS) el.scrollTop = desiredMax
}

function attachObservers() {
  if (isDesktop.value) return
  detachObservers()

  if (wrap.value) {
    wrapRO = new ResizeObserver(() => { recalcSpacer(); pickMostVisibleManual() })
    wrapRO.observe(wrap.value)
  }
  if (theadRef.value) {
    headRO = new ResizeObserver(() => { recalcSpacer(); pickMostVisibleManual() })
    headRO.observe(theadRef.value)
  }
  window.addEventListener('resize', onWindowResize, { passive: true })
}
function detachObservers() {
  wrapRO?.disconnect(); wrapRO = null
  headRO?.disconnect(); headRO = null
  window.removeEventListener('resize', onWindowResize)
}
function onWindowResize() { recalcSpacer(); pickMostVisibleManual() }

function onUserScroll() {
  if (isDesktop.value) return
  isUserScrolling = true
  if (scrollTimer) window.clearTimeout(scrollTimer)
  scrollTimer = window.setTimeout(() => { isUserScrolling = false }, 120)
  const el = wrap.value
  if (el) {
    const desiredMax = computeDesiredMax()
    if (el.scrollTop > desiredMax + EPS) el.scrollTop = desiredMax
  }
  pickMostVisibleManual()
}

function thresholds() { return Array.from({ length: 21 }, (_, i) => i / 20) }
function pickMostVisibleManual() {
  if (isDesktop.value) return
  cancelAnimationFrame(raf)
  raf = requestAnimationFrame(() => {
    const el = wrap.value, tb = tbodyRef.value
    if (!el || !tb) return
    const rootRect = el.getBoundingClientRect()
    const headerH = theadRef.value?.getBoundingClientRect().height ?? 0
    const topBoundary = rootRect.top + headerH
    const bottomBoundary = rootRect.bottom

    const rows = Array.from(tb.querySelectorAll<HTMLTableRowElement>('tr[data-id]'))
    if (!rows.length) return

    let bestId = 0, bestScore = -1
    for (const row of rows) {
      const rr = row.getBoundingClientRect()
      const id = Number(row.dataset.id)
      if (!id) continue

      const hiddenUnderHeader = Math.max(0, topBoundary - rr.top)
      const hiddenRatio = hiddenUnderHeader / rr.height
      if (hiddenRatio >= HIDE_IF_HEADER_COVERS_RATIO) continue

      const visTop = Math.max(rr.top, topBoundary)
      const visBot = Math.min(rr.bottom, bottomBoundary)
      const visH = Math.max(0, visBot - visTop)
      const ratio = visH / rr.height

      if (ratio > bestScore) { bestScore = ratio; bestId = id }
    }

    if (bestId && bestId !== props.activeRouteId) {
      pendingFromScrollId = bestId
      emit('active-change', bestId)
    }
  })
}

function setupIO() {
  if (isDesktop.value) return
  cleanupIO()
  const root = wrap.value
  if (!root) return
  io = new IntersectionObserver((entries) => {
    for (const e of entries) {
      const row = e.target as HTMLTableRowElement
      const id = Number(row.dataset.id)
      if (id) visRatio.set(id, e.intersectionRatio)
    }
    pickMostVisibleManual()
  }, { root, threshold: thresholds(), rootMargin: '-4px 0px 0px 0px' })

  const rows = tbodyRef.value?.querySelectorAll<HTMLTableRowElement>('tr[data-id]')
  rows?.forEach(r => io!.observe(r))
  pickMostVisibleManual()
}
function cleanupIO() { if (io) io.disconnect(); io = null; visRatio.clear() }

/** Keep active row visible (mobile only) */
function scrollActiveIntoView(center = false) {
  if (isDesktop.value) return
  const el = wrap.value, tb = tbodyRef.value
  if (!el || !tb || !props.activeRouteId) return
  const tr = tb.querySelector<HTMLTableRowElement>(`tr[data-id="${props.activeRouteId}"]`)
  if (!tr) return

  const headerH = theadRef.value?.getBoundingClientRect().height ?? 0
  if (center) {
    const viewportH = el.clientHeight - headerH
    const targetTop = tr.offsetTop - (headerH + Math.max(0, (viewportH - tr.offsetHeight) / 2))
    el.scrollTo({ top: Math.max(0, Math.round(targetTop)), behavior: 'smooth' })
    return
  }
  const top = tr.offsetTop, bottom = top + tr.offsetHeight
  const viewTop = el.scrollTop + headerH
  const viewBottom = el.scrollTop + el.clientHeight
  if (top < viewTop)      el.scrollTo({ top: Math.max(0, top - headerH - 2), behavior: 'auto' })
  else if (bottom > viewBottom) el.scrollTo({ top: Math.max(0, bottom - el.clientHeight + 2), behavior: 'auto' })
}

/** ---- lifecycle ---- */
onMounted(() => {
  colspan.value = theadRef.value?.querySelectorAll('th').length || colspan.value
  if (typeof window !== 'undefined') {
    mql = window.matchMedia('(min-width: 1024px)')
    mql.addEventListener('change', updateDesktop)
    updateDesktop()
  }

  if (!isDesktop.value) {
    attachObservers()
    recalcSpacer()
    wrap.value?.addEventListener('scroll', onUserScroll, { passive: true })
    setupIO()
    nextTick(() => { pickMostVisibleManual(); scrollActiveIntoView(false) })
  }
})

onUnmounted(() => {
  mql?.removeEventListener('change', updateDesktop)
  cleanupIO()
  detachObservers()
  wrap.value?.removeEventListener('scroll', onUserScroll)
  cancelAnimationFrame(raf)
  if (scrollTimer) window.clearTimeout(scrollTimer)
})

/** ---- reactiveness ---- */
watch(isDesktop, async (now, prev) => {
  await nextTick()
  if (now === prev) return
  if (now) {
    // switched to desktop → tear down mobile logic
    cleanupIO()
    detachObservers()
    wrap.value?.removeEventListener('scroll', onUserScroll)
    spacerHeight.value = 0
  } else {
    // switched to mobile → restore logic
    attachObservers()
    recalcSpacer()
    wrap.value?.addEventListener('scroll', onUserScroll, { passive: true })
    setupIO()
    nextTick(() => { pickMostVisibleManual(); scrollActiveIntoView(false) })
  }
})

watch(() => props.routes, async () => {
  await nextTick()
  if (!isDesktop.value) {
    recalcSpacer()
    setupIO() // re-observe rows
    pickMostVisibleManual()
    scrollActiveIntoView(false)
  }
})

watch(() => props.activeRouteId, async (newId) => {
  await nextTick()
  if (isDesktop.value) return
  if (pendingFromScrollId === newId || isUserScrolling) {
    pendingFromScrollId = null
    return
  }
  scrollActiveIntoView(true)
})
</script>


<style scoped lang="scss">
.rs-wrap { overflow: auto; -webkit-overflow-scrolling: touch; }
.rs-table { width: 100%; border-collapse: collapse; font-size: 14px; }
.rs-table thead th {
  position: sticky; top: 0; background: #f7f9fb; z-index: 1;
  text-align: left; font-weight: 600; padding: 10px 8px; border-bottom: 1px solid #e6ecf1;
}
.rs-table tbody td { padding: 10px 8px; border-bottom: 1px solid #f0f3f6; }

.col-name { font-weight: 600; }
.col-grade { display: none; }     /* Mobile-first: hide grade */

tbody tr { cursor: pointer; }
tbody tr.is-active { background: #e7f7ee; }
tbody tr:hover { background: #f3f7fb; }

/* Spacer visuals */
.rs-spacer td { padding: 0; border: 0; }
.rs-spacer div { width: 1px; }

/* Desktop: let page scroll; no inner scrollbox; no mobile tricks */
@media (min-width: 1024px) {
  .rs-wrap { overflow: visible; }
  .col-grade { display: table-cell; }
}
</style>
