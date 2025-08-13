import { defineNuxtPlugin, useRequestHeaders } from '#app'
import { appendResponseHeader } from 'h3'
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

export default defineNuxtPlugin({
  setup() {
    const headersToForward = useRequestHeaders([
      'cookie',
      'accept',
      // 'accept-language',
      // 'user-agent',
      // 'referer',
    ])

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
            ...headersToForward,
          }

          // Keep the current request event on ctx so we can attach response cookies
          // ;(ctx as any).event = useRequestEvent()
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
      sectors: new SectorsModule(apiFetcher),
      users: new UsersModule(apiFetcher)
    }

    return {
      provide: {
        api: modules,
      }
    }
  }
})
