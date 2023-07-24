import { createVuetify } from 'vuetify'
import {
  VApp,
  VAppBar,
  VAppBarNavIcon,
  VBottomNavigation,
  VBtn,
  VCard,
  VContainer,
  VDivider,
  VFooter,
  VIcon,
  VList,
  VListItem,
  VListItemTitle,
  VListSubheader,
  VMain,
  VMenu,
  VNavigationDrawer,
  VSpacer,
  VToolbar,
  VToolbarTitle,
  VToolbarItems,

} from 'vuetify/components'
import * as directives from 'vuetify/directives'


const customTheme = {
  "dark": false,
  "colors": {
    "background": "#F5F5F5",
    "surface": "#FFFFFF",
    "primary": "#0057B8",
    "secondary": "#FFD700",
    "error": "#F44336",
    "info": "#2196F3",
    "success": "#4CAF50",
    "warning": "#FFC107"
  }
}

const customDarkTheme = {
  "dark": true,
  "colors": {
    "background": "#121212",
    "surface": "#212121",
    "primary": "#0057B8",
    "secondary": "#FFD700",
    "error": "#CF6679",
    "info": "#2196F3",
    "success": "#4CAF50",
    "warning": "#FB8C00"
  }
}

export default defineNuxtPlugin(nuxtApp => {
  const vuetify = createVuetify({
    ssr: true,
    components: {
      VApp,
      VAppBar,
      VAppBarNavIcon,
      VBottomNavigation,
      VBtn,
      VCard,
      VContainer,
      VDivider,
      VFooter,
      VIcon,
      VList,
      VListItem,
      VListItemTitle,
      VListSubheader,
      VMain,
      VMenu,
      VNavigationDrawer,
      VSpacer,
      VToolbar,
      VToolbarTitle,
      VToolbarItems,
    },
    directives,
    theme: {
      defaultTheme: 'customTheme',
      themes: {
        customTheme,
        customDarkTheme
      }
    }
  })

  nuxtApp.vueApp.use(vuetify)
})
