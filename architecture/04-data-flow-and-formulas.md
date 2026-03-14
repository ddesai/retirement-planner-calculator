# Data Flow and Formulas

## Utility Modules

All business logic lives in two pure modules under `src/utils/`:

- **financeCalculations.ts** — Retirement income needs and savings projection
- **taxCalculations.ts** — RMD, taxable income, tax-mix recommendation, withdrawal guidance

No side effects (no I/O, no global state). Components call these functions and use the results for display and charts.

---

## Finance Calculations (`financeCalculations.ts`)

### Income Needs

| Function | Inputs | Output / Formula |
|----------|--------|-------------------|
| `calculateYearsUntilRetirement` | currentAge, retirementAge | `max(retirementAge - currentAge, 0)` |
| `calculateFutureSpending` | currentSpending, inflationRatePercent, yearsUntilRetirement | `currentSpending × (1 + r)^n` where `r = inflationRatePercent/100` |
| `calculateTotalRetirementIncomeNeeded` | futureAnnualSpending, retirementAge, lifeExpectancy | `yearsInRetirement = lifeExpectancy - retirementAge`; `totalNeeded = futureAnnualSpending × yearsInRetirement` |

### Savings Projection

| Function | Inputs | Output / Formula |
|----------|--------|-------------------|
| `projectRetirementSavings` | currentSavings, monthlyContribution, expectedReturnPercent, yearsUntilRetirement | Uses monthly compounding: `FV = PV(1+r)^n + PMT × [((1+r)^n − 1)/r]` with `r = annual rate/12`, `n = months`. Returns `finalBalance` and a `series` of { year, balance } for the chart. |

### Helpers

- `formatCurrency(value)` — Locale-aware USD formatting.
- `clampPercentage(value)` — Clamp to [0, 100] for allocation inputs.

---

## Tax Calculations (`taxCalculations.ts`)

### RMD and Taxable Income

| Function | Inputs | Output / Formula |
|----------|--------|-------------------|
| `estimateFirstRMD` | iraBalance, lifeExpectancyFactor (default 26.5 for age 73) | `iraBalance / lifeExpectancyFactor` |
| `estimateTaxableIncome` | pensionIncome, rmdWithdrawal, socialSecurityBenefit, socialSecurityTaxablePortion (default 0.85) | `pension + RMD + (SS × taxable portion)` |

### Recommendations

| Function | Inputs | Output |
|----------|--------|--------|
| `recommendTaxMix` | expectedRetirementTaxRatePercent | Heuristic: higher tax rate → higher recommended % tax-free (e.g. 30% up to 60% at 35%+ rate). Returns `{ taxablePercent, taxFreePercent }`. |
| `buildWithdrawalGuidance` | currentAge, retirementAge, iraBalance | Rule-based suggestions (e.g. pre-RMD window, large IRA, Roth blend). Returns array of `{ title, body }`. RMD age used in logic is 73. |

---

## Flow Between Features

1. **Income Calculator** computes `futureSpending` and `totalNeeded` and calls `onAnnualIncomeGoalChange(futureSpending)` (and `onTotalLifetimeNeedChange(totalNeeded)`).
2. **App** stores `annualIncomeGoal` and passes it to **Savings Projection** as `annualIncomeGoalAtRetirement`.
3. **Savings Projection** computes projected balance and compares a 4% withdrawal from that balance to `annualIncomeGoalAtRetirement` to show gap/surplus.
4. **Allocation Planner** and **Tax Strategy Planner** are self-contained; they only use their own inputs and the shared utils.

Chart data in each feature is derived from the same state that drives the displayed numbers (e.g. `futureSpending` for the spending chart, `series` from `projectRetirementSavings` for the savings chart), so charts stay in sync with inputs.
