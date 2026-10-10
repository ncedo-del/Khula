import type { Business, Sale, Expense, Invoice, Document } from '../types/database'

export interface FinancialSummary {
  revenue: number
  expenses: number
  netProfit: number
  profitMargin: number
  recentAnomalies: { id: string; type: 'sale' | 'expense'; amount: number; description: string }[]
}

export interface ReadinessScoreBreakdown {
  total: number
  tier: 'Getting Started' | 'Building' | 'Opportunity Ready' | 'Market Ready'
  badgeColor: string
  breakdown: {
    businessProfile: { score: number; max: 10; completed: boolean; label: string }
    salesActivity: { score: number; max: 20; completed: boolean; label: string }
    expenseRecords: { score: number; max: 20; completed: boolean; label: string }
    documents: { score: number; max: 15; completed: boolean; label: string }
    registration: { score: number; max: 15; completed: boolean; label: string }
    invoiceHistory: { score: number; max: 10; completed: boolean; label: string }
    procurementProfile: { score: number; max: 10; completed: boolean; label: string }
  }
}

/**
 * Format number as South African Rand (ZAR)
 */
export function formatZAR(amount: number): string {
  return new Intl.NumberFormat('en-ZA', {
    style: 'currency',
    currency: 'ZAR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount).replace('ZAR', 'R').trim()
}

/**
 * Calculate Financial Cash Flow and Anomaly flags
 */
export function calculateFinancials(sales: Sale[], expenses: Expense[]): FinancialSummary {
  const revenue = sales.reduce((acc, s) => acc + Number(s.amount), 0)
  const totalExpenses = expenses.reduce((acc, e) => acc + Number(e.amount), 0)
  const netProfit = revenue - totalExpenses
  const profitMargin = revenue > 0 ? Math.round((netProfit / revenue) * 100) : 0

  // Anomaly check: if an individual sale/expense is >= 4x the median/avg or over R25,000
  const anomalies: FinancialSummary['recentAnomalies'] = []
  
  if (sales.length > 2) {
    const avgSale = revenue / sales.length
    sales.forEach(sale => {
      if (sale.amount > Math.max(avgSale * 4, 15000)) {
        anomalies.push({
          id: sale.id,
          type: 'sale',
          amount: sale.amount,
          description: sale.description,
        })
      }
    })
  }

  if (expenses.length > 2) {
    const avgExp = totalExpenses / expenses.length
    expenses.forEach(exp => {
      if (exp.amount > Math.max(avgExp * 4, 15000)) {
        anomalies.push({
          id: exp.id,
          type: 'expense',
          amount: exp.amount,
          description: exp.description,
        })
      }
    })
  }

  return {
    revenue,
    expenses: totalExpenses,
    netProfit,
    profitMargin,
    recentAnomalies: anomalies,
  }
}

/**
 * Compute the 0-100 Business Readiness Score based on Section 15 of build plan
 */
export function calculateReadinessScore(
  business: Business | null,
  sales: Sale[],
  expenses: Expense[],
  invoices: Invoice[] = [],
  documents: Document[] = []
): ReadinessScoreBreakdown {
  if (!business) {
    return {
      total: 0,
      tier: 'Getting Started',
      badgeColor: 'bg-slate-100 text-slate-700',
      breakdown: {
        businessProfile: { score: 0, max: 10, completed: false, label: 'Profile incomplete' },
        salesActivity: { score: 0, max: 20, completed: false, label: 'No sales logged' },
        expenseRecords: { score: 0, max: 20, completed: false, label: 'No expenses logged' },
        documents: { score: 0, max: 15, completed: false, label: 'No documents uploaded' },
        registration: { score: 0, max: 15, completed: false, label: 'Unregistered' },
        invoiceHistory: { score: 0, max: 10, completed: false, label: 'No invoice activity' },
        procurementProfile: { score: 0, max: 10, completed: false, label: 'Profile pending' },
      },
    }
  }

  // 1. Business Profile (10 pts)
  let profileScore = 0
  if (business.name && business.business_type && business.location) profileScore += 6
  if (business.description && business.description.length > 10) profileScore += 2
  if (business.phone || business.email) profileScore += 2

  // 2. Sales Activity (20 pts)
  let salesScore = 0
  if (sales.length >= 1) salesScore += 5
  if (sales.length >= 3) salesScore += 5
  if (sales.length >= 6) salesScore += 10

  // 3. Expense Records (20 pts)
  let expenseScore = 0
  if (expenses.length >= 1) expenseScore += 5
  if (expenses.length >= 3) expenseScore += 5
  if (expenses.length >= 5) expenseScore += 10

  // 4. Documents (15 pts)
  let docScore = 0
  if (documents.length >= 1) docScore += 8
  if (documents.length >= 2) docScore += 7

  // 5. Registration (15 pts)
  let regScore = 0
  if (business.registration_status === 'Registered (CIPC)') {
    regScore = 15
  } else if (business.registration_status === 'In Progress') {
    regScore = 8
  } else {
    regScore = 3
  }

  // 6. Invoice History (10 pts)
  let invoiceScore = 0
  if (invoices.length >= 1) invoiceScore += 5
  if (invoices.length >= 3) invoiceScore += 5

  // 7. Procurement Profile (10 pts)
  let procurementScore = 0
  if (business.phone && business.location && sales.length >= 2) procurementScore += 5
  if (business.description && business.registration_status !== 'Unregistered') procurementScore += 5

  const total = profileScore + salesScore + expenseScore + docScore + regScore + invoiceScore + procurementScore

  let tier: ReadinessScoreBreakdown['tier'] = 'Getting Started'
  let badgeColor = 'bg-amber-100 text-amber-800 border-amber-300'

  if (total >= 80) {
    tier = 'Market Ready'
    badgeColor = 'bg-emerald-100 text-emerald-800 border-emerald-300'
  } else if (total >= 60) {
    tier = 'Opportunity Ready'
    badgeColor = 'bg-blue-100 text-blue-800 border-blue-300'
  } else if (total >= 40) {
    tier = 'Building'
    badgeColor = 'bg-violet-100 text-violet-800 border-violet-300'
  }

  return {
    total,
    tier,
    badgeColor,
    breakdown: {
      businessProfile: {
        score: profileScore,
        max: 10,
        completed: profileScore >= 8,
        label: profileScore >= 8 ? 'Complete profile' : 'Add full description & contact details',
      },
      salesActivity: {
        score: salesScore,
        max: 20,
        completed: salesScore >= 15,
        label: `${sales.length} sale${sales.length === 1 ? '' : 's'} recorded`,
      },
      expenseRecords: {
        score: expenseScore,
        max: 20,
        completed: expenseScore >= 15,
        label: `${expenses.length} expense${expenses.length === 1 ? '' : 's'} logged`,
      },
      documents: {
        score: docScore,
        max: 15,
        completed: docScore >= 15,
        label: `${documents.length} document${documents.length === 1 ? '' : 's'} attached`,
      },
      registration: {
        score: regScore,
        max: 15,
        completed: regScore >= 15,
        label: business.registration_status,
      },
      invoiceHistory: {
        score: invoiceScore,
        max: 10,
        completed: invoiceScore >= 10,
        label: `${invoices.length} invoice${invoices.length === 1 ? '' : 's'} generated`,
      },
      procurementProfile: {
        score: procurementScore,
        max: 10,
        completed: procurementScore >= 10,
        label: procurementScore >= 10 ? 'Procurement active' : 'Complete compliance details',
      },
    },
  }
}
