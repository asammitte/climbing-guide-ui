// /ui/composables/useImageUpload.ts

type FinalizeResponse = {
  id: number
  baseKey: string
  urls: { orig: string; lg: string; sm: string }
}

type PresignResponse = {
  key: string
  uploadUrl: string         // absolute (S3/MinIO) or relative (Local API)
  expiresInSeconds: number
  method?: 'PUT' | 'POST'   // default: PUT
}

export function useImageUpload() {
  const cfg = useRuntimeConfig()
  const cdnBase = (cfg.public.cdnBaseUrl || '').replace(/\/$/, '')

  // We always talk to the .NET API through Nuxt’s proxy.
  // Your server/api/[...].ts forwards /api/dotnet/* → http://api:8080/api/*
  const apiBase = '/api/dotnet'

  // Normalize any upload URL the API returns:
  // - If absolute (http/https) → use as-is (S3/MinIO)
  // - If relative and begins with /api/ → rewrite to /api/dotnet/... (through Nuxt proxy)
  // - Else → leave as-is (relative to current origin)
  function normalizeUploadUrl(url: string) {
    if (/^https?:\/\//i.test(url)) return url
    if (url.startsWith('/api/')) return '/api/dotnet' + url.slice(4)
    return url
  }

  async function presign(file: File): Promise<PresignResponse> {
    return await $fetch<PresignResponse>(`${apiBase}/images/presign-upload`, {
      method: 'POST',
      body: { fileName: file.name, contentType: file.type }
    })
  }

  async function uploadBinary(uploadUrl: string, method: 'PUT' | 'POST', file: File) {
    const target = normalizeUploadUrl(uploadUrl)
    const res = await fetch(target, {
      method,
      // Only set Content-Type for PUT; many presigned POST handlers prefer raw body or their own headers
      headers: method === 'PUT' ? { 'Content-Type': file.type } : undefined,
      body: file
    })
    if (!res.ok) {
      const text = await res.text().catch(() => '')
      throw new Error(`Upload failed (${res.status}): ${text}`)
    }
  }

  async function finalizeSector(sectorId: number, uploadedKey: string): Promise<FinalizeResponse> {
    return await $fetch<FinalizeResponse>(`${apiBase}/images/sectors/${sectorId}/finalize`, {
      method: 'POST',
      body: { uploadedKey }
    })
  }

  /** Public helper — upload a Sector image end-to-end */
  async function uploadSectorImage(file: File, sectorId: number): Promise<FinalizeResponse> {
    if (!file) throw new Error('No file provided')

    // 1) presign
    const p = await presign(file)

    // 2) upload (S3: PUT to MinIO/S3; Local: POST to API endpoint, possibly relative)
    const method = (p.method ?? 'PUT').toUpperCase() as 'PUT' | 'POST'
    await uploadBinary(p.uploadUrl, method, file)

    // 3) finalize & persist
    return await finalizeSector(sectorId, p.key)
  }

  /** Build a CDN URL if you only have baseKey (API already returns urls in finalize) */
  function cdnUrl(baseKey: string, size: 'orig' | 'lg' | 'sm' = 'lg') {
    return `${cdnBase}/${baseKey}@${size}.webp`
  }

  return {
    uploadSectorImage,
    cdnUrl
  }
}
