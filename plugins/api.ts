import { $fetch,FetchOptions } from 'ohmyfetch'
import { defineNuxtPlugin } from '#app'
import AuthModule from '@/repository/modules/auth'
import UsersModule from '@/repository/modules/users'

/** ApiInstance interface provides us with good typing */
interface IApiInstance {
  auth: AuthModule
  users: UsersModule
}

declare module "#app" {
  interface NuxtApp {
    $api: IApiInstance;
  }
}

export default defineNuxtPlugin((nuxtApp) => {
  const fetchOptions: FetchOptions = {
    baseURL: nuxtApp.$config.public.apiBase,
  }

  /** create a new instance of $fetcher with custom option */
  const apiFetcher = $fetch.create(fetchOptions)

  /** an object containing all repositories we need to expose */
  const modules: IApiInstance = {
    auth: new AuthModule(apiFetcher),
    users: new UsersModule(apiFetcher)
  }

  return {
    provide: {
      api: modules,
    }
  }
})
