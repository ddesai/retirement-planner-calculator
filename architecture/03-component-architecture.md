# Component Architecture

## Component Tree

```
main.tsx
  └── StrictMode
        └── App
              ├── header (inlined)
              ├── main
              │     ├── IncomeCalculator
              │     │     └── InflationSpendingChart (from Charts.tsx)
              │     ├── SavingsProjection
              │     │     └── SavingsGrowthChart (from Charts.tsx)
              │     ├── div (grid)
              │     │     ├── AllocationPlanner
              │     │     │     └── AllocationPieChart (from Charts.tsx)
              │     │     └── TaxStrategyPlanner
              │     │           └── IncomeSourcesChart (from Charts.tsx)
              │     └── section (disclaimer)
              └── (no router; single page)
```

## App-Level State

`App.tsx` holds the only cross-feature state:

| State | Type | Purpose |
|-------|------|---------|
| `annualIncomeGoal` | number | Output from Income Calculator; passed to Savings Projection as income target |
| `setTotalLifetimeNeed` | setter | Callback from Income Calculator (currently unused; available for future use) |

All other state is local to each feature component (inputs, derived values, chart data).

## Feature Components

| Component | Key props | Responsibility |
|------------|-----------|----------------|
| **IncomeCalculator** | `onAnnualIncomeGoalChange`, `onTotalLifetimeNeedChange` | Income needs inputs, inflation math, spending chart; notifies parent of annual goal and total lifetime need |
| **SavingsProjection** | `annualIncomeGoalAtRetirement` | Current savings, contributions, return; projects balance and compares to income goal; savings growth chart |
| **AllocationPlanner** | — | Sliders for five asset classes; ensures allocation totals 100% (feedback only); pie chart |
| **TaxStrategyPlanner** | — | IRA/Roth/brokerage, SS, pension, tax rate; RMD and taxable income estimates; withdrawal guidance cards; income-sources stacked bar chart |

## Charts Component

`Charts.tsx` exports thin wrappers around react-chartjs-2:

- `InflationSpendingChart` (Line)
- `SavingsGrowthChart` (Line)
- `AllocationPieChart` (Pie)
- `IncomeSourcesChart` (Bar)

Chart.js is registered once in this file (CategoryScale, LinearScale, Bar/Line/Arc/Point elements, Tooltip, Legend). Each parent passes `data` and `options` (and optional props) into these wrappers.

## Data Flow Summary

- **Top-down:** `annualIncomeGoal` flows from App → SavingsProjection to show gap/surplus vs. goal.
- **Bottom-up:** IncomeCalculator calls `onAnnualIncomeGoalChange(futureSpending)` and `onTotalLifetimeNeedChange(totalNeeded)` so App can update state.
- **Local:** Every feature manages its own form state and derives chart data and summary stats with `useMemo` where appropriate.
