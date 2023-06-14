import { $fetch, FetchOptions } from 'ohmyfetch'
import { defineNuxtPlugin } from '#app'
import AreaModule from '@/repository/modules/areas'
import AuthModule from '@/repository/modules/auth'
import UsersModule from '@/repository/modules/users'

/** ApiInstance interface provides us with good typing */
interface IApiInstance {
  areas: AreaModule
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
    areas: new AreaModule(apiFetcher),
    auth: new AuthModule(apiFetcher),
    users: new UsersModule(apiFetcher)
  }

  return {
    provide: {
      api: modules,
    }
  }
})
