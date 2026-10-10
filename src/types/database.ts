export type Business = {
  id: string
  owner_id: string
  name: string
  description?: string
  business_type: string
  location: string
  phone?: string
  email?: string
  registration_status: 'Registered (CIPC)' | 'In Progress' | 'Unregistered'
  cipc_number?: string
  created_at: string
  updated_at: string
}

export type Sale = {
  id: string
  business_id: string
  amount: number
  description: string
  payment_method: 'Cash' | 'EFT' | 'Card' | 'Other'
  sale_date: string
  created_at: string
}

export type Expense = {
  id: string
  business_id: string
  amount: number
  category: 'Stock' | 'Transport' | 'Equipment' | 'Marketing' | 'Rent' | 'Utilities' | 'Other'
  description: string
  expense_date: string
  created_at: string
}

export type Invoice = {
  id: string
  business_id: string
  customer_name: string
  amount: number
  status: 'Draft' | 'Pending' | 'Paid' | 'Overdue'
  invoice_date: string
  due_date?: string
  created_at: string
}

export type Document = {
  id: string
  business_id: string
  name: string
  type: string
  file_path?: string
  created_at: string
}

export type Opportunity = {
  id: string
  title: string
  description: string
  type: 'Funding' | 'Procurement' | 'Market Access' | 'Business Support'
  location: string
  deadline?: string
  amount?: string
  requirements: string[]
  is_active: boolean
  created_at: string
}

export type Application = {
  id: string
  business_id: string
  opportunity_id: string
  status: 'Draft' | 'Submitted' | 'Under Review' | 'Accepted' | 'Rejected'
  notes?: string
  submitted_at: string
  created_at: string
  opportunity?: Opportunity
}
