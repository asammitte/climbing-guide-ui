import { $fetch, type FetchOptions } from 'ohmyfetch'
import { defineNuxtPlugin } from '#app'
import AreasModule from '@/repository/modules/areas'
import AuthModule from '@/repository/modules/auth'
import SectorsModule from '@/repository/modules/sectors'
import UsersModule from '@/repository/modules/users'

/** ApiInstance interface provides us with good typing */
interface IApiInstance {
  areas: AreasModule
  auth: AuthModule
  sectors: SectorsModule
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
    areas: new AreasModule(apiFetcher),
    auth: new AuthModule(apiFetcher),
    sectors: new SectorsModule(apiFetcher),
    users: new UsersModule(apiFetcher)
  }

  return {
    provide: {
      api: modules,
    }
  }
})
