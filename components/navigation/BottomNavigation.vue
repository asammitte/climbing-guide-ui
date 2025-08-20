<template>
  <div class="bottom-navigation-component">
    <div v-for="(item, index) in menuItems" :key="index">
      <nuxt-link :to="localePath({ name: item.name })">
        <div class="navigation-icon-container">
          <svg-icon :icon="isItemActive(item) ? item.activeIcon : item.icon" />
        </div>
        <div class="navigation-label-container">
          {{ item.title }}
        </div>
      </nuxt-link>
    </div>
    <div @click="updateSlideMenuVisibility(true)">
      <div class="navigation-icon-container">
        <svg-icon icon="cg_more" />
      </div>
      <div class="navigation-label-container">
        {{ t('more') }}
      </div>
    </div>
  </div>
</template>


<script setup lang="ts">
import { useRoute } from '#app'
import SvgIcon from '@/components/common/SvgIcon.vue'

const localePath = useLocalePath()
const route = useRoute()
const { updateSlideMenuVisibility } = useLayoutStore()

const { t } = useI18n({
  useScope: 'local',
  messages: {
    en: {
      guide: 'Guide',
      home: 'Home',
      more: 'More',
      search: 'Search'
    },
    ua: {
      guide: 'Гайд',
      home: 'Головна',
      more: 'Більше',
      search: 'Пошук'
    },
  }
})

const menuItems = computed(() => [
  { title: t('home'),  name: 'index', icon: 'cg_home_outlined', activeIcon: 'cg_home_filled', isHome: true },
  { title: t('guide'), name: 'areas', icon: 'cg_guide_outlined', activeIcon: 'cg_guide_filled' },
  { title: t('search'), name: 'videos', icon: 'cg_search_outlined',activeIcon: 'cg_search_filled' },
])

// strip nuxt-i18n's name suffix, e.g. "areas___en" -> "areas"
const baseName = (n?: string | symbol | null) => typeof n === 'string' ? n.split('___')[0] : ''

const isItemActive = (item: { name: string; isHome?: boolean }) => {
  const current = baseName(route.name as any)
  // Home = exact only; others = inclusive (parent active on children)
  return item.isHome ? current === item.name : current.startsWith(item.name)
}
</script>


<style lang="scss" scoped>
.bottom-navigation-component {
  background-color: var(--secondary_100);
  color: var(--md-sys-color-on-surface-variant);
  display: flex;
  justify-content: space-around;
  align-items: center;
  text-align: center;
  padding: 12px 0 16px 0;

  @include heading5;

  .navigation-icon-container {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 32px;
    width: 64px;
    border-radius: 16px;
    margin-bottom: 4px;

    background-image: linear-gradient(var(--md-sys-color-secondary-container), var(--md-sys-color-secondary-container));
    background-position: 50% 50%;
    background-repeat: no-repeat;
    background-size: 0% 100%;
    transition: background-size .2s cubic-bezier(0, 0, 0, 1);

    svg {
      margin: 0 auto;
      display: block;
    }
  }

  .router-link-active {      
    .navigation-icon-container {
      color: var(--primary_100);
      background-size: 100% 100%;
      background: var(--secondary_200);
    }

    .navigation-label-container {
      color: var(--primary_100);
    }
  }
}

@media (min-width: $laptop-breakpoint) {
  .bottom-navigation-component {
    display: none;
  }
}
</style>
