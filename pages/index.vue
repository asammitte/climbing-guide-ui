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

// const u = await useAsyncData( 'data', () => $api.users.getAll() )
// console.log(u)

// const route = useRoute()

// const flyers = await $api.flyers.getAll()
const [ users ] = await Promise.all([
  $api.users.getAll()
  // useFetch(config.API_BASE_URL+'/companies/'+route.params.company),
])
</script>
