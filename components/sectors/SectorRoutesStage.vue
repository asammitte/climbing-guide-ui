<template>
  <svg
    class="stage-svg"
    :viewBox="`0 0 ${BOX_W} ${BOX_H}`"
    preserveAspectRatio="xMidYMid meet"
    @mouseleave="$emit('hover', null)"
  >
    <rect :width="BOX_W" :height="BOX_H" fill="black" />
    <image :href="photoUrl" x="0" y="0" :width="BOX_W" :height="BOX_H" preserveAspectRatio="xMidYMid meet" />

    <!-- All routes (dim) -->
    <g>
      <path
        v-for="r in withGeom"
        :key="`dim-${r.id}`"
        :d="r.pathD"
        fill="none"
        :stroke="inactivePathColor"
        :stroke-width="activeStrokeWidth"
        stroke-linecap="round"
        stroke-linejoin="round"
        opacity="0.55"
        vector-effect="non-scaling-stroke"
        @mouseenter="$emit('hover', r.id)"
        @click="$emit('select', r.id)"
      />
    </g>

    <!-- Active route (bright) -->
    <g v-if="active">
      <path
        :d="active.pathD"
        fill="none"
        :stroke="activePathColor"
        :stroke-width="activeStrokeWidth"
        stroke-linecap="round"
        stroke-linejoin="round"
        vector-effect="non-scaling-stroke"
      />
      <!-- Anchor vertices (nice touch) -->
      <circle
        v-for="(p, i) in active.vertices"
        :key="`v-${i}`"
        :cx="p[0]" :cy="p[1]"
        r="4" fill="#fff" :stroke="activePathColor" stroke-width="1" vector-effect="non-scaling-stroke"
      />
    </g>
  </svg>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { IRoutesListItem } from '~/types/routes/IRoutesListItem'
import { useRouteSegments } from '~/composables/useRouteSegments'

type Point = [number, number]
const BOX_W = 1024
const BOX_H = 768

const props = defineProps<{
  photoUrl: string
  routes: IRoutesListItem[]
  activeRouteId: number | null
}>()

const emit = defineEmits<{
  (e: 'hover', id: number | null): void
  (e: 'select', id: number): void
}>()

const activePathColor = 'red'
const activeStrokeWidth = 2
const inactivePathColor = 'lightgreen'
const inactiveStrokeWidth = 2

const { parseSegments, doesRouteHasSegments } = useRouteSegments()

type WithGeom = IRoutesListItem & { vertices: Point[]; pathD: string }

const withGeom = computed<WithGeom[]>(() => {
  return (props.routes ?? [])
    .filter(r => doesRouteHasSegments(r.lineJSON, { w: BOX_W, h: BOX_H }))
    .map(r => {
      const segs = parseSegments(r.lineJSON, { w: BOX_W, h: BOX_H })
      // Your data is single-polyline-per-route; support multiple just in case:
      const first = segs[0] ?? []
      const pathD = first.length ? `M ${first.map(p => p.join(' ')).join(' L ')}` : ''
      return { ...r, vertices: first, pathD }
    })
})

const active = computed(() => withGeom.value.find(r => r.id === props.activeRouteId) || null)
</script>

<style scoped>
.stage-svg { width: 100%; height: 100%; display: block; }
</style>
