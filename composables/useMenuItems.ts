export interface IMenuItem {
  isHome?: boolean
  urlName: string
  title: string
}

export default function useMenuItems(): IMenuItem[] {
  
const { t } = useI18n({
  useScope: 'local',
  messages: {
    en: {
      articles: 'Articles',
      guide: 'Guide',
      home: 'Home',
      videos: 'Videos',
    },
    ua: {
      articles: 'Статті',
      guide: 'Гайд',
      home: 'Головна',
      videos: 'Відео',
    },
  }
})

  return computed<IMenuItem[]>(() => [
    { title: t('home'),  urlName: 'index', isHome: true },
    { title: t('guide'), urlName: 'areas' },
    { title: t('videos'), urlName: 'videos' },
    { title: t('articles'), urlName: 'drawing' }
  ])
}
