import { useMemo, useState } from 'react'
import { formatCurrency, projectRetirementSavings } from '../utils/financeCalculations'
import { SavingsGrowthChart } from './Charts'

interface SavingsProjectionProps {
  annualIncomeGoalAtRetirement: number
}

export function SavingsProjection({ annualIncomeGoalAtRetirement }: SavingsProjectionProps) {
  const [currentSavings, setCurrentSavings] = useState(150000)
  const [monthlyContribution, setMonthlyContribution] = useState(1000)
  const [expectedReturn, setExpectedReturn] = useState(6)
  const [yearsUntilRetirement, setYearsUntilRetirement] = useState(25)

  const { finalBalance, series } = useMemo(
    () => projectRetirementSavings(currentSavings, monthlyContribution, expectedReturn, yearsUntilRetirement),
    [currentSavings, monthlyContribution, expectedReturn, yearsUntilRetirement],
  )

  const safeWithdrawalRate = 0.04
  const estimatedAnnualIncomeFromSavings = finalBalance * safeWithdrawalRate
  const gap = annualIncomeGoalAtRetirement - estimatedAnnualIncomeFromSavings

  const chartData = useMemo(
    () => ({
      labels: series.map((p) => `Year ${p.year}`),
      datasets: [
        {
          label: 'Projected balance',
          data: series.map((p) => p.balance),
          borderColor: 'rgba(16, 185, 129, 1)',
          backgroundColor: 'rgba(16, 185, 129, 0.15)',
          tension: 0.25,
        },
      ],
    }),
    [series],
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

  const hasGoal = annualIncomeGoalAtRetirement > 0

  return (
    <section className="card">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="section-title">Retirement Savings Projection</h2>
          <p className="section-subtitle">
            See how current savings and contributions may grow, and how they compare to your income goal.
          </p>
        </div>
        <span className="badge">Step 2 · Savings Path</span>
      </div>

      <div className="mt-4 grid gap-6 md:grid-cols-2">
        <div className="space-y-4">
          <div>
            <p className="input-label">Current retirement savings</p>
            <input
              type="number"
              className="number-input"
              value={currentSavings}
              min={0}
              step={5000}
              onChange={(e) => setCurrentSavings(Number(e.target.value) || 0)}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <p className="input-label">Monthly contribution</p>
              <input
                type="number"
                className="number-input"
                value={monthlyContribution}
                min={0}
                step={50}
                onChange={(e) => setMonthlyContribution(Number(e.target.value) || 0)}
              />
            </div>
            <div>
              <p className="input-label">Expected annual return</p>
              <div className="flex items-center gap-3">
                <input
                  type="range"
                  className="slider"
                  min={0}
                  max={12}
                  step={0.25}
                  value={expectedReturn}
                  onChange={(e) => setExpectedReturn(Number(e.target.value) || 0)}
                />
                <span className="text-xs tabular-nums text-slate-200">{expectedReturn.toFixed(2)}%</span>
              </div>
            </div>
          </div>

          <div>
            <p className="input-label">Years until retirement</p>
            <input
              type="number"
              className="number-input"
              value={yearsUntilRetirement}
              min={0}
              max={50}
              onChange={(e) => setYearsUntilRetirement(Number(e.target.value) || 0)}
            />
          </div>

          <div className="grid grid-cols-2 gap-4 border-t border-slate-800 pt-4 text-sm">
            <div>
              <p className="stat-label">Projected balance at retirement</p>
              <p className="stat-value">{formatCurrency(finalBalance)}</p>
            </div>
            <div>
              <p className="stat-label">Estimated annual income (4% rule)</p>
              <p className="stat-value">{formatCurrency(estimatedAnnualIncomeFromSavings)}</p>
            </div>
            {hasGoal && (
              <>
                <div>
                  <p className="stat-label">Annual income goal at retirement</p>
                  <p className="stat-value">{formatCurrency(annualIncomeGoalAtRetirement)}</p>
                </div>
                <div>
                  <p className="stat-label">{gap >= 0 ? 'Estimated income gap' : 'Estimated surplus'}</p>
                  <p className="stat-value">
                    {gap >= 0 ? formatCurrency(gap) : formatCurrency(Math.abs(gap))}
                  </p>
                </div>
              </>
            )}
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <div className="h-56 rounded-xl border border-slate-800 bg-slate-950/60 p-3">
            <SavingsGrowthChart data={chartData} options={chartOptions as any} />
          </div>
          <p className="text-[11px] text-slate-500">
            The projection uses compound growth with monthly contributions and the return rate you select. Actual
            investment results will vary and are not guaranteed.
          </p>
        </div>
      </div>
    </section>
  )
}

