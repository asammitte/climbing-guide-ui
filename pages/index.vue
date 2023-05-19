<template>
  <div>
    <h1>Welcome to the homepage</h1>
    <ClientOnly fallback-tag="div" fallback="Loading comments...">
      <GoogleAuthButton />
    </ClientOnly>
  </div>
</template>

<script setup lang="ts">
import GoogleAuthButton from '@/components/user/GoogleAuthButton.vue'

const { $api } = useNuxtApp()

// const u = await useAsyncData( 'data', () => $api.users.getAll() )
// console.log(u)

// http://localhost:4000/

// const route = useRoute()

// const flyers = await $api.flyers.getAll()
// const [ users ] = await Promise.all([
//   $api.users.getAll()
//   // useFetch(config.API_BASE_URL+'/companies/'+route.params.company),
// ])
</script>
