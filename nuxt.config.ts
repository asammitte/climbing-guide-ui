
// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  typescript: {
    strict: true
  },
  css: [
    '@/assets/scss/main.scss',
    '@/node_modules/reflex-grid/scss/reflex.scss'
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
