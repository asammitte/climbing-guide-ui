<template>
  <div class="area-season-chart-component">
    <div class="chart-title">{{ t('ascentsByMonths') }}</div>

    <div class="cg-chart">
      <div class="chart-bars">
        <div
          v-for="bar in bars"
          :key="bar.key"
          class="chart-bar"
          :style="{ '--h': bar.height, '--c': bar.color }"
          :aria-label="`${t(bar.label)}: ${bar.value}`"
        >
          <div class="chart-track">
            <div class="chart-filled-box"></div>
            <div class="chart-value" v-if="bar.value > 0">{{ bar.value }}</div>
          </div>
          <div class="chart-label">{{ t(bar.label) }}</div>
        </div>
      </div>
    </div>
  </div>
</template>


<script setup lang="ts">
import { computed, reactive } from 'vue'
import { useI18n } from 'vue-i18n'

const props = defineProps<{
  ascentsByMonths: Record<number, number>[]
}>()

const { t } = useI18n({
  useScope: 'local',
  messages: {
    en: {
      ascentsByMonths: 'ASCENTS BY MONTHS',
      jan: 'JAN',
      feb: 'FEB',
      mar: 'MAR',
      apr: 'APR',
      may: 'MAY',
      jun: 'JUN',
      jul: 'JUL',
      aug: 'AUG',
      sep: 'SEP',
      oct: 'OCT',
      nov: 'NOV',
      dec: 'DEC'
    },
    ua: {
      ascentsByMonths: 'ПРОЛАЗИ ЗА МІСЯЦЬ',
      jan: 'СІЧ',
      feb: 'ЛЮТ',
      mar: 'БЕР',
      apr: 'КВІ',
      may: 'ТРА',
      jun: 'ЧЕР',
      jul: 'ЛИП',
      aug: 'СЕР',
      sep: 'ВЕР',
      oct: 'ЖОВ',
      nov: 'ЛИС',
      dec: 'ГРУ'
    },
  }
})

const labels: Array<'jan'|'feb'|'mar'|'apr'|'may'|'jun'|'jul'|'aug'|'sep'|'oct'|'nov'|'dec'> =
  ['jan','feb','mar','apr','may','jun','jul','aug','sep','oct','nov','dec']

const maxVal = computed(() => {
  const vals = Object.values(props.ascentsByMonths)
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
  labels.map((label, i) => {
    const m = i + 1
    const value = props.ascentsByMonths[m as keyof typeof props.ascentsByMonths] ?? 0
    const pct = maxVal.value > 0 ? Math.round((value / maxVal.value) * 100) : 0

    // Map 0–100% into 5 buckets: 0–19 -> 400, …, 80–100 -> 800
    const bin = maxVal.value > 0 ? Math.min(4, Math.floor(pct / 20)) : 0
    const color = palette[bin]

    return { key: m, label, value, height: `${pct}%`, color }
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
    gap: 8px; /* space between bars */
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
      height: 116px; /* chart height */
      display: flex;
      align-items: flex-end;
      border-radius: 6px;
      // background: rgba(0,0,0,0.05); /* track bg, adjust to your theme */
      overflow: hidden;
      overflow: visible;
    }

    .chart-filled-box {
      width: 100%;
      height: var(--h, 0%);
      // background: linear-gradient(180deg, rgba(0,0,0,0.12), rgba(0,0,0,0.12)) no-repeat,
      //             var(--brand-500, #2e7dd7);
      background: var(--c);
      border-top-left-radius: 6px;
      border-top-right-radius: 6px;
      transition: height .35s ease;
    }

    .chart-value {
      position: absolute;
      bottom: calc(var(--h, 0%) + 6px); /* sits just above bar top */
      left: 50%;
      transform: translateX(-50%);
      font-variant-numeric: tabular-nums;
      pointer-events: none;
    }

    /* Optional: show value only on hover if you prefer a cleaner look */
    /* .chart-value { opacity: 0; transition: opacity .2s; }
       &:hover .chart-value { opacity: 1; } */
  }
}
</style>
