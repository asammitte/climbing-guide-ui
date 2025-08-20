<template>
  <form class="cg-card" @submit.prevent="onSubmit">
    <div class="grid">

      <!-- Route name -->
      <label class="cg-field">
        <span class="cg-field__label">Route name <span class="req">*</span></span>
        <input
          v-model.trim="form.name"
          :class="{ invalid: touched('name') && !!errors.name }"
          type="text"
          placeholder="e.g., La Dura Dura"
          autocomplete="off"
          @blur="touch.name = true"
        />
        <small v-if="touched('name') && errors.name" class="error">{{ errors.name }}</small>
      </label>

      <!-- Grade -->
      <label class="cg-field">
        <span class="cg-field__label">Grade <span class="req">*
        </span></span>
        <select
          v-model="form.gradeIndex"
          @blur="touch.gradeIndex = true"
          :class="{ invalid: touched('gradeIndex') && !!errors.gradeIndex }"
        >
          <option value="" disabled>Select grade…</option>
          <option v-for="g in grades" :key="g.gradeIndex" :value="g.gradeIndex">{{ g.difficulty }}</option>
        </select>
        <small v-if="touched('gradeIndex') && errors.gradeIndex" class="error">{{ errors.gradeIndex }}</small>
      </label>

      <!-- Amount of boltsAmount -->
      <label class="cg-field">
        <span class="cg-field__label">Amount of anchors</span>
        <input
          v-model.number="rawBoltsAmount"
          @blur="touch.boltsAmount = true"
          :class="{ invalid: touched('boltsAmount') && !!errors.boltsAmount }"
          type="number"
          inputmode="numeric"
          min="0"
          step="1"
          placeholder="e.g., 2"
        />
        <small v-if="touched('boltsAmount') && errors.boltsAmount" class="error">{{ errors.boltsAmount }}</small>
      </label>

      <!-- Height -->
      <label class="cg-field">
        <span class="cg-field__label">Height (m)</span>
        <input
          v-model.number="rawHeight"
          @blur="touch.height = true"
          :class="{ invalid: touched('height') && !!errors.height }"
          type="number"
          inputmode="numeric"
          min="0"
          step="1"
          placeholder="e.g., 35"
        />
        <small v-if="touched('height') && errors.height" class="error">{{ errors.height }}</small>
      </label>

      <!-- Author -->
      <label class="cg-field cg-field--full">
        <span class="cg-field__label">Author</span>
        <input
          v-model.trim="form.author"
          type="text"
          placeholder="First & Last name"
          autocomplete="off"
        />
      </label>
    </div>

    <div v-if="props.route">
      <!-- <AdminRouteEditor
        :photo-url="'/sample-rock.jpg'"
        :existing-routes="routes"
        :grid="1000"
        @save="handleSaveLineJson"
      /> -->
      <admin-route-editor
        ref="editorRef"
        :key="props.route.id"
        :photo-url="props.route.imageUrl"
        :overlays="otherRoutesSegmentsRef"
        :initial-segments="initialSegmentsRef"
        :draft-color="'#00C853'"
        :draft-width-px="6"
        @clear="handleEditorClear"
      />
    </div>

    <div class="cg-card__footer">
      <button class="cg-btn cg-btn--secondary" type="button" @click="onCancel" :disabled="submitting">Cancel</button>
      <button class="cg-btn" type="submit" :disabled="!isValid || submitting">
        <span v-if="submitting">Saving…</span>
        <span v-else>{{ props.route ? 'Update route' : 'Create route' }}</span>
      </button>
    </div>

    <p v-if="serverError" class="banner banner--error">{{ serverError }}</p>
    <p v-if="saved" class="banner banner--ok">Saved</p>
  </form>
</template>


<script setup lang="ts">
import { useNuxtApp } from '#app'
import { reactive, ref, computed, watch, onMounted, withDefaults } from 'vue'
import { useRouteSegments } from '~/composables/useRouteSegments'
import AdminRouteEditor from '~/components/admin/routes/AdminRouteEditor.vue'
import type { IRouteItem } from '~/types/routes/IRouteItem'
import type { RouteItem } from '~/types/routes/routes'
import gradesJson from '~/assets/jsonData/grades.json'

interface RoutePayload {
  name: string
  gradeIndex: number
  boltsAmount?: number | null
  height?: number | null
  author?: string,
  lineJSON: string
}

type IGrade = { gradeIndex: number; difficulty: string }

// small local copy of the types used by the editor
type Point = [number, number]
type Polyline = Point[]

const props = withDefaults(defineProps<{
  sectorId: number
  /** If provided, the form loads and updates this route */
  route?: IRouteItem | null
}>(), {
  // gradeOptions: () => defaultGrades,
})

const { $api } = useNuxtApp()
const { parseSegments, stringifySegments } = useRouteSegments()

const emit = defineEmits<{
  (e: 'saved', payload: any): void
  (e: 'cancel'): void
}>()

const grades = gradesJson as IGrade[]

// Local form state
const form = reactive<RoutePayload>({
  name: '',
  gradeIndex: 1, // Unknown
  boltsAmount: null,
  height: null,
  author: '',
  lineJSON: ''
})

// Raw numeric bindings (to validate integers cleanly)
const rawBoltsAmount = ref<number | null>(null)
const rawHeight = ref<number | null>(null)

const routes = ref<RouteItem[]>([])
function handleSave(r: RouteItem) {
  routes.value = [...routes.value, r]
  // later you'll POST to backend here and refresh from server
}

/** Ref to the child editor so we can export segments at submit time */
const editorRef = ref<InstanceType<typeof AdminRouteEditor> | null>(null)

  const otherRoutesSegmentsRef = ref<any>([])
