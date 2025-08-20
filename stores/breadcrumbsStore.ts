// stores/breadcrumbs.ts
import { defineStore } from 'pinia'
import type { RouteLocationRaw } from 'vue-router'

export interface Crumb {
  label: string
  to?: RouteLocationRaw // string or { name, params, query } etc.
}

export const useBreadcrumbsStore = defineStore('breadcrumbs', {
  state: () => ({
    items: [] as Crumb[],
  }),

  getters: {
    length: (s) => s.items.length,
    last: (s) => (s.items.length ? s.items[s.items.length - 1] : undefined),
  },

  actions: {
    set(items: Crumb[]) {
      this.items = items
    },
    clear() {
      this.items = []
    },
    push(crumb: Crumb) {
      this.items.push(crumb)
    },
    pop() {
      return this.items.pop()
    },
    replace(index: number, crumb: Crumb) {
      if (index >= 0 && index < this.items.length) this.items.splice(index, 1, crumb)
    },
    removeAt(index: number) {
      if (index >= 0 && index < this.items.length) this.items.splice(index, 1)
    },
    setCurrentLabel(label: string) {
      if (!this.items.length) return
      const i = this.items.length - 1
      this.items[i] = { ...this.items[i], label }
    },
  },
})
