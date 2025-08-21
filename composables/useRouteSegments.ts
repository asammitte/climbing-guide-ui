// composables/useRouteSegments.ts
export type Point = [number, number]
export type Polyline = Point[]
export type Segments = Polyline[]

type Box = { w: number; h: number }
const DEFAULT_BOX: Box = { w: 1024, h: 768 }

const clamp = (n: number, min: number, max: number) => Math.min(max, Math.max(min, n))

function isValidSegments(x: any, box: Box): x is Segments {
  return Array.isArray(x) &&
    x.every(poly =>
      Array.isArray(poly) &&
      poly.length >= 2 &&
      poly.every(pt =>
        Array.isArray(pt) &&
        pt.length === 2 &&
        Number.isFinite(pt[0]) &&
        Number.isFinite(pt[1]) &&
        pt[0] >= 0 && pt[0] <= box.w &&
        pt[1] >= 0 && pt[1] <= box.h
      )
    )
}

function normalize(segs: Segments, box: Box): Segments {
  return segs.map(poly =>
    poly.map(([x, y]) => [clamp(Math.round(x), 0, box.w), clamp(Math.round(y), 0, box.h)] as Point)
  )
}

export function useRouteSegments() {
  /**
   * Robustly parse geometry. Accepts:
   * - empty/whitespace/null/undefined  -> returns []
   * - JSON string                      -> parsed/validated/normalized
   * - already-parsed array             -> validated/normalized
   */
  function parseSegments(input: unknown, box: Box = DEFAULT_BOX): Segments {
    if (input === null || input === undefined) return []
    if (Array.isArray(input)) {
      if (!isValidSegments(input, box)) throw new Error('Geometry is not a valid segments array')
      return normalize(input, box)
    }
    if (typeof input === 'string') {
      const s = input.trim()
      if (!s) return []
      let data: unknown
      try {
        data = JSON.parse(s)
      } catch {
        throw new Error('Invalid geometry JSON')
      }
      if (!isValidSegments(data, box)) throw new Error('Geometry is not a valid segments array')
      return normalize(data as Segments, box)
    }
    throw new Error('Expected geometry as JSON string or array')
  }

  /** Stringify Segments back to JSON ("[]" for empty). */
  function stringifySegments(segments: Segments | null | undefined): string {
    return JSON.stringify(segments ?? [])
  }

  /** Type guard (already-parsed value). */
  function isSegments(value: unknown, box: Box = DEFAULT_BOX): value is Segments {
    return isValidSegments(value, box)
  }

  /** Convenience: does this input contain ANY valid segments? */
  function doesRouteHasSegments(input: unknown, box: Box = DEFAULT_BOX): boolean {
    try {
      const segs = parseSegments(input, box) // tolerant of "", null, etc.
      return segs.length > 0
    } catch {
      return false
    }
  }

  return { parseSegments, stringifySegments, isSegments, doesRouteHasSegments }
}
