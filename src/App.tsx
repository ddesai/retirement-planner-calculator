import { useState } from 'react'
import { IncomeCalculator } from './components/IncomeCalculator'
import { SavingsProjection } from './components/SavingsProjection'
import { AllocationPlanner } from './components/AllocationPlanner'
import { TaxStrategyPlanner } from './components/TaxStrategyPlanner'

function App() {
  const [annualIncomeGoal, setAnnualIncomeGoal] = useState(0)
  const [, setTotalLifetimeNeed] = useState(0)

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50">
      <header className="border-b border-slate-800 bg-slate-950/80 backdrop-blur">
        <div className="mx-auto flex max-w-6xl flex-col gap-3 px-4 py-4 sm:px-6 sm:py-5 lg:px-8 lg:py-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h1 className="text-xl font-semibold tracking-tight text-slate-50 sm:text-2xl">
                Darshan&apos;s Retirement Planning &amp; Tax Strategy Calculator
              </h1>
              <p className="mt-1 max-w-3xl text-xs text-slate-400 sm:text-sm">
                A simple, interactive dashboard to estimate retirement income needs, savings projections, investment
                diversification, and tax-efficient withdrawal strategies.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2 text-[11px] text-slate-400">
              <span className="rounded-full border border-emerald-400/30 bg-emerald-500/10 px-3 py-1 font-medium text-emerald-300">
                Educational tool only
              </span>
              <span className="hidden text-[10px] sm:inline">
                Numbers are simplified estimates and not guarantees of future results.
              </span>
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto flex max-w-6xl flex-col gap-5 px-4 py-5 sm:px-6 sm:py-6 lg:px-8 lg:py-8">
        <IncomeCalculator
          onAnnualIncomeGoalChange={setAnnualIncomeGoal}
          onTotalLifetimeNeedChange={setTotalLifetimeNeed}
        />

        <SavingsProjection annualIncomeGoalAtRetirement={annualIncomeGoal} />

        <div className="grid gap-5 lg:grid-cols-[1.1fr,1.3fr]">
          <AllocationPlanner />
          <TaxStrategyPlanner />
        </div>

        <section className="mt-2 rounded-2xl border border-slate-800 bg-slate-900/70 px-4 py-4 text-[11px] text-slate-400 sm:text-xs">
          <p className="font-semibold text-slate-200">Important educational disclaimer</p>
          <p className="mt-1">
            This calculator provides educational estimates and should not be considered financial or tax advice. Results
            are based on simplifying assumptions and do not reflect all factors that may be relevant to your situation,
            including investment risk, changing tax laws, healthcare costs, or your complete financial picture. Before
            making major financial or tax decisions, consider consulting with a qualified financial planner or tax
            professional.
          </p>
        </section>
      </main>
    </div>
  )
}

export default App
