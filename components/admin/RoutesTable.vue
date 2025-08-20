<template>
  <table class="rt w-full">
    <thead>
      <tr>
        <th class="tl">Route</th>
        <th class="tl">Grade</th>
      </tr>
    </thead>
    <tbody>
      <tr
        v-for="r in routes"
        :key="r.id"
        @mouseenter="emit('hover', r.id)"
        @mouseleave="emit('hover', null)"
        @click="emit('select', r.id)"
        class="row"
        :class="{ active: activeRouteId === r.id }"
      >
        <td>
          <span class="swatch" :style="{ backgroundColor: r.color ?? '#FF0000' }"></span>
          {{ r.name }}
        </td>
        <td>{{ r.grade ?? '' }}</td>
      </tr>
    </tbody>
  </table>
</template>


<script setup lang="ts">
import type { RouteItem } from '~/types/routes/routes'

const props = defineProps<{ routes: RouteItem[]; activeRouteId?: number | null }>()
const emit = defineEmits<{
  (e: 'hover', id: number | null): void
  (e: 'select', id: number): void
}>()
</script>


<style scoped>
.tl { text-align: left; }
.rt { font-size: 14px; border-collapse: collapse; }
.rt th, .rt td { padding: 8px 10px; border-bottom: 1px solid #eee; }
.row { cursor: pointer; }
.row:hover { background: #f7f7f7; }
.row.active { background: #eef6ff; }
.swatch { display: inline-block; width: 10px; height: 10px; border-radius: 2px; margin-right: 8px; vertical-align: middle; }
</style>
