<template>
  <div class="routes-list-component">
    <table class="cg-table routes-list-table">
      <thead>
        <tr>
          <th>#</th>
          <th>{{  t('routeName') }}</th>
          <th class="col-grade">{{  t('grade') }}</th>
          <th>{{  t('anchors') }}</th>
          <th>{{  t('ascents') }}</th>
          <th>{{  t('videos') }}</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(r, i) in props.routes" :key="i">
          <td>{{ r.position }}</td>
          <td class="col-name">{{ r.name }}</td>
          <td class="col-grade">{{  r.difficulty }}</td>
          <td>{{ r.boltsAmount }}</td>
          <td>{{ r.totalAscents }}</td>
          <td>{{ r.totalVideos }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>


<script setup lang="ts">
import { type IRoutesListItem } from '~/types/routes/IRoutesListItem'

const props = defineProps<{
  routes: IRoutesListItem[]
}>()

const { t } = useI18n({
  useScope: 'local',
  messages: {
    en: {
      anchors: 'Anchors',
      ascents: 'Ascents',
      grade: 'Grade',
      routeName: 'Name',
      videos: 'Videos'
    },
    ua: {
      anchors: 'Кількість точок',
      ascents: 'Пролази',
      grade: 'Категорія',
      routeName: 'Назва',
      videos: 'Відео'
    },
  }
})
</script>


<style lang="scss" scoped>
.routes-list-table {
  tbody {
    @include body_medium;
  }

  .col-name {
    @include heading5;
  }

  .col-grade {
    display: none;
  }
}

@media (min-width: $laptop-breakpoint) {
  .routes-list-table {
    .col-grade {
      display: table-cell;
    }
  } 
}
</style>
