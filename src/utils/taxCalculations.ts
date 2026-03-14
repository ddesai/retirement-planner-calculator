export function estimateFirstRMD(iraBalance: number, lifeExpectancyFactor = 26.5): number {
  if (iraBalance <= 0 || lifeExpectancyFactor <= 0) return 0
  return iraBalance / lifeExpectancyFactor
}

export interface TaxableIncomeInputs {
  pensionIncome: number
  rmdWithdrawal: number
  socialSecurityBenefit: number
  socialSecurityTaxablePortion?: number // 0–1, default 0.85
}

export function estimateTaxableIncome({
  pensionIncome,
  rmdWithdrawal,
  socialSecurityBenefit,
  socialSecurityTaxablePortion = 0.85,
}: TaxableIncomeInputs): number {
  const taxableSs = socialSecurityBenefit * socialSecurityTaxablePortion
  return Math.max(pensionIncome, 0) + Math.max(rmdWithdrawal, 0) + Math.max(taxableSs, 0)
}

export interface TaxMixRecommendation {
  taxablePercent: number
  taxFreePercent: number
}

export function recommendTaxMix(expectedRetirementTaxRatePercent: number): TaxMixRecommendation {
  const rate = Math.max(expectedRetirementTaxRatePercent, 0)

  // Simple heuristic: higher expected tax rate → favor more tax-free income
  let taxFreePercent = 30
  if (rate >= 35) taxFreePercent = 60
  else if (rate >= 28) taxFreePercent = 50
  else if (rate >= 22) taxFreePercent = 40

  const taxablePercent = 100 - taxFreePercent
  return { taxablePercent, taxFreePercent }
}

export interface WithdrawalGuidanceInput {
  currentAge: number
  retirementAge: number
  iraBalance: number
}

export interface WithdrawalGuidance {
  title: string
  body: string
}

export function buildWithdrawalGuidance(input: WithdrawalGuidanceInput): WithdrawalGuidance[] {
  const { currentAge, retirementAge, iraBalance } = input
  const messages: WithdrawalGuidance[] = []

  const rmdAge = 73

  if (retirementAge < rmdAge) {
    messages.push({
      title: 'Use pre-RMD window',
      body:
        'Because your planned retirement age is before age 73, consider drawing some taxable retirement funds between retirement and age 72 to reduce future Required Minimum Distributions (RMDs).',
    })
  }

  if (iraBalance > 500_000) {
    messages.push({
      title: 'Manage large IRA balance',
      body:
        'A larger traditional IRA balance can create sizable RMDs. Consider partial Roth conversions or planned withdrawals before age 73 to spread taxable income across more years.',
    })
  }

  if (currentAge < rmdAge && iraBalance > 0) {
    messages.push({
      title: 'Blend taxable and tax-free income',
      body:
        'Tax-free income sources such as Roth accounts may be especially valuable later in retirement, when RMDs and Social Security benefits could push you into higher tax brackets.',
    })
  }

  if (messages.length === 0) {
    messages.push({
      title: 'Customize with a professional',
      body:
        'Withdrawal timing can be complex. Consider working with a qualified financial or tax professional to tailor a withdrawal strategy to your situation.',
    })
  }

  return messages
}

