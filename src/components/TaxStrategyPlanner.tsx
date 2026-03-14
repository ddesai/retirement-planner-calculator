import { useMemo, useState } from 'react'
import { formatCurrency } from '../utils/financeCalculations'
import {
  buildWithdrawalGuidance,
  estimateFirstRMD,
  estimateTaxableIncome,
  recommendTaxMix,
} from '../utils/taxCalculations'
import { IncomeSourcesChart } from './Charts'

export function TaxStrategyPlanner() {
  const [iraBalance, setIraBalance] = useState(500000)
  const [rothBalance, setRothBalance] = useState(150000)
  const [brokerageBalance, setBrokerageBalance] = useState(200000)
  const [pensionIncome, setPensionIncome] = useState(20000)
  const [socialSecurityAge, setSocialSecurityAge] = useState(67)
  const [socialSecurityBenefit, setSocialSecurityBenefit] = useState(28000)
  const [expectedTaxRate, setExpectedTaxRate] = useState(22)
  const [currentAge, setCurrentAge] = useState(55)
  const [retirementAge, setRetirementAge] = useState(65)

  const firstRmd = useMemo(() => estimateFirstRMD(iraBalance), [iraBalance])

  const taxableIncome = useMemo(
    () =>
      estimateTaxableIncome({
        pensionIncome,
        rmdWithdrawal: firstRmd,
        socialSecurityBenefit,
      }),
    [pensionIncome, firstRmd, socialSecurityBenefit],
  )

  const taxMix = useMemo(() => recommendTaxMix(expectedTaxRate), [expectedTaxRate])

  const guidanceCards = useMemo(
    () => buildWithdrawalGuidance({ currentAge, retirementAge, iraBalance }),
    [currentAge, retirementAge, iraBalance],
  )

  const assumedWithdrawalRate = 0.04
  const rothIncome = rothBalance * assumedWithdrawalRate
  const brokerageIncome = brokerageBalance * assumedWithdrawalRate
  const taxableSsPortion = socialSecurityBenefit * 0.85

  const taxableIncomeApprox = pensionIncome + firstRmd + brokerageIncome + taxableSsPortion
  const taxFreeIncomeApprox = rothIncome

  const incomeChartData = {
    labels: ['Retirement Income Mix'],
    datasets: [
      {
        label: 'Taxable income (IRA, brokerage, taxable SS)',
        data: [taxableIncomeApprox],
        backgroundColor: 'rgba(248, 113, 113, 0.8)',
        stack: 'income',
      },
      {
        label: 'Tax-free income (Roth, other tax-free)',
        data: [taxFreeIncomeApprox],
        backgroundColor: 'rgba(45, 212, 191, 0.8)',
        stack: 'income',
      },
      {
        label: 'Social Security (gross benefit)',
        data: [socialSecurityBenefit],
        backgroundColor: 'rgba(59, 130, 246, 0.8)',
        stack: 'income',
      },
    ],
  }

  const incomeChartOptions = {
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
        stacked: true,
        ticks: { color: '#9ca3af' },
        grid: { color: 'rgba(55, 65, 81, 0.4)' },
      },
      y: {
        stacked: true,
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
    <section className="card">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="section-title">Tax Efficient Retirement Income Strategy</h2>
          <p className="section-subtitle">
            Explore how different account types and withdrawal timing can influence taxable and tax-free income.
          </p>
        </div>
        <span className="badge">Step 4 · Tax Strategy</span>
      </div>

      <div className="mt-4 grid gap-6 lg:grid-cols-[1.4fr,1.2fr]">
        <div className="space-y-4">
          <div className="grid grid-cols-3 gap-3">
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
              <p className="input-label">Planned retirement age</p>
              <input
                type="number"
                className="number-input"
                value={retirementAge}
                min={currentAge}
                max={80}
                onChange={(e) => setRetirementAge(Number(e.target.value) || 0)}
              />
            </div>
            <div>
              <p className="input-label">Expected tax bracket in retirement</p>
              <div className="flex items-center gap-3">
                <input
                  type="range"
                  min={0}
                  max={40}
                  step={1}
                  className="slider"
                  value={expectedTaxRate}
                  onChange={(e) => setExpectedTaxRate(Number(e.target.value) || 0)}
                />
                <span className="text-xs tabular-nums text-slate-200">{expectedTaxRate.toFixed(0)}%</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <p className="input-label">Traditional IRA / 401(k) balance</p>
              <input
                type="number"
                className="number-input"
                value={iraBalance}
                min={0}
                step={5000}
                onChange={(e) => setIraBalance(Number(e.target.value) || 0)}
              />
            </div>
            <div>
              <p className="input-label">Roth IRA balance</p>
              <input
                type="number"
                className="number-input"
                value={rothBalance}
                min={0}
                step={5000}
                onChange={(e) => setRothBalance(Number(e.target.value) || 0)}
              />
            </div>
            <div>
              <p className="input-label">Brokerage / taxable account balance</p>
              <input
                type="number"
                className="number-input"
                value={brokerageBalance}
                min={0}
                step={5000}
                onChange={(e) => setBrokerageBalance(Number(e.target.value) || 0)}
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <p className="input-label">Pension / annuity income (annual)</p>
              <input
                type="number"
                className="number-input"
                value={pensionIncome}
                min={0}
                step={1000}
                onChange={(e) => setPensionIncome(Number(e.target.value) || 0)}
              />
            </div>
            <div>
              <p className="input-label">Estimated Social Security age</p>
              <input
                type="number"
                className="number-input"
                value={socialSecurityAge}
                min={62}
                max={70}
                onChange={(e) => setSocialSecurityAge(Number(e.target.value) || 0)}
              />
            </div>
            <div>
              <p className="input-label">Estimated Social Security benefit (annual)</p>
              <input
                type="number"
                className="number-input"
                value={socialSecurityBenefit}
                min={0}
                step={1000}
                onChange={(e) => setSocialSecurityBenefit(Number(e.target.value) || 0)}
              />
            </div>
          </div>

          <div className="grid gap-4 border-t border-slate-800 pt-4 text-sm md:grid-cols-3">
            <div>
              <p className="stat-label">First Required Minimum Distribution (RMD) at age 73</p>
              <p className="stat-value">{formatCurrency(firstRmd)}</p>
            </div>
            <div>
              <p className="stat-label">Estimated taxable income (pension, RMD, taxable Social Security)</p>
              <p className="stat-value">{formatCurrency(taxableIncome)}</p>
            </div>
            <div>
              <p className="stat-label">Recommended mix of retirement income</p>
              <p className="stat-value">
                {taxMix.taxFreePercent.toFixed(0)}% tax-free / {taxMix.taxablePercent.toFixed(0)}% taxable
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="h-56 rounded-xl border border-slate-800 bg-slate-950/60 p-3">
            <IncomeSourcesChart data={incomeChartData} options={incomeChartOptions as any} />
          </div>
          <div className="space-y-2 text-xs text-slate-200">
            <h3 className="font-semibold text-slate-50">Withdrawal timing guidance</h3>
            <div className="grid gap-2 md:grid-cols-2">
              {guidanceCards.map((card) => (
                <div key={card.title} className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-3">
                  <p className="mb-1 text-[11px] font-semibold uppercase tracking-wide text-emerald-300">
                    Strategy suggestion
                  </p>
                  <p className="text-sm font-medium text-slate-50">{card.title}</p>
                  <p className="mt-1 text-[11px] leading-relaxed text-slate-400">{card.body}</p>
                </div>
              ))}
            </div>
            <p className="mt-2 text-[10px] text-slate-500">
              These strategies are simplified rules of thumb. They do not account for all factors such as state taxes,
              future tax law changes, healthcare costs, or legacy goals.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}

