<template>
  <div class="property-options-list-component">
    <div class="collapse-header" @click="toggleCollapse">
      <div class="property-name">
        <b>{{ getPropertyLabel }}</b>
      </div>
      <div class="property-controls">
        <div
          class="btn"
          :class="{ 'open': isCollapsed }"
        >
          <div class="icon-left"></div>
          <div class="icon-right"></div>
        </div>
      </div>
    </div>
    <div class="options-list-wrapper" :style="{ 'max-height': getHeight }">
      <div class="option-search-wrapper">
        <search-query
          :searchPlaceholder="`Search ${productProperty.title}...`"
          @queryChanged="onFilterUpdated"
        />
      </div>
      <div
        v-for="option in getOrderedOptions"
        :key="option.slug"
        class="property-option"
      >
        <input
          v-model="selectedOption"
          :id="option.slug"
          :name="productProperty.slug"
          type="radio"
          :value="option.slug"
        >
        <label :for="option.slug">
          {{ option.name }}
        </label>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { IFlyerProperty } from '@/types/flyers/IFlyersResponse'
import SearchQuery from '@/components/common/searchQuery.vue'

const props = defineProps({
  productProperty: {
    type: Object as () => IFlyerProperty,
    required: true
  }
})

const isCollapsed = ref(true)
const filterQuery = ref('')
const selectedOption = ref('')

const getHeight = computed(() => isCollapsed.value ? '0' : 'inherit')
const getFilteredOptions = computed(
  () => props.productProperty.options.filter(o => o.name?.toLocaleLowerCase().includes(filterQuery.value))
)
const getOrderedOptions = computed(
  () => getFilteredOptions.value.sort((a, b) => a.name?.toString().localeCompare(b.name))
)
const getPropertyLabel = computed(
  () => `${props.productProperty.title} (${props.productProperty.options.length}) (${selectedOption.value})`
)

function toggleCollapse(): void {
  isCollapsed.value = !isCollapsed.value
}

function onFilterUpdated(query: string): void {
  filterQuery.value = query
  console.log(getOrderedOptions.value.filter(o => o.name?.toLocaleLowerCase().includes(query)).length)
}
</script>

<style lang="scss" scoped>
.property-options-list-component {
  padding: 4px;
  border: 1px solid $grayscale_gray-93;
  border-radius: 4px;
  margin-bottom: $spacing-xxs;

  &:hover {
    border-color: $grayscale_gray-80;
  }

  .collapse-header {
    display: flex;
    justify-content: space-between;
    cursor: pointer;

    .property-name {
      display: inline-block;
      text-align: right;
    }

    .property-controls {
      display: inline-block;
      text-align: right;
    }
  }

  .options-list-wrapper {
    transition: max-height 500ms;
    overflow: hidden;

    .option-search-wrapper {
      margin: $spacing-s 0;
    }
  }

  .print-com-collapse-icon {
    width: 24px;
    height: 24px;
    transition-duration: 500ms;
    transition-property: transform;

    &.is-collapsed {
      transform: rotate(-180deg);
    }
  }

  .property-option {
    label {
      cursor: pointer;
      // @include unselectable;
      // @mixin unselectable {
      //   -webkit-user-select: none; /* Safari */
      //   -ms-user-select: none; /* IE 10 and IE 11 */
      //   user-select: none; /* Standard syntax */
      // }
    }
  }

  @mixin icon($height, $width) {
    transition-duration: 0.5s;
    position: absolute;
    height: $height;
    width: $width;
    top: 8px;
    background-color: #212121;;
  }

  .btn {
    position: relative;
    width: 20px;
    height: 20px;
    transition-duration: 0.5s;
    
    .icon-left {
      @include icon(3px, 10px);
      
      &:hover{
        cursor: pointer;
      }
    }
    
    .icon-right {
      @include icon(3px, 10px);
      left: 10px;
    }
    
    &.open {
      .icon-left {
        transition-duration: 0.5s;
        transform: rotateZ(45deg) scaleX(1.4) translate(2px, 2px);
      }
      
      .icon-right {
        transition-duration: 0.5s;
        transform: rotateZ(-45deg) scaleX(1.4) translate(-2px, 2px);
      }
    }
    &:hover {
      cursor: pointer;
    }
  }
}
</style>
