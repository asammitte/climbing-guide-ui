<template>
  <div class="ed">
    <div class="toolbar">
      <label title="Enable snapping">
        <input type="checkbox" v-model="snapEnabled" />
        Snap to anchors
      </label>
      <button @click="undoLast" :disabled="!draft.length">Undo</button>
      <button @click="cancelDraft" :disabled="!draft.length">Cancel</button>
      <button @click="clearInitial" :disabled="!canClearInitial">Clear current path</button>
      <div class="hint">Alt = ignore snap · Shift = trace between two anchors</div>
    </div>

    <svg
      ref="svgRef"
      class="stage"
      :viewBox="`0 0 ${BOX_W} ${BOX_H}`"
      preserveAspectRatio="xMidYMid meet"
      @click.prevent="onSvgClick"
      @pointermove="onPointerMove"
      @pointerleave="onPointerLeave"
    >
      <!-- 4:3 black background -->
      <rect :width="BOX_W" :height="BOX_H" fill="black" />

      <!-- letterboxed image -->
      <image
        :href="photoUrl"
        x="0" y="0" :width="BOX_W" :height="BOX_H"
        preserveAspectRatio="xMidYMid meet"
      />

      <!-- existing overlays (for context/snap) -->
      <g>
        <template v-for="(g, gi) in groups" :key="gi">
          <path v-for="(seg, i) in g.polylines" :key="i"
                :d="`M ${seg.map(p => p.join(' ')).join(' L ')}`"
                fill="none" :stroke="g.color"
                :stroke-width="g.widthPx"
                stroke-linecap="round" stroke-linejoin="round"
                opacity="0.55" vector-effect="non-scaling-stroke" />
        </template>
      </g>

      <!-- persistent ANCHOR circles on all vertices (overlays + initialSegments) -->
      <g>
        <circle
          v-for="a in anchors"
          :key="`${a.group}-${a.polyIdx}-${a.idx}`"
          :cx="a.p[0]" :cy="a.p[1]"
          :r="rUnits"
          fill="#ffffff"
          :stroke="a.color"
          :stroke-width="Math.max(1, Math.round(rUnits/2))"
          vector-effect="non-scaling-stroke"
          opacity="0.95"
        />
      </g>

      <!-- hover halo on nearest anchor within tolerance -->
      <circle
        v-if="hotAnchor"
        :cx="hotAnchor.p[0]" :cy="hotAnchor.p[1]"
        :r="haloUnits"
        fill="none"
        stroke="#ffd54f"
        :stroke-width="Math.max(2, Math.round(rUnits/2))"
        vector-effect="non-scaling-stroke"
        opacity="0.9"
      />

      <!-- GHOST “next point” preview (where a click will place a vertex) -->
      <circle
        v-if="cursorPt"
        :cx="cursorPt[0]" :cy="cursorPt[1]"
        :r="rUnits"
        fill="#ffffff"
        :stroke="draftColor"
        :stroke-width="Math.max(1, Math.round(rUnits/2))"
        vector-effect="non-scaling-stroke"
        opacity="0.95"
      />

      <!-- DRAFT being drawn -->
      <path v-if="draft.length"
            :d="draftPath"
            fill="none" :stroke="draftColor"
            stroke-linecap="round" stroke-linejoin="round"
            :stroke-width="draftWidthPx"
            vector-effect="non-scaling-stroke" />
      <g v-if="draft.length">
        <circle v-for="(p, i) in draft" :key="i"
                :cx="p[0]" :cy="p[1]" :r="rUnits"
                fill="#fff" :stroke="draftColor"
                :stroke-width="Math.max(1, Math.round(rUnits/2))"
                vector-effect="non-scaling-stroke" />
      </g>
    </svg>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref, watch } from 'vue'

/** Basic geometry types */
type Point = [number, number]
type Polyline = Point[]

/** What you pass to render existing content (for snapping/anchors/preview) */
type Overlay = {
  polylines: Polyline[]
  color?: string
  widthPx?: number
}

