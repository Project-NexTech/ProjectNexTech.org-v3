'use client'

import {
  Bar,
  BarChart,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import type { ValueType } from 'recharts/types/component/DefaultTooltipContent'

import { VERDICT_BREAKDOWN, type BreakdownEntry, type Verdict } from '@/data/dashboard'
import s from './Charts.module.css'

/**
 * The Dashboard's two chart shapes, in their own module so `next/dynamic` has
 * something to split on — Recharts is ~370 kB and nothing above the fold needs
 * it (NEXTJS_MIGRATION.md §2.6). It is SSR-safe, so this loads normally rather
 * than with `ssr: false`; only Leaflet needs that.
 *
 * Charts pull from the theme rather than hardcoding hex, so a token change
 * recolors them along with everything else.
 */
const CHART_COLORS = [
  'var(--accent)',
  'var(--accent-alt)',
  'var(--pnt-orange-soft)',
  'var(--pnt-blue-dim)',
  'var(--pnt-orange-dim)',
  'var(--tier-silver)',
  'var(--text-faint)',
]

export const VERDICT_COLORS: Record<Verdict, string> = {
  Approved: 'var(--accent)',
  Unverified: 'var(--accent-alt)',
  Denied: 'var(--text-faint)',
}

/* Recharts styles its tooltip inline, so these cannot move to the module. */
const TOOLTIP_STYLE = {
  contentStyle: {
    background: 'var(--surface-raised)',
    border: '1px solid var(--border-strong)',
    borderRadius: 4,
    fontSize: 12,
  },
  labelStyle: { color: 'var(--heading)' },
  itemStyle: { color: 'var(--text)' },
}

/* Recharts types the formatter's value as possibly undefined, so this takes
   the library's own ValueType rather than narrowing it. */
const asHours = (value: ValueType | undefined) => `${value ?? 0} hrs`

export function VerdictChart() {
  return (
    <div className={s.donut}>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={[...VERDICT_BREAKDOWN]}
            dataKey="value"
            nameKey="label"
            innerRadius={45}
            outerRadius={70}
            stroke="var(--surface)"
            strokeWidth={2}
          >
            {VERDICT_BREAKDOWN.map((entry) => (
              <Cell key={entry.label} fill={VERDICT_COLORS[entry.label as Verdict]} />
            ))}
          </Pie>
          <Tooltip {...TOOLTIP_STYLE} formatter={asHours} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  )
}

/** Height is per-row rather than fixed, so a longer list is not squashed. */
export function BreakdownChart({ data }: { data: readonly BreakdownEntry[] }) {
  return (
    <div style={{ height: data.length * 30 + 20 }}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={[...data]} layout="vertical" margin={{ left: 0, right: 16 }}>
          <XAxis type="number" hide />
          <YAxis
            type="category"
            dataKey="label"
            width={170}
            tick={{ fill: 'var(--text-muted)', fontSize: 11 }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip
            {...TOOLTIP_STYLE}
            cursor={{ fill: 'var(--surface-raised)' }}
            formatter={asHours}
          />
          <Bar dataKey="value" radius={2} barSize={12}>
            {data.map((entry, index) => (
              <Cell key={entry.label} fill={CHART_COLORS[index % CHART_COLORS.length]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
