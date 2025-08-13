import { defineStore } from 'pinia'
import type { ISessionResponse } from '@/types/users/ISessionResponse'

export const useUserStore = defineStore('userStore', () => {
  let user = ref<ISessionResponse>()

  function setUser(user: ISessionResponse): void {
    user = user
  }
  return { setUser, user }
})
