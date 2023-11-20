<template>
  <div class="bottom-navigation-component">
    <div v-for="(item, index) in menuItems" :key="index">
      <nuxt-link :to="item.url">
        <div class="navigation-icon-container">
          <svg-icon
            type="mdi"
            :path="item.isActive ? item.activeIcon : item.icon"
            :size="24"
          ></svg-icon>
        </div>
        <div class="navigation-label-container label-small">
          {{ item.title }}
        </div>
      </nuxt-link>
    </div>
  </div>
</template>

<script setup lang="ts">
import useMenuItems from '@/composables/MenuItems'
import SvgIcon from '@jamescoyle/vue-icon'

const menuItems = useMenuItems()
</script>

<style lang="scss" scoped>
.bottom-navigation-component {
  background-color: var(--md-sys-color-surface-container);
  color: var(--md-sys-color-on-surface);
  display: flex;
  justify-content: space-around;
  align-items: center;
  text-align: center;
  padding: 8px 0;

  a {
    .navigation-icon-container {
      display: flex;
      align-items: center;
      height: 32px;
      width: 48px;
      border-radius: 50%;

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

    &.router-link-active {
      font-weight: 600;

      .navigation-icon-container {
        background-size: 100% 100%;
      }
    }
  }
}

@media (min-width: $laptop-breakpoint) {
  .bottom-navigation-component {
    display: none;
  }
}
</style>
