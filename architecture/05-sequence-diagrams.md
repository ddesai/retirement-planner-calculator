# Sequence Diagrams

The following diagrams use [Mermaid](https://mermaid.js.org/) syntax. They render automatically on GitHub and in many Markdown viewers.

---

## 1. Application Bootstrap

How the app loads from the initial HTML request to the first paint.

```mermaid
sequenceDiagram
    participant User
    participant Browser
    participant Vercel as Vercel CDN
    participant App as React App

    User->>Browser: Opens app URL
    Browser->>Vercel: GET index.html
    Vercel-->>Browser: HTML (root div, script tag)
    Browser->>Vercel: GET main.tsx bundle (JS)
    Vercel-->>Browser: JavaScript bundle
    Browser->>Browser: Parse and execute JS
    Browser->>App: createRoot(#root).render(<App />)
    App->>App: useState, render IncomeCalculator, SavingsProjection, etc.
    App->>App: Each component runs useMemo (calculations, chart data)
    App-->>Browser: Commit DOM updates
    Browser-->>User: Rendered dashboard
```

---

## 2. User Updates Income Inputs → Goal Flows to Savings

When the user changes inputs in the Income Calculator, the annual goal is propagated to the Savings Projection so the gap/surplus can be shown.

```mermaid
sequenceDiagram
    participant User
    participant IncomeCalculator
    participant App
    participant SavingsProjection

    User->>IncomeCalculator: Change current age / retirement age / spending / inflation
    IncomeCalculator->>IncomeCalculator: Recompute yearsUntilRetirement, futureSpending, totalNeeded (useMemo)
    IncomeCalculator->>IncomeCalculator: useEffect: onAnnualIncomeGoalChange(futureSpending)
    IncomeCalculator->>App: setAnnualIncomeGoal(futureSpending)
    App->>App: Re-render with new annualIncomeGoal
    App->>SavingsProjection: annualIncomeGoalAtRetirement={annualIncomeGoal}
    SavingsProjection->>SavingsProjection: Recompute finalBalance, gap vs goal (useMemo)
    SavingsProjection-->>User: Updated projected balance and gap/surplus display
```

---

## 3. User Updates Savings Inputs → Chart and Gap Update

When the user changes current savings, monthly contribution, return, or years in the Savings Projection section.

```mermaid
sequenceDiagram
    participant User
    participant SavingsProjection
    participant financeCalculations
    participant Chart

    User->>SavingsProjection: Change savings / contribution / return / years
    SavingsProjection->>SavingsProjection: setState (e.g. setCurrentSavings)
    SavingsProjection->>SavingsProjection: useMemo: projectRetirementSavings(...)
    SavingsProjection->>financeCalculations: projectRetirementSavings(currentSavings, monthlyContribution, return%, years)
    financeCalculations-->>SavingsProjection: { finalBalance, series }
    SavingsProjection->>SavingsProjection: useMemo: chartData from series
    SavingsProjection->>Chart: SavingsGrowthChart data + options
    Chart-->>User: Updated line chart and gap/surplus stats
```

---

## 4. Tax Strategy: Inputs → RMD, Taxable Income, and Guidance

When the user changes IRA balance, SS benefit, tax rate, or ages in the Tax Strategy section.

```mermaid
sequenceDiagram
    participant User
    participant TaxStrategyPlanner
    participant taxCalculations
    participant Chart

    User->>TaxStrategyPlanner: Change IRA / Roth / brokerage / SS / tax rate / ages
    TaxStrategyPlanner->>TaxStrategyPlanner: setState (e.g. setIraBalance)
    TaxStrategyPlanner->>taxCalculations: estimateFirstRMD(iraBalance)
    taxCalculations-->>TaxStrategyPlanner: firstRmd
    TaxStrategyPlanner->>taxCalculations: estimateTaxableIncome({ pension, firstRmd, socialSecurityBenefit })
    taxCalculations-->>TaxStrategyPlanner: taxableIncome
    TaxStrategyPlanner->>taxCalculations: recommendTaxMix(expectedTaxRate)
    taxCalculations-->>TaxStrategyPlanner: { taxablePercent, taxFreePercent }
    TaxStrategyPlanner->>taxCalculations: buildWithdrawalGuidance({ currentAge, retirementAge, iraBalance })
    taxCalculations-->>TaxStrategyPlanner: guidanceCards[]
    TaxStrategyPlanner->>TaxStrategyPlanner: Build incomeChartData (stacked bar)
    TaxStrategyPlanner->>Chart: IncomeSourcesChart data + options
    Chart-->>User: Updated stacked bar and strategy cards
```

---

## 5. Allocation Sliders → Pie Chart

When the user adjusts any of the five allocation sliders.

```mermaid
sequenceDiagram
    participant User
    participant AllocationPlanner
    participant Chart

    User->>AllocationPlanner: Move slider (e.g. Stocks 50% → 55%)
    AllocationPlanner->>AllocationPlanner: handleSliderChange(key, value) → setAllocations
    AllocationPlanner->>AllocationPlanner: useMemo: total, remaining; chartData from allocations
    AllocationPlanner->>Chart: AllocationPieChart data + options
    Chart-->>User: Updated pie chart and "Total: X%" / allocation message
```

---

## 6. End-to-End: No Backend

Emphasizes that all computation stays in the browser.

```mermaid
sequenceDiagram
    participant User
    participant SPA as SPA (Browser)
    participant Utils as financeCalculations / taxCalculations

    User->>SPA: Enter or change any input
    SPA->>SPA: Update React state
    SPA->>Utils: Call pure functions with current inputs
    Utils-->>SPA: Return numbers / arrays / recommendations
    SPA->>SPA: Derive chart data and display values
    SPA-->>User: Updated UI and charts

    Note over SPA,Utils: No network calls for app logic. Only initial load fetches static assets.
```
