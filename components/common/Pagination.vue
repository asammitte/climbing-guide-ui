<template>
  <div v-if="pageCount > 1">
    <hr v-if="isHr" />
    <ul :class="containerClass">
      <li
        v-if="firstLastButton"
        :class="[pageClass, firstPageSelected ? disabledClass : '']"
      >
        <nuxt-link
          :to="{ path: '', query: getLinkQuery(1) }"
          append
          :class="pageLinkClass"
          :tabindex="firstPageSelected ? -1 : 0"
        >
          {{ firstButtonText }}
        </nuxt-link>
      </li>

      <li
        v-if="!(firstPageSelected && hidePrevNext)"
        :class="[prevClass, firstPageSelected ? disabledClass : '']"
      >
        <span v-if="firstPageSelected" :class="prevLinkClass" :tabindex="-1">
          <span class="tablet-hide">{{ getPrevText }}</span>
        </span>
        <nuxt-link
          v-else
          :to="{ path: '', query: getLinkQuery(prevPage) }"
          append
          :class="prevLinkClass"
          :tabindex="firstPageSelected ? -1 : 0"
        >
          <span class="tablet-hide">{{ getPrevText }}</span>
        </nuxt-link>
      </li>

      <!-- {{ pages }} -->
      <template v-if="true">
        <li
          v-for="(page, index) in pages"
          :key="index"
          :class="[
            pageClass,
            page.selected ? activeClass : '',
            page.disabled ? disabledClass : '',
            page.breakView ? breakViewClass : ''
          ]"
        >
          <span
            v-if="page.breakView"
            :class="[pageLinkClass, breakViewLinkClass]"
            tabindex="0"
          >
            <slot name="breakViewContent">
              {{ breakViewText }}
            </slot>
          </span>
          <span v-else-if="page.disabled" :class="pageLinkClass" tabindex="0">
            {{ page.content }}
          </span>
          <nuxt-link
            v-else-if="!page.selected"
            :to="{ path: '', query: getLinkQuery(page.index! + 1) }"
            append
            :class="pageLinkClass"
            tabindex="0"
          >
            {{ page.content }}
          </nuxt-link>
          <span v-else :class="pageLinkClass" tabindex="0">
            {{ page.content }}
          </span>
        </li>
      </template>

      <li
        v-if="!(lastPageSelected && hidePrevNext)"
        :class="[nextClass, lastPageSelected ? disabledClass : '']"
      >
        <nuxt-link
          v-if="!lastPageSelected"
          :to="{ path: '', query: getLinkQuery(nextPage) }"
          append
          :class="nextLinkClass"
          :tabindex="lastPageSelected ? -1 : 0"
        >
          <span class="tablet-hide">{{ getNextText }}</span>
        </nuxt-link>
        <span v-else :class="nextLinkClass" :tabindex="-1">
          <span class="tablet-hide">{{ getNextText }}</span>
        </span>
      </li>

      <li
        v-if="firstLastButton"
        :class="[pageClass, lastPageSelected ? disabledClass : '']"
      >
        <nuxt-link
          :to="{ path: '', query: getLinkQuery(selectLastPage) }"
          append
          :class="pageLinkClass"
          :tabindex="lastPageSelected ? -1 : 0"
        >
          {{ lastButtonText }}
        </nuxt-link>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { type LocationQuery } from 'vue-router';

interface IPaginationProps {
  pageCount: number
  pageRange?: number
  marginPages?: number
  isHr?: boolean
  prevText?: string
  nextText?: string
  breakViewText?: string
  containerClass?: string
  pageClass?: string
  pageLinkClass?: string
  prevClass?: string
  prevLinkClass?: string
  nextClass?: string
  nextLinkClass?: string
  breakViewClass?: string
  breakViewLinkClass?: string
  activeClass?: string
  disabledClass?: string
  firstLastButton?: boolean
  firstButtonText?: string
  lastButtonText?: string
  hidePrevNext?: boolean
}

interface IPageItem {
  index?: number
  content?: number
  selected?: boolean
  disabled?: boolean
  breakView?: boolean
}

const props = withDefaults(defineProps<IPaginationProps>(), {
  pageRange: 5,
  marginPages: 1,
  prevText: '',
  nextText: '',
  breakViewText: '…',
  containerClass: 'pagination c-pagination',
  pageClass: 'page-item',
  pageLinkClass: '',
  prevClass: '',
  prevLinkClass: '',
  nextClass: '',
  nextLinkClass: '',
  breakViewClass: '',
  breakViewLinkClass: '',
  activeClass: 'active-page',
  disabledClass: 'disabled',
  firstLastButton: false,
  firstButtonText: 'First',
  lastButtonText: 'Last',
  hidePrevNext: false
})

