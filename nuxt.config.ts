
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
    // '@/node_modules/reflex-grid/scss/reflex.scss'
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
  modules: ['nuxt-icon']
})
