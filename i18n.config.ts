// export default {
//   locales: ['ua', 'en', 'it'],
//   defaultLocale: 'ua'
// }

export default defineI18nConfig(() => ({
  legacy: false,
  locale: 'ua',
  availableLocales: ['ua', 'en']
}))
