
// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  runtimeConfig: {
    // Private keys are only available on the server
    apiSecret: '123',
    // Public keys that are exposed to the client
    public: {
      apiBase: process.env.API_BASE_URL || '/api',
      googleClientId: process.env.GOOGLE_CLIENT_ID ?? '',
    }
  },
  typescript: {
    strict: true
  },
  css: [
    '@/assets/scss/main.scss',
    'vuetify/lib/styles/main.sass',
    '@mdi/font/css/materialdesignicons.min.css'
  ],
  build: {
    transpile: ['vuetify']
  },
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
    // 'nuxt-icon',
    '@nuxtjs/i18n'
  ],
  i18n: {
    vueI18n: './i18n.config.ts', // if you are using custom path, default 
    locales: ['ua', 'en'],
    defaultLocale: 'ua'
  }
})
