<template>
  <div class="search-query-component">
    <input
      id="eventQuery"
      v-model="query"
      name="eventQuery"
      type="text"
      class="print-com-input search-input"
      :placeholder="props.searchPlaceholder"
      autocomplete="off"
    />
		<icon class="i-print-com i-print-com-search" name="ic:baseline-search" />
		<icon
			v-if="query.length"
			class="i-print-com i-print-com-x"
			name="ic:outline-clear"
			@click="clearSearch"
		/>
  </div>
</template>

<script setup lang="ts">
const props = withDefaults(
	defineProps<{ searchPlaceholder: string }>(), {
		searchPlaceholder: 'Search...'
	}
)

const query = ref('')

const emit = defineEmits(['queryChanged'])

watch(query, (query) => {
	emit('queryChanged', query)
})

function clearSearch(): void {
	query.value = ''
}
</script>

<style lang="scss" scoped>
.search-query-component {
	position: relative;

	.search-input {
		position: relative;
		border-radius: 4px;
		margin-bottom: 0;
		padding-left: $spacing-3xl;
		box-shadow: none;

		$tablet: 992px;

		@mixin textarea_placeholder_default {
			color: $grayscale_gray-60;
		}

		&::-webkit-input-placeholder {
			@include textarea_placeholder_default;
		}

		&:-moz-placeholder {
			@include textarea_placeholder_default;
		}

		&::-moz-placeholder {
			@include textarea_placeholder_default;
		}

		&:-ms-input-placeholder {
			@include textarea_placeholder_default;
		}

		&::placeholder {
			@include textarea_placeholder_default;
		}
	}

	.i-print-com {
		position: absolute;
		top: $spacing-s;

		@media (max-width: $tablet) {
			top: 14px;
		}

		&.i-print-com-x {
			right: 12px;
			top: 6px;
			cursor: pointer;

			@media (max-width: $tablet) {
				right: $spacing-m;
				left: unset;
			}
		}

		&.i-print-com-search {
			top: 6px;
			left: 12px;
			cursor: pointer;
		}
	}
}
</style>
