<template>
  <div class="google-auth-button-component">
    <div
      id="g_id_onload"
      :data-client_id="config.public.googleClientId"
      data-context="signin"
      data-ux_mode="popup"
      data-callback="googleLoginCallback"
      data-auto_select="true"
      data-itp_support="true"
    ></div>

    <div
      class="g_id_signin"
      data-type="standard"
      data-shape="pill"
      data-theme="outline"
      data-text="continue_with"
      data-size="large"
      data-logo_alignment="left"
    ></div>
  </div>
</template>

<script setup lang="ts">
const config = useRuntimeConfig()
const { $api } = useNuxtApp()

useHead({
  script: [{
    async: true,
    src: 'https://accounts.google.com/gsi/client',
    defer: true
  }]
})

if (process.client) {
  window.googleLoginCallback = async (userData) => {
    console.log(userData)

    await $api.auth.googleVerify(userData.credential)
      .then((res: any) => {
        console.log("pl", res)
      })
      .catch(console.error)
  }
}
</script>