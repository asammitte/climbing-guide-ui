<template>
  <nav class="breadcrumbs" aria-label="Breadcrumb" :style="{ '--sep': sep }">
    <ol class="trail">
      <li
        v-for="(item, i) in items"
        :key="i"
        class="crumb"
        :aria-current="i === items.length - 1 ? 'page' : undefined"
      >
        <template v-if="item.to && i !== items.length - 1">
          <NuxtLink :to="item.to" class="link">{{ item.label }}</NuxtLink>
        </template>
        <template v-else>
          <span class="current">{{ item.label }}</span>
        </template>
      </li>
    </ol>
  </nav>
</template>


<script setup lang="ts">
type To = string | Record<string, any>
interface Crumb { label: string; to?: To }

const props = defineProps<{
  items: Crumb[]                     // [{ label:'Home', to:'/' }, { label:'Section', to:'/section' }, { label:'Page' }]
  separator?: string                 // default: "/"
}>()

const sep = `'${(props.separator ?? '/').trim()}'` // CSS content needs quoted string
</script>


<style scoped lang="scss">
/* Uses your CSS color tokens defined on :root */
.breadcrumbs {
  margin-bottom: 24px;
  --bc-text: var(--neutral_500);
  --bc-link: var(--primary_100);
  --bc-link-hover: var(--secondary_700);
  --bc-bg-hover: var(--secondary_100);
  --bc-sep: var(--neutral_300);
  --bc-current: var(--neutral_600);
  --bc-focus: var(--system_info);

  /* separator character (can be overridden via inline style/prop) */
  --sep: '/';

  font-family: 'IBM Plex Sans', Manrope, system-ui, -apple-system, Segoe UI, Roboto, 'Helvetica Neue', Arial, sans-serif;
  color: var(--bc-text);
}

/* Layout */
.trail {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 6px;               /* small space between items (plus the sep) */
  list-style: none;
  margin: 0;
  padding: 0;
}

.crumb {
  display: inline-flex;
  align-items: center;
  max-width: 100%;
  /* separator */
  & + .crumb::before {
    content: var(--sep);
    color: var(--bc-sep);
    display: inline-block;
    margin: 0 6px;
  }
}

/* Typography baseline (mobile first = body_small) */
.link,
.current {
  font-size: 12px;        /* body_small */
  line-height: 1.3;
  font-weight: 600;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: clamp(96px, 40vw, 220px);
  border-radius: 10px;
  padding: 4px 6px;
  box-sizing: border-box;
}

/* Link styles */
.link {
  color: var(--bc-link);
  text-decoration: none;
  transition: background-color 120ms ease, color 120ms ease, box-shadow 120ms ease;
}
.link:hover {
  background: var(--bc-bg-hover);
  color: var(--bc-link-hover);
}
.link:focus-visible {
  outline: none;
  box-shadow: 0 0 0 2px var(--bc-focus);
}

/* Current page */
.current {
  color: var(--bc-current);
  font-weight: 700;        /* matches your heading/body bold usage */
  cursor: default;
}

/* Responsive type scale using your breakpoints */
@media (min-width: $tablet-breakpoint) {
  .link, .current { font-size: 14px; /* body_medium */ max-width: clamp(140px, 32vw, 320px); }
}

@media (min-width: $desktop-breakpoint) {
  .link, .current { font-size: 16px; /* body_large */ max-width: clamp(180px, 28vw, 420px); }
}
</style>
