<template>
  <div class="top-desktop-menu-component">
    <div class="top-desktop-menu-items">
      <div class="item-logo">
        CLIMBING GUIDE
      </div>
      <div class="item-pages">
        <nuxt-link
          v-for="(item, i) in menuItems"
          :key="i"
          :to="localePath({ name: item.urlName })"
        >
          {{  item.title }}
        </nuxt-link>
      </div>
      <div class="item-search"></div>
      <div class="item-language">
        <language-selector />
      </div>
      <div class="item-login">УВІЙТИ</div>
    </div>
  </div>
</template>


<script setup lang="ts">
import LanguageSelector from '~/components/navigation/LanguageSelector.vue'

const localePath = useLocalePath()
const menuItems = useMenuItems()
</script>


<style lang="scss" scoped>
.top-desktop-menu-component {
  display: none;
}

@media (min-width: $laptop-breakpoint) {
  .top-desktop-menu-component {
    display: flex;
    border-bottom: 1px solid var(--secondary_500);
    justify-content: space-between;
    background-color: var(--neutral_100);

    .top-desktop-menu-items {
      display: flex;
      align-items: center;
      width: 100%;
      max-width: var(--container-max);
      margin-inline: auto;
      padding: 16px 0;

      & > :not(:first-child) {
        margin-left: 24px;
      }

      & > :nth-child(2) {
        margin-left: auto;
      }

      .item-logo {
        @include heading3;
        padding: 8px;
      }

      .item-pages {
        @include heading5;
        display: flex;
        justify-content: space-between;
        text-transform: uppercase;
        column-gap: 12px;

        .router-link-active {
          color: var(--primary_100);
        }
      }
    }
  }
}
</style>
