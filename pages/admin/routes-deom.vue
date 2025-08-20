<template>
  <div style="display:grid; gap:24px; max-width: 1000px; margin: 20px auto;">
    <AdminRouteEditorSvg :photo-url="photoUrl" :existing-routes="routes" @save="onSave" />
    <div>
      <h3>Public preview</h3>
      <PhotoWithRoutesSvg :photo-url="photoUrl" :routes="routes" />
    </div>
  </div>
</template>


<!-- pages/admin/routes-demo.vue -->
<script setup lang="ts">
import { ref } from 'vue'
import AdminRouteEditorSvg from '~/components/admin/AdminRouteEditorSvg.vue'
import PhotoWithRoutesSvg from '~/components/admin/PhotoWithRoutesSvg.vue'

type Point = [number, number]
type Polyline = Point[]
type RouteItem = {
  id: number; name: string; grade?: string | null; color?: string;
  geometry: { segments: Polyline[]; style?: { widthPx?: number } }
}

const photoUrl = '/your-photo.jpg' // any aspect ratio; it will be letterboxed

const routes = ref<RouteItem[]>([
  {
    id: 1,
    name: 'Existing A',
    grade: '6a+',
    color: '#E53935',
    geometry: { segments: [[[150,700],[260,600],[380,520]]], style: { widthPx: 6 } }
  }
])

function onSave(r: RouteItem) {
  routes.value = [...routes.value, r]
}
</script>
