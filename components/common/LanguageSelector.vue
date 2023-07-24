<template>
  <!-- <div class="language-selector-component"> -->
		<v-menu>
			<template v-slot:activator="{ props }">
				<v-btn color="primary" v-bind="props">
					{{ activeLanguage.value }}
				</v-btn>
			</template>
      <v-list>
				<v-btn
          nuxt
          :to="switchLocalePath('en')"
          :active="false"
					block
        >
          UA
        </v-btn>
				<v-btn
          nuxt
          :to="switchLocalePath('en')"
          :active="false"
					block
        >
          EN
        </v-btn>
				<v-btn
          nuxt
          :to="switchLocalePath('it')"
          :active="false"
					block
        >
          IT
        </v-btn>
      </v-list>
    </v-menu>
	<!-- </div> -->
</template>

<script setup lang="ts">
const i18n = useI18n();

const languagesList = ['ua', 'en']

const activeLanguage = computed(() => {
	return i18n.locale
})
</script>
