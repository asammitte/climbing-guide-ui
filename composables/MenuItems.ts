import { ref, computed, watch, onMounted } from 'vue'

export interface IMenuItem {
  title: string,
  url: string,
  isActive: any,
  icon: string
}

export default function useMenuItems(): IMenuItem[] {
  const localePath = useLocalePath()
  const route = useRoute()
  const { setLocaleMessage, t } = useI18n()

  setLocaleMessage('en', {
    contact: 'Contact',
    guide: 'Guide',
    home: 'Home',
    videos: 'Video',
    profile: 'Profile'
  })
  setLocaleMessage('ua', {
    contact: 'Зворотній звʼязок',
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
      isActive: false,
      icon: 'mdi-home'
    },
    {
      title: t('guide'),
      url: localePath({ name: 'guides-areas' }),
      isActive: false,
      icon: 'mdi-map-marker'
    },
    {
      title: t('videos'),
      url: localePath({ name: 'videos' }),
      isActive: false,
      icon: 'mdi-video'
    },
    {
      title: t('profile'),
      url: localePath({ name: 'user' }),
      isActive: false,
      icon: 'mdi-owl'
    },
    // {
    //   title: t('contact'),
    //   url: localePath({ name: 'contact' }),
    //   isActive: isContactActive.value,
    //   icon: 'mdi-email'
    // },
  ])

  watch(() => route.path, () => {
    menuItems.value.forEach(i => i.isActive = isActive(i.url))

    // Optionally you can set immediate: true config for the watcher to run on init
    }, { immediate: true }
  )

  return menuItems.value
}
