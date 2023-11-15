<template>
  <div class="language-selector-component">
		<div>
      {{ activeLanguage.value }}
      <ul>
				<li>
          <nuxt-link
            v-for="locale in availableLocales"
            :key="locale.code" 
            :to="switchLocalePath(locale.code)"
          >
            {{ locale.name }}
          </nuxt-link>
        </li>
      </ul>
    </div>
	</div>
</template>

<script setup lang="ts">
import type { LocaleObject } from '@nuxtjs/i18n/dist/runtime/composables';

const { locale, locales } = useI18n()
const switchLocalePath = useSwitchLocalePath()

const activeLanguage = computed(() => {
	return locale
})

const availableLocales = computed<LocaleObject[]>(() => {
  return (locales.value).filter(i => {
    return i.code !== locale.value
  })
})
</script>
