import { resolve } from 'path'
import customRoutes from './pages_man/customRoutes'
import fs from 'fs'

// Read SSL certificate and key files synchronously
const key = fs.readFileSync('./localhost.key', 'utf-8')
const cert = fs.readFileSync('./localhost.crt', 'utf-8')

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  ssr: true,
  // devServer: {
  //   https: {
  //     key,
  //     cert,
  //   },
  // },
  runtimeConfig: {
    // Private keys are only available on the server
    apiSecret: '123',
    apiProxyUrl: process.env.NUXT_API_BASE,
    // Public keys that are exposed to the client
    public: {
      // API_BASE_URL: process.env.API_BASE_URL || '/api',
      googleClientId: process.env.GOOGLE_CLIENT_ID ?? '',
    },
  },

  hooks: {
    'pages:extend'(routes: Array<any>) {
      function resolveRoutes(route: any) {
        return {
          ...route,
          file: resolve(__dirname, route.file),
          children: route.children ? route.children.map(resolveRoutes) : []
        }
      }
      
      customRoutes.forEach(route => {
        routes.push(resolveRoutes(route))
      })

      // customRoutes.forEach(route => {
      //   routes.push({
      //     ...route,
      //     file: resolve(__dirname, route.file),
      //     ...(route.children && route.children.length > 0
      //       ? { children: route.children.map(child => ({
      //           ...child,
      //           file: resolve(__dirname, child.file)
      //         }))
      //       }
      //       : {})
      //   })
      // })

      // uncomment line below to debug routes
      // console.log(routes) // Debugging: See the final route list
    }
  },

  typescript: {
    strict: true
  },

  css: [
    '@/assets/scss/main.scss',
  ],

  vite: {
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: '@import "@/assets/scss/_variables.scss";'
        },
      },
    },
  },

  modules: [
    "@nuxt/image",
    '@nuxtjs/i18n',
    '@pinia/nuxt',
    // '@sidebase/nuxt-auth'
  ],

  // plugins: [
  //   '@/plugins/ofetch.ts',
  // ],

  i18n: {
    strategy: 'prefix_except_default',
    // vueI18n: './i18n.config.ts', // if you are using custom path, default
    locales: [
      {
        code: 'ua',
        name: 'Ukranian'
      },
      {
        code: 'en',
        name: 'English'
      },
    ],
    defaultLocale: 'ua',
    detectBrowserLanguage: false
  }
})
