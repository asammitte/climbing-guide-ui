<template>
  <div>
    <div class="grid">
      <div class="col-5">
        <div v-for="prop in flyers.properties" :key="prop.slug">
          <property-options-list
            :productProperty="prop"
          />
        </div>
      </div>
      <div class="col-7"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import PropertyOptionsList from '@/components/common/propertyOptionsList.vue'

const { $api } = useNuxtApp()

const flyers = await $api.flyers.getAll()
</script>
