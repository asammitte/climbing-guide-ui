<template>
  <div class="registration-form-component">

    <FormField>
      <FormTextInput v-model="username" placeholder="Display name" />
    </FormField>

    <FormField>
      <FormTextInput v-model="email" placeholder="Email" />
    </FormField>

    <FormField>
      <FormTextInput v-model="password" placeholder="Password" :type="'password'" />
    </FormField>

    <c-button :label="'register'" @click="login">login</c-button>
  </div>
</template>

<script setup lang="ts">
import FormField from '@/components/common/FormField.vue'
import FormTextInput from '@/components/common/FormTextInput.vue'
import CButton from '@/components/common/CButton.vue'

const auth = useAuth()

const username = ref('')
const email = ref('')
const password = ref('')

const login = async (): Promise<void> => {
  await auth.signUp(
    email.value,
    username.value,
    password.value
  )
}
</script>

<style lang="scss" scoped>
.registration-form-component {
  display: grid;
  justify-content: center;
  row-gap: 12px;
}
</style>
