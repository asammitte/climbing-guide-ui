import { $fetch,FetchOptions } from 'ohmyfetch'
import { defineNuxtPlugin } from '#app'
import FlyersModule from '@/repository/modules/flyers'

/** ApiInstance interface provides us with good typing */
interface IApiInstance {
  flyers: FlyersModule
}

export default defineNuxtPlugin((nuxtApp) => {

  
  const fetchOptions: FetchOptions = {
    baseURL: nuxtApp.$config.API_BASE_URL,
  }

  /** create a new instance of $fetcher with custom option */
  const apiFetcher = $fetch.create(fetchOptions)

  /** an object containing all repositories we need to expose */
  const modules: IApiInstance = {
    flyers: new FlyersModule(apiFetcher),
  }

  return {
    provide: {
      api: modules,
    },
  }
})
