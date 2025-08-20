import { defineNuxtPlugin, useRequestHeaders, useRequestEvent, useNuxtApp } from '#app'
import { appendResponseHeader } from 'h3'
import AreasModule from '@/repository/modules/areas'
import AuthModule from '@/repository/modules/auth'
import RoutesModule from '@/repository/modules/routes'
import SectorsModule from '@/repository/modules/sectors'
import UsersModule from '@/repository/modules/users'

/** ApiInstance interface provides us with good typing */
interface IApiInstance {
  areas: AreasModule
  auth: AuthModule
  routes: RoutesModule
  sectors: SectorsModule
  users: UsersModule
}

declare module "#app" {
  interface NuxtApp {
    $api: IApiInstance;
  }
}

export default defineNuxtPlugin((nuxtApp) => {
  const headersToForward = useRequestHeaders([
    'cookie',
    'accept',
    // 'accept-language',
    // 'user-agent',
    // 'referer',
  ])

  const isTransliterationRequired = () => {
    // Works in both server & client. i18n instance is available on nuxtApp.
    const i18n = nuxtApp.$i18n as any
    // Prefer the global scope in a plugin; falls back safely.
    return i18n?.locale?.value !== 'ua'
  }

  // const headersToForward = useRequestHeaders()

  // Create a new instance of fecther with custom option
  const apiFetcher = $fetch.create({
    onRequest(ctx) {
      if (process.server) {
        // Specify which headers you want to forward:
        // Add or remove any headers your backend needs: 'cookie', 'accept', 'accept-language', etc.

        // Merge them into ctx.options.headers (if you already have something there)
        ctx.options.headers = {
          ...ctx.options.headers,
          ...headersToForward
        }

        // Keep the current request event on ctx so we can attach response cookies
        // ;(ctx as any).event = useRequestEvent()
      }

      ctx.options.headers = {
        ...ctx.options.headers,
        'X-Transliterate': isTransliterationRequired().toString(),
      }
    },
    onResponse(ctx) {
      if (process.server) {
        const setCookieHeader = ctx.response.headers.get('set-cookie')
        if (setCookieHeader) {
          appendResponseHeader((ctx as any).event, 'set-cookie', setCookieHeader)
        }
      }
    },
  })

  /** an object containing all repositories we need to expose */
  const modules: IApiInstance = {
    areas: new AreasModule(apiFetcher),
    auth: new AuthModule(apiFetcher),
    routes: new RoutesModule(apiFetcher),
    sectors: new SectorsModule(apiFetcher),
    users: new UsersModule(apiFetcher)
  }

  return {
    provide: {
      api: modules,
    }
  }
})
