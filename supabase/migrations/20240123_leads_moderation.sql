-- Migration: Add status and user_id columns to leads table for moderation workflow

-- Add status column to leads table
-- Values: 'pending', 'approved', 'rejected'
-- New leads will be 'pending' by default
ALTER TABLE public.leads 
ADD COLUMN IF NOT EXISTS moderation_status TEXT DEFAULT 'pending' 
CHECK (moderation_status IN ('pending', 'approved', 'rejected'));

-- Add user_id column to link leads to the submitting user
ALTER TABLE public.leads 
ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id);

-- Update existing leads to 'approved' status (backward compatibility)
UPDATE public.leads SET moderation_status = 'approved' WHERE moderation_status = 'pending';

-- Enable RLS on leads table if not already enabled
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist (to recreate with new logic)
DROP POLICY IF EXISTS "Users can insert leads" ON public.leads;
DROP POLICY IF EXISTS "Users can view approved leads or own leads" ON public.leads;
DROP POLICY IF EXISTS "Admin full access to leads" ON public.leads;

-- Policy: Any authenticated user can insert new leads
CREATE POLICY "Users can insert leads" 
ON public.leads FOR INSERT 
WITH CHECK (auth.role() = 'authenticated');

-- Policy: Users can view leads that are approved OR their own leads
CREATE POLICY "Users can view approved leads or own leads" 
ON public.leads FOR SELECT 
USING (
    moderation_status = 'approved' 
    OR user_id = auth.uid()
    OR EXISTS (
        SELECT 1 FROM authorized_users 
        WHERE email = 'admin@luxemarket.com' 
        AND email = (SELECT email FROM auth.users WHERE id = auth.uid())
    )
);

-- Policy: Admin (admin@luxemarket.com) has full access to all leads
CREATE POLICY "Admin full access to leads" 
ON public.leads FOR ALL 
USING (
    EXISTS (
        SELECT 1 FROM auth.users 
        WHERE id = auth.uid() 
        AND email = 'admin@luxemarket.com'
    )
);
