<template>
  <div class="login-form-component">

    <FormField :label="'Email'">
      <FormTextInput v-model="username" />
    </FormField>

    <FormField :label="'Password'">
      <FormTextInput v-model="password" :type="'password'" />
    </FormField>

    <c-button :label="'login'" @click="login">login</c-button>
  </div>
</template>

<script setup lang="ts">
import FormField from '@/components/common/FormField.vue'
import FormTextInput from '@/components/common/FormTextInput.vue'
import CButton from '@/components/common/CButton.vue'

// const { status, data, signIn, signOut, getSession } = useAuth()
// const localePath = useLocalePath()
const auth = useAuth()

const username = ref('')
const password = ref('')

const login = async (): Promise<void> => {
  await auth.signIn('login2', 'QWEqwe123!')
}
</script>

<style lang="scss" scoped>
.login-form-component {
  display: grid;
  justify-content: center;
  row-gap: 12px;
}
</style>
