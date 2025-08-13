<template>
  <div class="auth-registration-page">
    <div class="social-auth-section">
      <ClientOnly fallback-tag="div" fallback="Loading comments...">
        <GoogleAuthButton />
      </ClientOnly>
    </div>
    <div class="register-form-section">
      <RegistrationForm />
    </div>
  </div>
</template>

<script setup lang="ts">
import GoogleAuthButton from '@/components/user/GoogleAuthButton.vue'
import RegistrationForm from '@/components/user/RegistrationForm.vue'

const { $api } = useNuxtApp()
</script>)

<style lang="scss" scoped>
.auth-registration-page {
  padding-top: 200px;
  
  .social-auth-section {
    display: grid;
    justify-content: center;
    margin-bottom: 12px;
  }
}
</style>
