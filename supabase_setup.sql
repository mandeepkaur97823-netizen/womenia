-- ============================================================================
-- WOMANIA BOUTIQUE (SRI GANGANAGAR) - SUPABASE DATABASE SETUP
-- ============================================================================
-- Run this complete script in your Supabase SQL Editor (supabase.com -> SQL Editor -> New Query -> Run)
-- This creates the tables for orders and enquiries with full cloud sync.

-- 1. Create ORDERS table
CREATE TABLE IF NOT EXISTS public.orders (
    order_id TEXT PRIMARY KEY,
    date TEXT,
    customer_name TEXT NOT NULL,
    phone TEXT NOT NULL,
    email TEXT,
    address TEXT NOT NULL,
    city TEXT NOT NULL,
    state TEXT NOT NULL,
    pincode TEXT NOT NULL,
    items JSONB NOT NULL DEFAULT '[]'::jsonb,
    subtotal NUMERIC NOT NULL DEFAULT 0,
    shipping NUMERIC NOT NULL DEFAULT 0,
    total NUMERIC NOT NULL DEFAULT 0,
    payment_method TEXT NOT NULL DEFAULT 'upi',
    status TEXT NOT NULL DEFAULT 'Confirmed',
    notes TEXT,
    cancellation_reason TEXT,
    cancelled_at TEXT,
    updated_at TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Index frequently searched fields
CREATE INDEX IF NOT EXISTS idx_orders_phone ON public.orders(phone);
CREATE INDEX IF NOT EXISTS idx_orders_status ON public.orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON public.orders(created_at DESC);

-- 2. Create ENQUIRIES table
CREATE TABLE IF NOT EXISTS public.enquiries (
    id TEXT PRIMARY KEY,
    date TEXT,
    name TEXT NOT NULL,
    phone TEXT NOT NULL,
    email TEXT,
    message TEXT NOT NULL,
    product_interest TEXT,
    status TEXT NOT NULL DEFAULT 'New',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_enquiries_status ON public.enquiries(status);
CREATE INDEX IF NOT EXISTS idx_enquiries_created_at ON public.enquiries(created_at DESC);

-- 3. Row Level Security (RLS) Configuration
-- For a public boutique storefront with guest checkout, anonymous visitors must be able to insert orders
-- and view their own orders via phone/orderId tracking, while the boutique admin views all orders.

ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.enquiries ENABLE ROW LEVEL SECURITY;

-- Drop any existing policies to prevent conflicts
DROP POLICY IF EXISTS "Public can insert orders" ON public.orders;
DROP POLICY IF EXISTS "Public can view orders" ON public.orders;
DROP POLICY IF EXISTS "Public can update orders" ON public.orders;

DROP POLICY IF EXISTS "Public can insert enquiries" ON public.enquiries;
DROP POLICY IF EXISTS "Public can view enquiries" ON public.enquiries;
DROP POLICY IF EXISTS "Public can update enquiries" ON public.enquiries;
DROP POLICY IF EXISTS "Public can delete enquiries" ON public.enquiries;

-- Allow anonymous customer checkout & admin reading/updating
CREATE POLICY "Public can insert orders" ON public.orders
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Public can view orders" ON public.orders
    FOR SELECT USING (true);

CREATE POLICY "Public can update orders" ON public.orders
    FOR UPDATE USING (true);

-- Enquiries policies
CREATE POLICY "Public can insert enquiries" ON public.enquiries
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Public can view enquiries" ON public.enquiries
    FOR SELECT USING (true);

CREATE POLICY "Public can update enquiries" ON public.enquiries
    FOR UPDATE USING (true);

CREATE POLICY "Public can delete enquiries" ON public.enquiries
    FOR DELETE USING (true);

-- 4. Enable Realtime updates so Admin receives live order alerts automatically
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables 
    WHERE pubname = 'supabase_realtime' AND schemaname = 'public' AND tablename = 'orders'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.orders;
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables 
    WHERE pubname = 'supabase_realtime' AND schemaname = 'public' AND tablename = 'enquiries'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.enquiries;
  END IF;
END $$;