/** --- Props --- */
const props = withDefaults(defineProps<{
  photoUrl: string

  /** Other routes (or any geometry) to show for context + snapping */
  overlays?: Overlay[]

  /** Existing segments of the route being edited (read-only preview, can be cleared) */
  initialSegments?: Polyline[]

  /** Visual style for the current draft line */
  draftColor?: string
  draftWidthPx?: number

  /** Anchor & snapping visuals/behavior */
  snapPx?: number            // px tolerance for snapping to anchors
  anchorRadiusPx?: number    // anchor circle radius in px
  haloRadiusPx?: number      // hover halo radius in px
}>(), {
  overlays: () => [],
  initialSegments: () => [],
  draftColor: '#00C853',
  draftWidthPx: 6,
  snapPx: 10,
  anchorRadiusPx: 5,
  haloRadiusPx: 10
})

/** What this component emits */
const emit = defineEmits<{
  (e: 'clear'): void
}>()

/** Fixed box (your 4:3 coordinate space). If needed, you can expose as props later. */
const BOX_W = 1024
const BOX_H = 768

const svgRef = ref<SVGSVGElement | null>(null)
const draft = ref<Polyline>([])
const drawing = ref(false)
const snapEnabled = ref(true)

/** ---- helpers: coords & scale ---- */
function toBox(e: PointerEvent): Point | null {
  const svg = svgRef.value; if (!svg) return null
  const pt = svg.createSVGPoint(); pt.x = e.clientX; pt.y = e.clientY
  const ctm = svg.getScreenCTM(); if (!ctm) return null
  const g = pt.matrixTransform(ctm.inverse())
  const x = Math.min(Math.max(0, Math.round(g.x)), BOX_W)
  const y = Math.min(Math.max(0, Math.round(g.y)), BOX_H)
  return [x, y]
}
function unitsPerPx(svg: SVGSVGElement): number {
  const rect = svg.getBoundingClientRect()
  return BOX_W / rect.width
}
const rUnits = ref(4)
const haloUnits = ref(8)
function updateUnits() {
  const svg = svgRef.value; if (!svg) return
  const upp = unitsPerPx(svg)
  rUnits.value = Math.max(2, Math.round(upp * props.anchorRadiusPx))
  haloUnits.value = Math.max(rUnits.value + 1, Math.round(upp * props.haloRadiusPx))
}

/** ---- local visibility state for initialSegments ---- */
const showInitial = ref(true)
const canClearInitial = computed(() => showInitial.value && props.initialSegments.length > 0)

/** When parent updates initialSegments (e.g., after save), show them again */
watch(() => props.initialSegments, () => {
  showInitial.value = props.initialSegments.length > 0
}, { deep: true })

/** ---- unify overlays + initialSegments into "groups" for rendering/anchors ---- */
const groups = computed(() => {
  const arr = (props.overlays ?? []).map(o => ({
    color: o.color ?? '#888',
    widthPx: o.widthPx ?? 6,
    polylines: o.polylines ?? []
  }))
  if (showInitial.value && props.initialSegments.length) {
    arr.push({ color: props.draftColor, widthPx: props.draftWidthPx, polylines: props.initialSegments })
  }
  return arr
})

/** ---- anchors (all vertices from every group) ---- */
type AnchorMeta = { group: number; polyIdx: number; idx: number; p: Point; color: string }
const anchors = computed<AnchorMeta[]>(() => {
  const out: AnchorMeta[] = []
  groups.value.forEach((g, gi) => {
    g.polylines.forEach((poly, pi) => {
      poly.forEach((p, idx) => out.push({ group: gi, polyIdx: pi, idx, p, color: g.color }))
    })
  })
  return out
})

function nearestAnchor(p: Point, tolUnits: number): AnchorMeta | null {
  let best: { a: AnchorMeta, d2: number } | null = null
  for (const a of anchors.value) {
    const dx = p[0] - a.p[0], dy = p[1] - a.p[1]
    const d2 = dx*dx + dy*dy
    if (d2 <= tolUnits*tolUnits && (!best || d2 < best.d2)) best = { a, d2 }
  }
  return best?.a ?? null
}

const hotAnchor = ref<AnchorMeta | null>(null)
/** Cursor ghost point (snap-aware) */
const cursorPt = ref<Point | null>(null)

function onPointerMove(e: PointerEvent) {
  const svg = svgRef.value; if (!svg) return
  const raw = toBox(e); if (!raw) { cursorPt.value = null; hotAnchor.value = null; return }
  const tolUnits = unitsPerPx(svg) * props.snapPx
  const near = nearestAnchor(raw, tolUnits)
  hotAnchor.value = near
  // If snapping is enabled and not bypassed with Alt, “ghost” to the nearest anchor.
  const shouldSnap = snapEnabled.value && !e.altKey
  cursorPt.value = (shouldSnap && near) ? near.p : raw
}

