import { ref, watch } from 'vue'

export interface IMenuItem {
  title: string,
  url: string,
  icon: string
}

export default function useMenuItems(): IMenuItem[] {
  const localePath = useLocalePath()
  const route = useRoute()
  const { setLocaleMessage, t } = useI18n()

  setLocaleMessage('en', {
    guide: 'Guide',
    home: 'Home',
    videos: 'Video',
    profile: 'Profile'
  })
  setLocaleMessage('ua', {
    guide: 'Гайдбук',
    home: 'Головна',
    videos: 'Відео',
    profile: 'Профіль'
  })

  const isActive = (url: string): boolean => {
    if (url === '/') {
      return route.path === '/'
    }
    return route.path?.startsWith(url)
  }

  const menuItems = ref<IMenuItem[]>([
    {
      title: t('home'),
      url: localePath({ name: 'index' }),
      icon: 'mdi-home'
    },
    {
      title: t('guide'),
      url: localePath({ name: 'areas' }),
      icon: 'mdi-map-marker'
    },
    {
      title: t('videos'),
      url: localePath({ name: 'videos' }),
      icon: 'mdi-video'
    },
    {
      title: t('profile'),
      url: localePath({ name: 'user' }),
      icon: 'mdi-owl'
    },
  ])

  watch(() => route.path, () => {
    menuItems.value.forEach(i => i.isActive = isActive(i.url))

    // Optionally you can set immediate: true config for the watcher to run on init
    }, { immediate: true }
  )

  return menuItems.value
}
