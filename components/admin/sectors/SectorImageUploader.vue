<template>
  <div>
    <input type="file" accept="image/*" @change="e => file = (e.target as HTMLInputElement).files?.[0] || null" />
    <button :disabled="!file || uploading" @click="onUpload">Upload</button>

    <div v-if="last" style="margin-top:1rem">
      <p>Saved, id: {{ last.id }}</p>
      <img :src="last.urls.lg" style="max-width:320px" />
    </div>
  </div>
</template>


<script setup lang="ts">
const props = defineProps<{ sectorId: number }>()
const file = ref<File | null>(null)
const uploading = ref(false)
const last = ref<{ id: number; urls: { orig: string; lg: string; sm: string } } | null>(null)

const { uploadSectorImage } = useImageUpload()

async function onUpload() {
  if (!file.value) return
  uploading.value = true
  try {
    const res = await uploadSectorImage(file.value, props.sectorId)
    last.value = { id: res.id, urls: res.urls }
  } finally {
    uploading.value = false
  }
}
</script>
