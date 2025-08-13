import { defineStore } from 'pinia'

export const useTokenStore = defineStore('tokenStore', () => {
  let accessToken = ref('')

  function setAccessToken(token: string): void {
    accessToken.value = token
  }
  return { setAccessToken, accessToken }
})
