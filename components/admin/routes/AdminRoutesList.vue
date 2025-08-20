<template>
  <div class="admin-routes-list-component">
    <table class="cg-table admin-routes-list-table">
      <thead>
        <tr>
          <th>
            {{  t('routeName') }}
          </th>
          <th>
            {{  t('grade') }}
          </th>
          <th>
            {{  t('ascents') }}
          </th>
          <th>
            {{  t('hasDrawnLine') }}
          </th>
          <th>
            {{  t('actions') }}
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(r, i) in props.routes" :key="i">
          <td class="col-name">
            <nuxt-link
              :to="localePath({
                name: 'admin-routes-routeId',
                params: {
                  routeId: r.id
                }
              })" 
            >
              {{ r.name }}
            </nuxt-link>
          </td>
          <td>
            {{ r.difficulty }}
          </td>
          <td>
            {{ r.totalAscents }}
          </td>
          <td>
            <svg-icon :icon="!!r.lineJSON ? 'cg_eye' : 'cg_closed_eye'" />
          </td>
          <td>
            <button class="cg-btn cg-btn__danger" type="submit" @click="deleteRoute(r.id)">
              {{ t('delete') }}
            </button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>


<script setup lang="ts">
import { useNuxtApp } from '#app'
import type { IRoutesListItem } from '~/types/routes/IRoutesListItem'
import SvgIcon from '~/components/common/SvgIcon.vue'

const props = defineProps<{
  routes: IRoutesListItem[]
}>()

const { $api } = useNuxtApp()
const localePath = useLocalePath()

const { t } = useI18n({
  useScope: 'local',
  messages: {
    en: {
      actions: 'Actions',
      ascents: 'Ascents',
      delete: 'Delete',
      grade: 'Grade',
      hasDrawnLine: 'Has a line',
      routeName: 'Name',
    },
    ua: {
      actions: 'Дії',
      ascents: 'Пролази',
      delete: 'Видалити',
      grade: 'Категорія',
      hasDrawnLine: 'Має лінію',
      routeName: 'Назва',
    },
  }
})

async function deleteRoute(id: number) {
  await $api.routes.delete(id)
}
</script>


<style lang="scss" scoped>
.admin-routes-list-table {
  tbody {
    @include body_medium;
  }

  .col-name {
    @include heading5;
  }
}
</style>