function onPointerLeave() {
  hotAnchor.value = null
  cursorPt.value = null
}

/** ---- tracing between two anchors on the SAME polyline ---- */
function sliceBetween(poly: Polyline, aIdx: number, bIdx: number): Polyline {
  if (aIdx <= bIdx) return poly.slice(aIdx, bIdx + 1)
  const out: Polyline = []
  for (let i = aIdx; i >= bIdx; i--) out.push(poly[i])
  return out
}

let lastSnapAnchor: AnchorMeta | null = null

/** ---- drawing flow ---- */
function onSvgClick(e: PointerEvent) {
  const raw = toBox(e); if (!raw) return

  // Alt = ignore snap
  const svg = svgRef.value!
  const tolUnits = unitsPerPx(svg) * props.snapPx
  const snap = (!snapEnabled.value || e.altKey) ? null : nearestAnchor(raw, tolUnits)
  const p: Point = snap ? snap.p : raw

  if (!drawing.value) {
    drawing.value = true
    draft.value = [p]
    lastSnapAnchor = snap
    return
  }

  // Shift+click → trace exactly between two anchors on the same polyline
  if (e.shiftKey && lastSnapAnchor && snap) {
    if (snap.group === lastSnapAnchor.group && snap.polyIdx === lastSnapAnchor.polyIdx) {
      const poly = groups.value[snap.group].polylines[snap.polyIdx]
      const seg = sliceBetween(poly, lastSnapAnchor.idx, snap.idx)
      draft.value = draft.value.concat(seg.slice(1)) // skip duplicated first point
      lastSnapAnchor = snap
      return
    }
  }

  // Normal point add
  draft.value = draft.value.concat([p])
  lastSnapAnchor = snap
}

function undoLast() {
  if (!drawing.value) return
  draft.value = draft.value.slice(0, -1)
  if (draft.value.length === 0) { drawing.value = false; lastSnapAnchor = null }
}
function cancelDraft() {
  drawing.value = false
  lastSnapAnchor = null
  draft.value = []
}
function clearInitial() {
  // hide current initialSegments locally, reset draft, and let parent know
  cancelDraft()
  showInitial.value = false
  emit('clear')
}

/** ---- keyboard shortcuts ---- */
function onKey(e: KeyboardEvent) {
  if (e.key === 'Escape') { cancelDraft(); e.preventDefault() }
  if (e.key === 'Backspace') { undoLast(); e.preventDefault() }
}

onMounted(() => {
  window.addEventListener('keydown', onKey)
  window.addEventListener('resize', updateUnits)
  updateUnits()
})

onUnmounted(() => {
  window.removeEventListener('keydown', onKey)
  window.removeEventListener('resize', updateUnits)
})

/** ---- render helper ---- */
const draftPath = computed(() =>
  draft.value.length ? `M ${draft.value.map(p => p.join(' ')).join(' L ')}` : ''
)

/** Export the "current" segments:
 * - if user is drawing: return the draft
 * - else: return initialSegments (if any & visible)
 */
 function exportSegments(): Polyline[] {
  if (draft.value.length >= 2) return [draft.value.slice()]
  if (showInitial.value && props.initialSegments.length)
    return props.initialSegments.map(p => p.slice())
  return []
}

defineExpose({
  /** parent (form) can call this before submit */
  exportSegments,
  /** optionally expose some helpers if you want */
  hasDraft: computed(() => draft.value.length >= 2),
  clearDraft: cancelDraft
})
</script>

<style scoped>
.ed {
  max-width: 960px;
  margin: 20px auto 0 auto;
  padding: 0;
  width: 100%;
}
.toolbar { display: flex; flex-wrap: wrap; gap: 10px; align-items: center; margin-bottom: 10px; font-size: 14px; }
.toolbar input { padding: 6px 8px; border: 1px solid #ccc; border-radius: 4px; }
.toolbar button { padding: 6px 10px; border: 1px solid #bbb; border-radius: 4px; background: #fafafa; cursor: pointer; }
.toolbar button:disabled { opacity: 0.5; cursor: default; }
.hint { color: #666; font-size: 12px; margin-left: 8px; }
.stage { display: block; width: 100%; height: auto; }
</style>
