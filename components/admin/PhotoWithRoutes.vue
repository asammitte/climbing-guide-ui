<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue'

type Point = [number, number]
type Polyline = Point[]
type RouteItem = {
  id: number
  name: string
  grade?: string | null
  color?: string
  geometry: { segments: Polyline[]; style?: { widthPx?: number } }
}

const BOX_W = 1024
const BOX_H = 768

const props = withDefaults(defineProps<{
  photoUrl: string
  routes: RouteItem[]
  activeRouteId?: number | null
  showAnchors?: boolean
  anchorRadiusPx?: number
}>(), {
  activeRouteId: null,
  showAnchors: true,
  anchorRadiusPx: 5
})

/* ------------ paths ------------- */
const paths = computed(() =>
  props.routes.flatMap(r =>
    r.geometry.segments.map(seg => ({
      routeId: r.id,
      d: `M ${seg.map(p => p.join(' ')).join(' L ')}`,
      color: r.color ?? '#FF0000',
      widthPx: r.geometry.style?.widthPx ?? 6
    }))
  )
)

/* ------------ anchors (all vertices) ------------- */
type AnchorMeta = { routeId: number; color: string; p: Point }
const anchors = computed<AnchorMeta[]>(() => {
  const out: AnchorMeta[] = []
  for (const r of props.routes) {
    const color = r.color ?? '#FF0000'
    for (const seg of r.geometry.segments) {
      for (const p of seg) out.push({ routeId: r.id, color, p })
    }
  }
  return out
})

/* ------------ keep circle size ~constant on screen ------------- */
const svgRef = ref<SVGSVGElement | null>(null)
const rUnits = ref(4) // circle radius in SVG units (derived from px)
const strokeUnits = ref(2)

function updateUnits() {
  const svg = svgRef.value
  if (!svg) return
  const rect = svg.getBoundingClientRect()
  const unitsPerPx = BOX_W / rect.width // uniform scale with meet
  rUnits.value = Math.max(2, Math.round(unitsPerPx * props.anchorRadiusPx))
  strokeUnits.value = Math.max(1, Math.round(rUnits.value / 2))
}

onMounted(() => {
  updateUnits()
  window.addEventListener('resize', updateUnits)
})
onUnmounted(() => {
  window.removeEventListener('resize', updateUnits)
})
</script>

<template>
  <svg
    ref="svgRef"
    class="stage"
    :viewBox="`0 0 ${BOX_W} ${BOX_H}`"
    preserveAspectRatio="xMidYMid meet"
  >
    <!-- 4:3 black background -->
    <rect :width="BOX_W" :height="BOX_H" fill="black" />

    <!-- Letterboxed image -->
    <image
      :href="photoUrl"
      x="0" y="0" :width="BOX_W" :height="BOX_H"
      preserveAspectRatio="xMidYMid meet"
    />

    <!-- Routes -->
    <g>
      <path
        v-for="(p, i) in paths"
        :key="i"
        :d="p.d"
        fill="none"
        :stroke="p.color"
        :stroke-width="(activeRouteId && activeRouteId === p.routeId) ? p.widthPx * 1.75 : p.widthPx"
        :opacity="activeRouteId && activeRouteId !== p.routeId ? 0.25 : 0.95"
        stroke-linecap="round" stroke-linejoin="round"
        vector-effect="non-scaling-stroke"
      />
    </g>

    <!-- Anchors (all vertices) -->
    <g v-if="showAnchors">
      <circle
        v-for="a in anchors"
        :key="`${a.routeId}-${a.p[0]}-${a.p[1]}`"
        :cx="a.p[0]" :cy="a.p[1]"
        :r="rUnits"
        fill="#ffffff"
        :stroke="a.color"
        :stroke-width="strokeUnits"
        vector-effect="non-scaling-stroke"
        :opacity="activeRouteId && activeRouteId !== a.routeId ? 0.25 : 0.95"
      />
    </g>
  </svg>
</template>

<style scoped>
.stage { display: block; width: 100%; height: auto; }
</style>
