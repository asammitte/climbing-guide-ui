<template>
  <div class="auth-login-page">
    <div class="social-auth-section">
      <ClientOnly fallback-tag="div" fallback="Loading comments...">
        <GoogleAuthButton />
      </ClientOnly>
    </div>
    <div class="auth-form-section">
      <LoginForm />
    </div>
    <div>
      Don’t have an account? <nuxt-link :to="localePath({ name: 'auth-register' })">Sign up</nuxt-link>
    </div>
    <div>
      Forgot password? <nuxt-link :to="localePath({ name: 'auth-reset-password' })">Reset password</nuxt-link>
    </div>
  </div>
</template>

<script setup lang="ts">
import GoogleAuthButton from '@/components/user/GoogleAuthButton.vue'
import LoginForm from '@/components/user/LoginForm.vue'

const localePath = useLocalePath()
</script>

<style lang="scss" scoped>
.auth-login-page {
  padding-top: 200px;
  text-align: center;
  
  // .auth-form-section {
  //   // text-align: center;
  // }
  
  .social-auth-section {
    display: grid;
    justify-content: center;
    margin-bottom: 12px;
    // width: fit-content;
    // margin: auto;
  }
}
</style>
