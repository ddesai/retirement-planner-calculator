import { useMemo, useState } from 'react'
import { clampPercentage } from '../utils/financeCalculations'
import { AllocationPieChart } from './Charts'

const ASSET_KEYS = ['stocks', 'pension', 'myga', 'fia', 'realEstate'] as const
type AssetKey = (typeof ASSET_KEYS)[number]

const LABELS: Record<AssetKey, string> = {
  stocks: 'Stock market',
  pension: 'Pension / lifetime annuity',
  myga: 'MYGA',
  fia: 'FIA',
  realEstate: 'Real estate',
}

export function AllocationPlanner() {
  const [allocations, setAllocations] = useState<Record<AssetKey, number>>({
    stocks: 50,
    pension: 20,
    myga: 10,
    fia: 10,
    realEstate: 10,
  })

  const total = useMemo(
    () => ASSET_KEYS.reduce((sum, key) => sum + (allocations[key] ?? 0), 0),
    [allocations],
  )
  const remaining = 100 - total

  const handleSliderChange = (key: AssetKey, value: number) => {
    setAllocations((prev) => ({
      ...prev,
      [key]: clampPercentage(value),
    }))
  }

  const chartData = useMemo(
    () => ({
      labels: ASSET_KEYS.map((k) => LABELS[k]),
      datasets: [
        {
          data: ASSET_KEYS.map((k) => allocations[k]),
          backgroundColor: [
            'rgba(16, 185, 129, 0.8)',
            'rgba(59, 130, 246, 0.8)',
            'rgba(234, 179, 8, 0.8)',
            'rgba(236, 72, 153, 0.8)',
            'rgba(96, 165, 250, 0.8)',
          ],
          borderColor: 'rgba(15, 23, 42, 1)',
          borderWidth: 1,
        },
      ],
    }),
    [allocations],
  )

  const chartOptions = {
    plugins: {
      legend: {
        position: 'bottom' as const,
        labels: {
          color: '#e5e7eb',
        },
      },
    },
  }

  return (
    <section className="card">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="section-title">Investment Diversification</h2>
          <p className="section-subtitle">
            Allocate your retirement assets across multiple categories. Aim for a total of 100%.
          </p>
        </div>
        <span className="badge">Step 3 · Diversification</span>
      </div>

      <div className="mt-4 grid gap-6 md:grid-cols-2">
        <div className="space-y-3">
          {ASSET_KEYS.map((key) => (
            <div key={key} className="rounded-xl border border-slate-800 bg-slate-900/60 px-3 py-2.5">
              <div className="flex items-center justify-between text-xs text-slate-300">
                <span>{LABELS[key]}</span>
                <span className="tabular-nums text-slate-100">{allocations[key].toFixed(0)}%</span>
              </div>
              <input
                type="range"
                min={0}
                max={100}
                step={1}
                className="slider"
                value={allocations[key]}
                onChange={(e) => handleSliderChange(key, Number(e.target.value) || 0)}
              />
            </div>
          ))}

          <div className="mt-2 flex items-center justify-between text-xs">
            <span
              className={
                total === 100 ? 'text-emerald-400' : remaining > 0 ? 'text-amber-300' : 'text-rose-300'
              }
            >
              {total === 100
                ? 'Allocation totals 100%.'
                : remaining > 0
                  ? `You have ${remaining.toFixed(0)}% unallocated.`
                  : `You are over-allocated by ${Math.abs(remaining).toFixed(0)}%.`}
            </span>
            <span className="text-slate-400">
              Total: <span className="font-semibold text-slate-100">{total.toFixed(0)}%</span>
            </span>
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <div className="h-56 rounded-xl border border-slate-800 bg-slate-950/60 p-3">
            <AllocationPieChart data={chartData} options={chartOptions as any} />
          </div>
          <ul className="space-y-1.5 text-[11px] text-slate-400">
            <li>• Stock market exposure can offer long-term growth but comes with volatility.</li>
            <li>• Pension and lifetime income annuities can help create stable retirement paychecks.</li>
            <li>• MYGAs, FIAs, and real estate may provide diversification away from traditional equities.</li>
          </ul>
        </div>
      </div>
    </section>
  )
}

