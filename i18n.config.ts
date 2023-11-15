// export default {
//   locales: ['ua', 'en', 'it'],
//   defaultLocale: 'ua'
// }

export default defineI18nConfig(() => ({
  reloadOnLanguageChange: false,
  legacy: false,
  locale: 'ua',
  availableLocales: ['ua', 'en']
}))