const route = useRoute()

const selected = computed(() => {
  return route.query?.page ? +route.query.page : 1
})

const pages = computed<IPageItem[]>(() => {
  const items: IPageItem[] = []
  if (props.pageCount <= props.pageRange) {
    for (let index = 0; index < props.pageCount; index++) {
      const page = {
        index: index,
        content: index + 1,
        selected: index === selected.value - 1
      }
      items[index] = page
    }
  } else {
    const halfPageRange = Math.floor(props.pageRange / 2)

    const setPageItem = (index: number) => {
      const page = {
        index: index,
        content: index + 1,
        selected: index === selected.value - 1
      }

      items[index] = page
    }

    const setBreakView = (index: number) => {
      const breakView = {
        disabled: true,
        breakView: true
      }

      items[index] = breakView
    }

    // 1st - loop thru low end of margin pages
    for (let i = 0; i < props.marginPages; i++) {
      setPageItem(i)
    }

    // 2nd - loop thru selected range
    let selectedRangeLow = 0
    if (selected.value - halfPageRange > 0) {
      selectedRangeLow = selected.value - 1 - halfPageRange
    }

    let selectedRangeHigh = selectedRangeLow + props.pageRange - 1
    if (selectedRangeHigh >= props.pageCount) {
      selectedRangeHigh = props.pageCount - 1
      selectedRangeLow = selectedRangeHigh - props.pageRange + 1
    }

    for (
      let i = selectedRangeLow;
      i <= selectedRangeHigh && i <= props.pageCount - 1;
      i++
    ) {
      setPageItem(i)
    }

    // Check if there is breakView in the left of selected range
    if (selectedRangeLow > props.marginPages) {
      setBreakView(selectedRangeLow - 1)
    }

    // Check if there is breakView in the right of selected range
    if (selectedRangeHigh + 1 < props.pageCount - props.marginPages) {
      setBreakView(selectedRangeHigh + 1)
    }

    // 3rd - loop thru high end of margin pages
    for (
      let i = props.pageCount - 1;
      i >= props.pageCount - props.marginPages;
      i--
    ) {
      setPageItem(i)
    }
  }
  return items
})

const prevPage = computed(() => {
  if (selected.value <= 1) {
    return 1
  }
  return selected.value - 1
})

const nextPage = computed(() => {
  if (selected.value >= props.pageCount) {
    return props.pageCount
  }
  return selected.value + 1
})

const firstPageSelected = computed(() => {
  return selected.value === 1
})

const lastPageSelected = computed(() => {
  return selected.value === props.pageCount || props.pageCount === 0
})

const selectLastPage = computed(() => {
  return props.pageCount
})

const getPrevText = computed(() => {
  return props.prevText // || this.$t('pagination.prev')
})

const getNextText = computed(() => {
  return props.nextText // || this.$t('pagination.next')
})


function getLinkQuery(pageIndex: number): LocationQuery {
  const query = Object.assign({}, route.query)
  if (pageIndex === 1) {
    delete query.page
  } else {
    query['page'] = pageIndex.toString()
  }
  return query
}
</script>

<style lang="scss" scoped>
.c-pagination {
  text-align: center;

  li {
    display: inline-block;
    color: #000000;

    a,
    span {
      outline: 0;
      cursor: pointer;
      padding-left: 12px;
      padding-right: 12px;
      text-decoration: none;
    }

    &.disabled {
      a,
      span {
        cursor: not-allowed;
      }
    }

    &:last-child {
      & > a,
      & > span {
        &:after {
          content: '\25BA';
          display: inline;
        }
      }
    }

    &:first-child {
      & > a,
      & > span {
        &:before {
          content: '\25c4';
          display: inline;
        }
      }
    }

    // @include breakpoint($tablet down) {
    //   a {
    //     padding-left: 8px;
    //     padding-right: 8px;
    //   }

    //   &:first-child {
    //     a {
    //       padding: 0;
    //     }
    //   }

    //   &:last-child a {
    //     padding: 0;
    //   }

    //   &.disabled {
    //     padding: 0;

    //     a {
    //       padding: 0;
    //     }
    //   }
    // }
  }

  .active-page span {
    color: #ff3860;
    font-weight: bold;
  }
}
</style>
