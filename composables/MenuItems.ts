import { ref, watch } from 'vue'
import {
  mdiHome,
  mdiHomeOutline,
  mdiMapMarker,
  mdiMapMarkerOutline,
  mdiVideo,
  mdiVideoOutline,
  mdiAccount,
  mdiAccountOutline
 } from '@mdi/js'
export interface IMenuItem {
  title: string
  url: string
  isActive: boolean
  icon: string
  activeIcon: string
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
    if (url === localePath({ name: 'index' })) {
      return route.path === localePath({ name: 'index' })
    }

    return route.path?.startsWith(url)
  }

  const menuItems = ref<IMenuItem[]>([
    {
      title: t('home'),
      url: localePath({ name: 'index' }),
      isActive: false,
      icon: mdiHomeOutline,
      activeIcon: mdiHome
    },
    {
      title: t('guide'),
      url: localePath({ name: 'areas' }),
      isActive: false,
      icon: mdiMapMarkerOutline,
      activeIcon: mdiMapMarker
    },
    {
      title: t('videos'),
      url: localePath({ name: 'videos' }),
      isActive: false,
      icon: mdiVideoOutline,
      activeIcon: mdiVideo
    },
    {
      title: t('profile'),
      url: localePath({ name: 'user' }),
      isActive: false,
      icon: mdiAccountOutline,
      activeIcon: mdiAccount
    },
  ])

  watch(() => route.path, () => {
    menuItems.value.forEach(i => i.isActive = isActive(i.url))

    // Optionally you can set immediate: true config for the watcher to run on init
    }, { immediate: true }
  )

  return menuItems.value
}
