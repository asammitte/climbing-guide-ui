<template>
  
  
  <v-navigation-drawer
    permanent
    location="left"
    width="auto"
  >
    <!-- <template v-slot:prepend>
      <v-list-item
        lines="two"
        prepend-avatar="https://randomuser.me/api/portraits/women/81.jpg"
        title="Jane Smith"
        subtitle="Logged in"
      ></v-list-item>
    </template>

    <v-divider></v-divider> -->

    <v-list density="compact">
      <!-- <v-list-item variant="flat" base-color="secondary">
        <template v-slot:prepend>
          <v-icon icon="mdi-chevron-left" start></v-icon>
        </template>
        Буки
      </v-list-item> -->

      <v-list-item
        v-for="(a, i) in props.areas"
        :key="i"
        :value="a"
        variant="flat"
      >
        <v-list-item-title v-text="a.name"></v-list-item-title>
      </v-list-item>
    </v-list>
  </v-navigation-drawer>


  <!-- <v-card> -->
    <!-- <v-list density="compact">
      <v-list-item variant="flat" base-color="secondary">
        <template v-slot:prepend>
          <v-icon icon="mdi-chevron-left" start></v-icon>
        </template>
        Буки
      </v-list-item>

      <v-list-item
        v-for="(a, i) in props.areas"
        :key="i"
        :value="a"
        variant="flat"
      >
        <v-list-item-title v-text="a.name"></v-list-item-title>
      </v-list-item>
    </v-list> -->
  <!-- </v-card> -->
</template>

<script setup lang="ts">
import IAreasListItem from '@/types/areas/IAreasListItem'

const props = defineProps({
  areas: {
    type: Object as () => IAreasListItem[],
    required: true
  }
})
</script>
