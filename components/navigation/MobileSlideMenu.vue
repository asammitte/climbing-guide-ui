<!-- SlideMenu.vue -->
<template>
  <transition name="slide">
    <aside v-if="isMenuVisible" class="menu" role="dialog" aria-modal="true">
      <div class="backdrop" @click="$emit('close')" aria-label="Close menu"></div>
      <nav class="panel" @click.stop>
        <div class="slide-menu-items-container">
          <div class="item-close">
            <svg-icon
              icon="cg_exit"
              size="40px"
              @click="updateSlideMenuVisibility(false)"
            />
          </div>
          <div class="item-pages">
            <div v-for="(item, i) in menuItems" :key="i" class="item-page">
              <nuxt-link :to="localePath({ name: item.urlName })">
                {{  item.title }}
              </nuxt-link>
            </div>
          </div>
          <div class="item-language">
            <language-selector />
          </div>
          <div class="item-login">УВІЙТИ</div>
        </div>
      </nav>
    </aside>
  </transition>
</template>

<script setup lang="ts">
import { computed, onMounted, onBeforeUnmount } from 'vue'
import { useLayoutStore } from '~/stores/LayoutStore'
import LanguageSelector from '~/components/navigation/LanguageSelector.vue'
import SvgIcon from '~/components/common/SvgIcon.vue'

const localePath = useLocalePath()
const menuItems = useMenuItems()
const { updateSlideMenuVisibility } = useLayoutStore()

defineEmits<{ (e: 'close'): void }>()

const isMenuVisible = computed(() => useLayoutStore().isSlideMenuVisible)

function setVh() {
  const h = window.visualViewport?.height ?? window.innerHeight
  document.documentElement.style.setProperty('--vh', `${h * 0.01}px`)
}

onMounted(() => {
  setVh()
  // Keep it in sync when the URL bar or keyboard changes size
  window.addEventListener('resize', setVh, { passive: true })
  window.visualViewport?.addEventListener?.('resize', setVh, { passive: true })
  window.addEventListener('orientationchange', setVh, { passive: true })
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', setVh)
  window.visualViewport?.removeEventListener?.('resize', setVh)
  window.removeEventListener('orientationchange', setVh)
})
</script>

<style lang="scss" scoped>
.menu {
  position: fixed;
  inset: 0;
  z-index: 9999;

  /* The key: always match the *visible* viewport height */
  height: 100dvh;          /* modern browsers */
  min-height: 100svh;      /* ensures initial paint fits when UI expanded */
}
@supports not (height: 100dvh) {
  .menu {
    /* Fallback for older iOS/Android */
    height: calc(var(--vh, 1vh) * 100);
  }
}

.backdrop {
  position: absolute;
  inset: 0;
  background: rgba(0,0,0,.4);
}

.panel {
  color: var(--neutral_100);
  background-color: var(--neutral_800);
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  width: min(90vw, 320px);
  padding: env(safe-area-inset-top) 16px env(safe-area-inset-bottom);
  overflow: hidden;
  height: 100%;
  overscroll-behavior: contain;
  /* transform: translateX(100%); */
  will-change: transform;
  box-shadow: -8px 0 24px rgba(0,0,0,.12);

  .slide-menu-items-container {
    display: grid;
    grid-template-rows: auto 1fr auto auto; /* close | pages(fill) | language | login */
    gap: 24px;
    align-content: stretch;
    height: 100%;        /* fill the panel height */
    width: 100%;
    max-width: var(--container-max);
    margin-inline: auto;

    & > :first-child {
      margin-top: 40px;
    }

    & > :not(:first-child) {
      margin-left: 24px;
    }

    & > :nth-child(2) {
      margin-bottom: auto;
    }

    & > :last-child {
      margin-bottom: 42px;
    }

    .item-close {
      width: fit-content;
      text-align: right;
      margin-right: 24px;
      margin-bottom: 24px;
      margin-left: auto;
    }

    .item-pages {
      @include heading3;

      .item-page {
        text-align: center;
        margin-bottom: 24px;
      }
    }

    .item-language {
      margin-inline: auto;
    }

    .item-login {
      margin-inline: auto;
    }
  }
}

/* animate the panel itself (the transition classes are on <aside>) */
.slide-enter-active .panel,
.slide-leave-active .panel { transition: transform .25s ease; }

.slide-enter-from .panel,
.slide-leave-to .panel { transform: translateX(100%); }

.slide-enter-to .panel,
.slide-leave-from .panel { transform: translateX(0); }
</style>




<!-- <template>
  <transition name="slide">
    <div class="mobile-slide-menu">
      <div class="close-icon">
        <svg-icon icon="cg_exit" size="40px" color="var(--neutral_100)"/>
      </div>
      <div
        v-for="(item, i) in menuItems"
        :key="i"
        class="page-items"
      >
        <nuxt-link
          :to="localePath({ name: item.urlName })"
          class="page-item"
        >
          {{  item.title }}
        </nuxt-link>
      </div>
    </div>
  </transition>
</template>


<script setup lang="ts">
import SvgIcon from '~/components/common/SvgIcon.vue'

const localePath = useLocalePath()
const menuItems = useMenuItems()
</script>


<style lang="scss" scoped>
.mobile-slide-menu {
  background-color: var(--neutral_800);
  height: 100vh;

  .close-icon {
    margin-bottom: 24px;
    text-align: right;
  }

  .page-items {
    .page-item {
      margin-bottom: 24px;
    }
  }
}
</style> -->
