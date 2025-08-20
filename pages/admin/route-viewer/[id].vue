<script setup lang="ts">
import { ref } from 'vue'
import PhotoWithRoutes from '~/components/admin/PhotoWithRoutes.vue'
import RoutesTable from '~/components/admin/RoutesTable.vue'
import type { RouteItem } from '~/types/routes/routes'

// Demo data: two routes share the first 30% then split.
const grid = 10000
const photoUrl = '/sample-rock.jpg' // replace with your asset

const routes = ref<RouteItem[]>([
  {
    id: 1,
    name: 'Left Arete',
    grade: '6b',
    color: '#E53935',
    geometry: {
      grid,
      segments: [
        [
          [1200, 8200], [1500, 7600], [1800, 7100], [2200, 6400], [2600, 5600],
          [3000, 4900], [3300, 4300], [3600, 3700] // shared start
        ],
        [
          [3600, 3700], [3300, 2900], [3100, 2100], [3000, 1600]
        ]
      ],
      style: { width: 60 }
    }
  },
  {
    id: 2,
    name: 'Right Finish',
    grade: '6c',
    color: '#1E88E5',
    geometry: {
      grid,
      segments: [
        [
          [1200, 8200], [1500, 7600], [1800, 7100], [2200, 6400], [2600, 5600],
          [3000, 4900], [3300, 4300], [3600, 3700] // shared start
        ],
        [
          [3600, 3700], [4000, 3200], [4500, 2500], [5000, 1800]
        ]
      ],
      style: { width: 60 }
    }
  }
])

const activeRouteId = ref<number | null>(null)
const onHover = (id: number | null) => (activeRouteId.value = id)
</script>

<template>
  <div style="max-width: 960px; margin: 20px auto; padding: 0 12px;">
    <PhotoWithRoutes :photo-url="photoUrl" :routes="routes" :active-route-id="activeRouteId" :grid="grid" />

    <div style="margin-top: 16px;">
      <RoutesTable :routes="routes" :active-route-id="activeRouteId" @hover="onHover" @select="onHover" />
    </div>
  </div>
</template>
