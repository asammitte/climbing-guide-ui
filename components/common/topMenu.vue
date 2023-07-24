<template>
  <div class="top-menu-component">
    <v-navigation-drawer
      v-model="drawer"
      location="right"
      temporary
      color="primary"
    >
      <v-list>
        <v-list-item
          prepend-avatar="https://randomuser.me/api/portraits/women/85.jpg"
          title="Sandra Adams"
          subtitle="sandra_a88@gmailcom"
        ></v-list-item>
      </v-list>

      <v-divider></v-divider>

      <v-list>
        <v-list-item
          v-for="(item, index) in menuItems"
          :key="index"
          nuxt
          :to="item.url"
          :color="item.isActive ? 'secondary' : 'primary'"
          :variant="item.isActive ? 'flat' : 'text'"
        >
          {{ item.title }}
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <v-app-bar app density="compact" flat>
      <v-toolbar color="primary" density="comfortable">
        <v-toolbar-title>Title</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-toolbar-items class="d-none d-md-flex" text variant="flat" color="primary">
          <v-btn
            v-for="(item, index) in menuItems"
            :key="index"
            nuxt
            :to="item.url"
            :active="false"
            :color="item.isActive ? 'secondary' : 'primary'"
            flat
          >
            {{ item.title }}
          </v-btn>
          <language-selector />
        </v-toolbar-items>
        <v-app-bar-nav-icon class="d-md-none" variant="text" @click.stop="drawer = !drawer" />
      </v-toolbar>
    </v-app-bar>
  </div>
</template>

<script setup lang="ts">
import LanguageSelector from '@/components/common/LanguageSelector.vue'
import useMenuItems from '@/composables/MenuItems'
import { ref } from 'vue'

const drawer = ref(false)

const menuItems = useMenuItems()
</script>

<i18n>
{
  "ua": {
    "guide": "Гайдбук",
    "videos": "Відео",
    "contact": "Зворотній звʼязок",
    "login": "Log In"
  },
  "en": {
    "guide": "Guidebook",
    "videos": "Videos",
    "contact": "Contact",
    "login": "Log In"
  }
}
</i18n>