// Stable, controlled source of truth for the editor’s initial segments
const initialSegmentsRef = ref<Polyline[]>([])
watch(
  () => props.route?.lineJSON,
  (val) => { initialSegmentsRef.value = parseSegments(val || '') },
  { immediate: true }
)

// UI/UX state
const serverError = ref('')
const submitting = ref(false)
const saved = ref(false)
const initialLoading = ref(false)

// Validation state
const touch = reactive({ name: false, gradeIndex: false, boltsAmount: false, height: false })
const errors = reactive({ name: '', gradeIndex: '', boltsAmount: '', height: '' })

function touched(key: keyof typeof touch) {
  return touch[key]
}

function validate() {
  errors.name = form.name.trim().length ? '' : 'Route name is required.'
  errors.gradeIndex = form.gradeIndex ? '' : 'Grade is required.'

  // boltsAmount: optional but must be a non-negative integer if set
  if (rawBoltsAmount.value === null || rawBoltsAmount.value === undefined || rawBoltsAmount.value === ('' as any)) {
    errors.boltsAmount = ''
    form.boltsAmount = null
  } else if (!Number.isInteger(rawBoltsAmount.value) || rawBoltsAmount.value < 0) {
    errors.boltsAmount = 'Must be a non-negative integer.'
  } else {
    errors.boltsAmount = ''
    form.boltsAmount = rawBoltsAmount.value
  }

  // height: optional but must be a non-negative integer if set
  if (rawHeight.value === null || rawHeight.value === undefined || rawHeight.value === ('' as any)) {
    errors.height = ''
    form.height = null
  } else if (!Number.isInteger(rawHeight.value) || rawHeight.value < 0) {
    errors.height = 'Must be a non-negative integer.'
  } else {
    errors.height = ''
    form.height = rawHeight.value
  }
}

const isValid = computed(() => {
  validate()
  return !errors.name && !errors.gradeIndex && !errors.boltsAmount && !errors.height
})

async function populateExisting() {
  if (!props.route) return
  initialLoading.value = true

  // Basic hydrate (ignore unexpected fields)
  form.name = (props.route.name ?? '').toString()
  form.gradeIndex = Number.isFinite(props.route.gradeIndex) ? Number(props.route.gradeIndex) : 1
  form.lineJSON = (props.route.lineJSON ?? '').toString()
  // form.author = (props.route.author ?? '').toString()
  form.author = ''
  rawBoltsAmount.value = Number.isFinite(props.route.boltsAmount) ? Number(props.route.boltsAmount) : null
  rawHeight.value = Number.isFinite(props.route.height) ? Number(props.route.height) : null
}

onMounted(() => {
  if (props.route) populateExisting()
  loadSectorRoutes()
})

watch(() => props.route, () => {
  // When switching between routes, reload
  if (props.route) populateExisting()
})

function onCancel() {
  emit('cancel')
}

async function loadSectorRoutes() {
  const routes = await $api.routes.getAll(props.sectorId)
  routes.items.forEach(r => {
    if (props.route && props.route.id === r.id) return
    if (props.route && props.route.imageId !== r.imageId) return
    otherRoutesSegmentsRef.value.push({ polylines: parseSegments(r.lineJSON), color: '#E53935', widthPx: 6 })
  })
}

// When user clicks “Clear current path” inside the editor
function handleEditorClear() {
  initialSegmentsRef.value = [] // hide the old path for real
  form.lineJSON = ''            // ensure we don’t accidentally send the old JSON
}

async function onSubmit() {
  touch.name = touch.gradeIndex = touch.boltsAmount = touch.height = true
  validate()
  if (!isValid.value) return

  // Always pull the latest geometry (draft > initial) before sending
  try {
    const segs = editorRef.value?.exportSegments?.() as Polyline[] | undefined
    if (segs) form.lineJSON = stringifySegments(segs)
  } catch {}

  submitting.value = true
  serverError.value = ''
  saved.value = false

  // Prepare payload (omit nulls for cleaner API bodies)
  const payload: Record<string, any> = {
    name: form.name.trim(),
    gradeId: form.gradeIndex,
    sectorId: props.sectorId
  }
  if (form.boltsAmount !== null) payload.boltsAmount = form.boltsAmount
  if (form.height !== null) payload.height = form.height
  if (form.author && form.author.trim().length) payload.author = form.author.trim()
  if (form.lineJSON && form.lineJSON.trim().length) payload.lineJSON = form.lineJSON.trim()

  try {
    let res: any
    if (props.route) {
      payload.imageId = props.route.imageId
      res = await $api.routes.update(props.route.id, payload)
    } else {
      res = await $api.routes.create(payload)
    }
    saved.value = true
    emit('saved', res)

    // Reset on create
    if (!props.route) {
      form.name = ''
      form.gradeIndex = 1
      form.author = ''
      rawBoltsAmount.value = null
      rawHeight.value = null
      touch.name = touch.gradeIndex = touch.boltsAmount = touch.height = false
    }
  } catch (e: any) {
    serverError.value = e?.data?.message || e?.message || 'Save failed.'
  } finally {
    submitting.value = false
    setTimeout(() => (saved.value = false), 1600)
  }
}
</script>


<style scoped>
.badge {
  font-size: 12.8px;
  color: var(--muted);
}

.grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 16px;
  margin-top: 12px;
}

.banner {
  margin-top: 12px;
  padding: 9.6px 12.8px;
  border-radius: 12px;
  font-size: 15.2px;
}

.banner--error {
  background: #fff1f2;
  color: var(--system_error);
}

.banner--ok {
  background: #effaf3;
  color: var(--system_success);
}

@media (max-width: 640px) {
  .grid {
    grid-template-columns: 1fr;
  }
}
</style>
