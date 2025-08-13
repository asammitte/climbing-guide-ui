<template>
  <div class="language-selector-component">
    <div
      v-for="(l, i) in locales"
      :key="i"
      class="lang-item"
      :class="{ active: isActiveLanguage(l) }"
    >
      <template v-if="isActiveLanguage(l)">
        {{ l.code }}
      </template>
      <nuxt-link v-else :to="switchLocalePath(l.code)">
        {{ l.code }}
      </nuxt-link>
    </div>
	</div>
</template>


<script setup lang="ts">
import type { LocaleObject } from '@nuxtjs/i18n/dist/runtime/composables';

const { locale, locales } = useI18n()
const switchLocalePath = useSwitchLocalePath()

function isActiveLanguage(l: string | LocaleObject) {
	return locale.value === l.code
}

const availableLocales = computed<LocaleObject[]>(() => {
  return (locales.value).filter(i => {
    return i.code !== locale.value
  })
})
</script>


<style lang="scss" scoped>
.language-selector-component {
  display: flex;

  & > :not(:first-child) {
    border-left: 1px solid var(--secondary_100);
  }

  .lang-item {
    @include heading5;
    padding: 0 8px;
    text-transform: uppercase;

    &.active {
      color: var(--primary_100);
    }
  }
}
</style>
