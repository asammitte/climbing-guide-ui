<template>
  <div class="top-menu-component">
    <div text>
      <nuxt-link
        v-for="(item, index) in menuItems"
        :key="index"
        :to="item.url"
      >
        {{ item.title }}
      </nuxt-link>
      <language-selector />
    </div>
  </div>
</template>

<script setup lang="ts">
import LanguageSelector from '@/components/navigation/LanguageSelector.vue'
import useMenuItems from '@/composables/MenuItems'

const menuItems = useMenuItems()
</script>

<!-- <e18n>
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
</e18n> -->
