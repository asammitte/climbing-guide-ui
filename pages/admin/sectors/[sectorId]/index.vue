<template>
  <div>Sector id page</div>
</template>

<script setup lang="ts">
import { useBreadcrumbsStore } from '~/stores/breadcrumbsStore'
import { type ISectorItem } from '~/types/sectors/ISectorItem'

const props = defineProps<{
  sector: ISectorItem
}>()

const localePath = useLocalePath()

const { t } = useI18n({
  useScope: 'local',
  messages: {
    en: {
      areas: 'Райони',
      home: 'Home',
      routes: 'Routes',
    },
    ua: {
      areas: 'Райони',
      home: 'Головна',
      routes: 'Маршрути',
    },
  }
})

// Breadcrumbs
const bc = useBreadcrumbsStore()
bc.set([
  { label: t('home'), to: localePath({ name: 'index' }) },
  {
    label: t('areas'),
    to: localePath({ name: 'admin-areas' })
  },
  {
    label: props.sector.areaName,
    to: localePath({ name: 'admin-areas-areaId', params: { areaId: props.sector.areaId } })
  },
  {
    label: props.sector.name
  }
])
</script>