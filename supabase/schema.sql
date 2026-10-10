-- ==============================================================================
-- BUSINESS PASSPORT - SUPABASE DATABASE SCHEMA & MIGRATIONS
-- Run this in your Supabase Project SQL Editor (https://supabase.com/dashboard)
-- ==============================================================================

-- 1. Enable UUID Extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Businesses Table
CREATE TABLE IF NOT EXISTS public.businesses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    owner_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    description TEXT,
    business_type TEXT NOT NULL, -- e.g., 'Catering', 'Retail', 'Car Wash', 'Services', 'Agriculture', 'Tech'
    location TEXT NOT NULL, -- e.g., 'Soweto, Gauteng'
    phone TEXT,
    email TEXT,
    registration_status TEXT DEFAULT 'Unregistered', -- 'Registered (CIPC)', 'In Progress', 'Unregistered'
    cipc_number TEXT,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Sales Table
CREATE TABLE IF NOT EXISTS public.sales (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    business_id UUID NOT NULL REFERENCES public.businesses(id) ON DELETE CASCADE,
    amount NUMERIC(12, 2) NOT NULL CHECK (amount > 0),
    description TEXT NOT NULL,
    payment_method TEXT NOT NULL, -- 'Cash', 'EFT', 'Card', 'Other'
    sale_date DATE DEFAULT CURRENT_DATE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. Expenses Table
CREATE TABLE IF NOT EXISTS public.expenses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    business_id UUID NOT NULL REFERENCES public.businesses(id) ON DELETE CASCADE,
    amount NUMERIC(12, 2) NOT NULL CHECK (amount > 0),
    category TEXT NOT NULL, -- 'Stock', 'Transport', 'Equipment', 'Marketing', 'Rent', 'Utilities', 'Other'
    description TEXT NOT NULL,
    expense_date DATE DEFAULT CURRENT_DATE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 5. Invoices Table
CREATE TABLE IF NOT EXISTS public.invoices (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    business_id UUID NOT NULL REFERENCES public.businesses(id) ON DELETE CASCADE,
    customer_name TEXT NOT NULL,
    amount NUMERIC(12, 2) NOT NULL CHECK (amount > 0),
    status TEXT DEFAULT 'Pending', -- 'Draft', 'Pending', 'Paid', 'Overdue'
    invoice_date DATE DEFAULT CURRENT_DATE NOT NULL,
    due_date DATE,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 6. Documents Table
CREATE TABLE IF NOT EXISTS public.documents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    business_id UUID NOT NULL REFERENCES public.businesses(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    type TEXT NOT NULL, -- 'Proof of Address', 'ID Document', 'CIPC Certificate', 'Bank Confirmation', 'Tax Clearance', 'Menu/Price List'
    file_path TEXT,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 7. Opportunities Table
CREATE TABLE IF NOT EXISTS public.opportunities (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    type TEXT NOT NULL, -- 'Funding', 'Procurement', 'Market Access', 'Business Support'
    location TEXT NOT NULL,
    deadline DATE,
    amount TEXT, -- e.g. 'R25,000' or 'Up to R100,000'
    requirements TEXT[] DEFAULT '{}',
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 8. Applications Table
CREATE TABLE IF NOT EXISTS public.applications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    business_id UUID NOT NULL REFERENCES public.businesses(id) ON DELETE CASCADE,
    opportunity_id UUID NOT NULL REFERENCES public.opportunities(id) ON DELETE CASCADE,
    status TEXT DEFAULT 'Submitted', -- 'Draft', 'Submitted', 'Under Review', 'Accepted', 'Rejected'
    notes TEXT,
    submitted_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 9. Notifications Table
CREATE TABLE IF NOT EXISTS public.notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    read BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ==============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================

ALTER TABLE public.businesses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sales ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.expenses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.opportunities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- Helper function to check business ownership
CREATE OR REPLACE FUNCTION public.is_business_owner(b_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.businesses
    WHERE id = b_id AND owner_id = auth.uid()
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Businesses Policies
CREATE POLICY "Users can view their own businesses"
ON public.businesses FOR SELECT
TO authenticated
USING (owner_id = auth.uid());

CREATE POLICY "Users can insert their own businesses"
ON public.businesses FOR INSERT
TO authenticated
WITH CHECK (owner_id = auth.uid());

CREATE POLICY "Users can update their own businesses"
ON public.businesses FOR UPDATE
TO authenticated
USING (owner_id = auth.uid())
WITH CHECK (owner_id = auth.uid());

CREATE POLICY "Users can delete their own businesses"
ON public.businesses FOR DELETE
TO authenticated
USING (owner_id = auth.uid());

-- Sales Policies
CREATE POLICY "Users can view sales for their business"
ON public.sales FOR SELECT
TO authenticated
USING (public.is_business_owner(business_id));

CREATE POLICY "Users can insert sales for their business"
ON public.sales FOR INSERT
TO authenticated
WITH CHECK (public.is_business_owner(business_id));

CREATE POLICY "Users can update sales for their business"
ON public.sales FOR UPDATE
TO authenticated
USING (public.is_business_owner(business_id));

CREATE POLICY "Users can delete sales for their business"
ON public.sales FOR DELETE
TO authenticated
USING (public.is_business_owner(business_id));

-- Expenses Policies
CREATE POLICY "Users can view expenses for their business"
ON public.expenses FOR SELECT
TO authenticated
USING (public.is_business_owner(business_id));

CREATE POLICY "Users can insert expenses for their business"
ON public.expenses FOR INSERT
TO authenticated
WITH CHECK (public.is_business_owner(business_id));

CREATE POLICY "Users can update expenses for their business"
ON public.expenses FOR UPDATE
TO authenticated
USING (public.is_business_owner(business_id));

CREATE POLICY "Users can delete expenses for their business"
ON public.expenses FOR DELETE
TO authenticated
USING (public.is_business_owner(business_id));

-- Invoices Policies
CREATE POLICY "Users can view invoices for their business"
ON public.invoices FOR SELECT
TO authenticated
USING (public.is_business_owner(business_id));

CREATE POLICY "Users can insert invoices for their business"
ON public.invoices FOR INSERT
TO authenticated
WITH CHECK (public.is_business_owner(business_id));

CREATE POLICY "Users can update invoices for their business"
ON public.invoices FOR UPDATE
TO authenticated
USING (public.is_business_owner(business_id));

-- Documents Policies
CREATE POLICY "Users can view documents for their business"
ON public.documents FOR SELECT
TO authenticated
USING (public.is_business_owner(business_id));

CREATE POLICY "Users can insert documents for their business"
ON public.documents FOR INSERT
TO authenticated
WITH CHECK (public.is_business_owner(business_id));

-- Opportunities Policies (Readable by any authenticated or anonymous user)
CREATE POLICY "Anyone can view active opportunities"
ON public.opportunities FOR SELECT
TO authenticated, anon
USING (is_active = true);

-- Applications Policies
CREATE POLICY "Users can view their business applications"
ON public.applications FOR SELECT
TO authenticated
USING (public.is_business_owner(business_id));

CREATE POLICY "Users can submit applications for their business"
ON public.applications FOR INSERT
TO authenticated
WITH CHECK (public.is_business_owner(business_id));

-- Notifications Policies
CREATE POLICY "Users can view their notifications"
ON public.notifications FOR SELECT
TO authenticated
USING (user_id = auth.uid());

CREATE POLICY "Users can update their notifications"
ON public.notifications FOR UPDATE
TO authenticated
USING (user_id = auth.uid());

-- ==============================================================================
-- REALTIME SUBSCRIPTIONS
-- ==============================================================================
-- Add tables to supabase_realtime publication
ALTER PUBLICATION supabase_realtime ADD TABLE public.sales;
ALTER PUBLICATION supabase_realtime ADD TABLE public.expenses;
ALTER PUBLICATION supabase_realtime ADD TABLE public.businesses;
ALTER PUBLICATION supabase_realtime ADD TABLE public.applications;

-- ==============================================================================
-- SEED DATA: Opportunities tailored to young township & rural entrepreneurs
-- ==============================================================================

INSERT INTO public.opportunities (title, description, type, location, deadline, amount, requirements)
VALUES
(
    'Youth Township Micro-Grant',
    'Financial grant support for youth-owned township micro-enterprises looking to purchase raw materials, inventory, or essential equipment.',
    'Funding',
    'South Africa (Nationwide)',
    CURRENT_DATE + INTERVAL '30 days',
    'R25,000',
    ARRAY['Must be 18-35 years old', 'Active trading for at least 1 month', 'Proof of business location', 'Recorded sales activity']
),
(
    'Local Retail Fresh Produce & Catering Supply',
    'Procurement opportunity to supply fresh produce, baked goods, or catering services to regional corporate events and local supermarkets.',
    'Procurement',
    'Gauteng & Surrounding',
    CURRENT_DATE + INTERVAL '45 days',
    'Contracts R15,000 - R80,000',
    ARRAY['Active Business Passport', 'Food hygiene awareness or certificate', 'Consistent sales record', 'Banking confirmation']
),
(
    'Township Auto & Car Wash Equipment Boost',
    'Equipment voucher and technical business mentorship program for car wash and roadside automotive services.',
    'Business Support',
    'Soweto, Gauteng',
    CURRENT_DATE + INTERVAL '20 days',
    'R15,000 Voucher + Mentorship',
    ARRAY['Operating car wash or mechanic stall', 'Expense and cash flow logs', 'Readiness score > 50%']
),
(
    'Rural Artisan & Craft Formal Market Access',
    'Connecting rural handmade crafts, textile makers, and artisans with high-traffic urban exhibition spaces and e-commerce distribution.',
    'Market Access',
    'KwaZulu-Natal / Eastern Cape',
    CURRENT_DATE + INTERVAL '60 days',
    'Market Access & Exhibition Stand',
    ARRAY['Product samples or catalog', 'Owner South African citizen', 'Record of previous sales']
);
