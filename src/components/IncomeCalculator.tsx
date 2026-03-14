import { useEffect, useMemo, useState } from 'react'
import {
  calculateFutureSpending,
  calculateTotalRetirementIncomeNeeded,
  calculateYearsUntilRetirement,
  formatCurrency,
} from '../utils/financeCalculations'
import { InflationSpendingChart } from './Charts'

interface IncomeCalculatorProps {
  onAnnualIncomeGoalChange?: (annualIncomeAtRetirement: number) => void
  onTotalLifetimeNeedChange?: (totalLifetimeNeed: number) => void
}

export function IncomeCalculator({
  onAnnualIncomeGoalChange,
  onTotalLifetimeNeedChange,
}: IncomeCalculatorProps) {
  const [currentAge, setCurrentAge] = useState(40)
  const [retirementAge, setRetirementAge] = useState(65)
  const [lifeExpectancy, setLifeExpectancy] = useState(90)
  const [currentSpending, setCurrentSpending] = useState(60000)
  const [inflationRate, setInflationRate] = useState(2.5)

  const yearsUntilRetirement = useMemo(
    () => calculateYearsUntilRetirement(currentAge, retirementAge),
    [currentAge, retirementAge],
  )

  const futureSpending = useMemo(
    () => calculateFutureSpending(currentSpending, inflationRate, yearsUntilRetirement),
    [currentSpending, inflationRate, yearsUntilRetirement],
  )

  const { yearsInRetirement, totalNeeded } = useMemo(
    () => calculateTotalRetirementIncomeNeeded(futureSpending, retirementAge, lifeExpectancy),
    [futureSpending, retirementAge, lifeExpectancy],
  )

  useEffect(() => {
    onAnnualIncomeGoalChange?.(futureSpending)
  }, [futureSpending, onAnnualIncomeGoalChange])

  useEffect(() => {
    onTotalLifetimeNeedChange?.(totalNeeded)
  }, [totalNeeded, onTotalLifetimeNeedChange])

  const chartData = useMemo(
    () => ({
      labels: ['Today', `At age ${retirementAge}`],
      datasets: [
        {
          label: 'Annual Spending (Today)',
          data: [currentSpending, 0],
          borderColor: 'rgba(16, 185, 129, 1)',
          backgroundColor: 'rgba(16, 185, 129, 0.15)',
          tension: 0.3,
        },
        {
          label: 'Annual Spending (At Retirement)',
          data: [0, futureSpending],
          borderColor: 'rgba(59, 130, 246, 1)',
          backgroundColor: 'rgba(59, 130, 246, 0.15)',
          tension: 0.3,
        },
      ],
    }),
    [currentSpending, futureSpending, retirementAge],
  )

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        labels: {
          color: '#e5e7eb',
        },
      },
      tooltip: {
        callbacks: {
          label(context: any) {
            const value = context.parsed.y ?? 0
            return `${context.dataset.label}: ${formatCurrency(value)}`
          },
        },
      },
    },
    scales: {
      x: {
        ticks: { color: '#9ca3af' },
        grid: { color: 'rgba(55, 65, 81, 0.4)' },
      },
      y: {
        ticks: {
          color: '#9ca3af',
          callback(value: any) {
            if (typeof value === 'number') {
              return `$${value.toLocaleString()}`
            }
            return value
          },
        },
        grid: { color: 'rgba(55, 65, 81, 0.4)' },
      },
    },
  }

  return (
    <section className="card gradient-border">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="section-title">Retirement Income Needs</h2>
          <p className="section-subtitle">
            Estimate how much inflation-adjusted income you&apos;ll want in retirement.
          </p>
        </div>
        <span className="badge">Step 1 · Income Target</span>
      </div>

      <div className="mt-4 grid gap-6 md:grid-cols-2">
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <p className="input-label">Current age</p>
              <input
                type="number"
                className="number-input"
                value={currentAge}
                min={18}
                max={90}
                onChange={(e) => setCurrentAge(Number(e.target.value) || 0)}
              />
            </div>
            <div>
              <p className="input-label">Retirement age</p>
              <input
                type="number"
                className="number-input"
                value={retirementAge}
                min={currentAge}
                max={80}
                onChange={(e) => setRetirementAge(Number(e.target.value) || 0)}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <p className="input-label">Life expectancy</p>
              <p className="input-description">Used to estimate years you&apos;ll need income.</p>
              <input
                type="number"
                className="number-input"
                value={lifeExpectancy}
                min={retirementAge}
                max={110}
                onChange={(e) => setLifeExpectancy(Number(e.target.value) || 0)}
              />
            </div>
            <div>
              <p className="input-label">Inflation assumption</p>
              <p className="input-description">Average annual price increases before retirement.</p>
              <div className="flex items-center gap-3">
                <input
                  type="range"
                  className="slider"
                  min={0}
                  max={8}
                  step={0.25}
                  value={inflationRate}
                  onChange={(e) => setInflationRate(Number(e.target.value) || 0)}
                />
                <span className="text-xs tabular-nums text-slate-200">{inflationRate.toFixed(2)}%</span>
              </div>
            </div>
          </div>

          <div>
            <p className="input-label">Current annual spending (today&apos;s dollars)</p>
            <input
              type="number"
              className="number-input"
              value={currentSpending}
              min={0}
              step={1000}
              onChange={(e) => setCurrentSpending(Number(e.target.value) || 0)}
            />
          </div>

          <div className="grid grid-cols-2 gap-4 border-t border-slate-800 pt-4 text-sm">
            <div>
              <p className="stat-label">Years until retirement</p>
              <p className="stat-value">{yearsUntilRetirement}</p>
            </div>
            <div>
              <p className="stat-label">Years in retirement (estimate)</p>
              <p className="stat-value">{yearsInRetirement}</p>
            </div>
            <div>
              <p className="stat-label">Required annual income at retirement</p>
              <p className="stat-value">{formatCurrency(futureSpending)}</p>
            </div>
            <div>
              <p className="stat-label">Total lifetime income needed</p>
              <p className="stat-value">{formatCurrency(totalNeeded)}</p>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <div className="h-56 rounded-xl border border-slate-800 bg-slate-950/60 p-3">
            <InflationSpendingChart data={chartData} options={chartOptions as any} />
          </div>
          <p className="text-[11px] text-slate-500">
            This view compares your current annual spending to the inflation-adjusted spending level you might want at
            retirement, assuming a constant inflation rate over the years until retirement.
          </p>
        </div>
      </div>
    </section>
  )
}

