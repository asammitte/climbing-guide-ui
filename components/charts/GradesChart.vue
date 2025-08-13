<template>
  <div class="area-season-chart-component">
    <div class="chart-title">{{ t('linesByGrades') }}</div>

    <div class="cg-chart">
      <div class="chart-bars">
        <div
          v-for="bar in bars"
          :key="bar.key"
          class="chart-bar"
          :style="{ '--h': bar.height, '--c': bar.color }"
          :aria-label="`${bar.label}: ${bar.value}`"
        >
          <div class="chart-track">
            <div class="chart-filled-box"></div>
            <div class="chart-value" v-if="bar.value > 0">{{ bar.value }}</div>
          </div>
          <div class="chart-label">{{ bar.label }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, reactive } from 'vue'
import { useI18n } from 'vue-i18n'

const props = defineProps<{
  totalByGrades: Record<string, number>[]
}>()

const { t } = useI18n({
  useScope: 'local',
  messages: {
    en: {
      linesByGrades: 'GRADES'
    },
    ua: {
      linesByGrades: 'КАТЕГОРІЇ'
    },
  }
})

// Natural grade ordering: 5a < 5a+ < 5b < 5b+ < 5c < 5c+ < 6a ...
const gradeScore = (g: string) => {
  const m = /^(\d+)([abc])?(\+)?$/.exec(g)
  if (!m) return Number.MAX_SAFE_INTEGER
  const base = parseInt(m[1], 10)
  const letterWeight = m[2] ? ({ a: 0, b: 2, c: 4 } as const)[m[2] as 'a'|'b'|'c'] : 0
  const plus = m[3] ? 1 : 0
  return base * 10 + letterWeight + plus
}

const labels = computed(() =>
  Object.keys(props.totalByGrades).sort((a, b) => gradeScore(a) - gradeScore(b))
)

const maxVal = computed(() => {
  const vals = Object.values(props.totalByGrades)
  return vals.length ? Math.max(...vals) : 0
})

const palette = [
  'var(--secondary_400, #acc981)',
  'var(--secondary_500, #97bc62)',
  'var(--secondary_600, #79964e)',
  'var(--secondary_700, #5b713b)',
  'var(--secondary_800, #3c4b27)',
]

const bars = computed(() =>
  labels.value.map((label) => {
    const value = props.totalByGrades[label] ?? 0
    const pct = maxVal.value > 0 ? Math.round((value / maxVal.value) * 100) : 0

    // Map 0–100% into 5 buckets: 0–19 -> 400, …, 80–100 -> 800
    const bin = maxVal.value > 0 ? Math.min(4, Math.floor(pct / 20)) : 0
    const color = palette[bin]

    return { key: label, label, value, height: `${pct}%`, color }
  })
)
</script>

<style lang="scss" scoped>
.area-season-chart-component {
  .chart-title {
    @include heading6;
    margin-bottom: 16px;
  }

  .chart-bars {
    display: flex;
    align-items: flex-end;
    gap: 8px;
    padding-top: 18px;
  }

  .chart-bar {
    flex: 1 1 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    min-width: 0;

    .chart-label,
    .chart-value {
      @include copyright;
      user-select: none;
      white-space: nowrap;
    }

    .chart-label {
      margin-top: 6px;
      text-transform: uppercase;
      letter-spacing: .04em;
    }

    .chart-track {
      position: relative;
      width: 100%;
      height: 116px;
      display: flex;
      align-items: flex-end;
      border-radius: 6px;
      overflow: visible;
    }

    .chart-filled-box {
      width: 100%;
      height: var(--h, 0%);
      background: var(--c);
      border-top-left-radius: 6px;
      border-top-right-radius: 6px;
      transition: height .35s ease;
    }

    .chart-value {
      position: absolute;
      bottom: calc(var(--h, 0%) + 6px);
      left: 50%;
      transform: translateX(-50%);
      font-variant-numeric: tabular-nums;
      pointer-events: none;
    }
  }
}
</style>
