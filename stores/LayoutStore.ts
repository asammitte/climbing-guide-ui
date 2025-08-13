import { defineStore } from 'pinia'

export const useLayoutStore = defineStore({
  id: 'layoutStore',
  state: () => ({
    isSlideMenuVisible: false,
  }),

  actions: {
    updateSlideMenuVisibility(isVisible: boolean) {
      console.log('click registered')
      this.isSlideMenuVisible = isVisible
    },
  }
})
