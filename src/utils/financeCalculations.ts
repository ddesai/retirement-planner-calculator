export function calculateYearsUntilRetirement(currentAge: number, retirementAge: number): number {
  return Math.max(retirementAge - currentAge, 0)
}

export function calculateFutureSpending(
  currentSpending: number,
  inflationRatePercent: number,
  yearsUntilRetirement: number,
): number {
  const r = inflationRatePercent / 100
  return currentSpending * (1 + r) ** yearsUntilRetirement
}

export function calculateTotalRetirementIncomeNeeded(
  futureAnnualSpending: number,
  retirementAge: number,
  lifeExpectancy: number,
): { yearsInRetirement: number; totalNeeded: number } {
  const yearsInRetirement = Math.max(lifeExpectancy - retirementAge, 0)
  return {
    yearsInRetirement,
    totalNeeded: futureAnnualSpending * yearsInRetirement,
  }
}

export interface SavingsProjectionPoint {
  year: number
  balance: number
}

export function projectRetirementSavings(
  currentSavings: number,
  monthlyContribution: number,
  expectedReturnPercent: number,
  yearsUntilRetirement: number,
): { finalBalance: number; series: SavingsProjectionPoint[] } {
  const rMonthly = expectedReturnPercent / 100 / 12
  const n = Math.max(Math.round(yearsUntilRetirement * 12), 0)

  let balance = currentSavings
  const series: SavingsProjectionPoint[] = []

  for (let month = 1; month <= n; month++) {
    balance = balance * (1 + rMonthly) + monthlyContribution
    if (month % 12 === 0 || month === n) {
      series.push({
        year: month / 12,
        balance,
      })
    }
  }

  // Closed-form future value, useful for consistency with the provided formula
  const futureValueLump = currentSavings * (1 + rMonthly) ** n
  const futureValueContrib =
    rMonthly === 0 ? monthlyContribution * n : monthlyContribution * (((1 + rMonthly) ** n - 1) / rMonthly)

  return {
    finalBalance: futureValueLump + futureValueContrib,
    series,
  }
}

export function formatCurrency(value: number): string {
  if (!Number.isFinite(value)) return '$0'
  return value.toLocaleString(undefined, {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  })
}

export function clampPercentage(value: number): number {
  if (Number.isNaN(value)) return 0
  return Math.min(Math.max(value, 0), 100)
}

