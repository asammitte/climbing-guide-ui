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
</script>
