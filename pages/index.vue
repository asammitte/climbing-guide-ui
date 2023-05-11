<template>
  <div>
    <h1>Welcome to the homepage</h1>
    <AppAlert>
      This is an auto-imported component
    </AppAlert>
  </div>
</template>

<script setup lang="ts">
const { $api } = useNuxtApp()

const fl = await useAsyncData( 'data', () => $api.flyers.getAll() )
console.log(fl)

const config = useRuntimeConfig()
const route = useRoute()

// const flyers = await $api.flyers.getAll()
const [ flyers ] = await Promise.all([
  $api.flyers.getAll()
  // useFetch(config.API_BASE_URL+'/companies/'+route.params.company),
  // useFetch(config.API_BASE_URL+'/companies/'+route.params.company+'/cafes/'+route.params.cafe)
])
</script>
