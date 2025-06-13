/*
  # Payment Proof Management System

  1. New Tables
    - `payment_proofs` - User submitted payment proofs
    
  2. Security
    - RLS policies for users and admins
    - Secure file handling
    
  3. Features
    - Payment proof submission
    - Admin approval workflow
    - Status tracking
*/

-- Create payment proofs table
CREATE TABLE IF NOT EXISTS public.payment_proofs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  subscription_type TEXT NOT NULL CHECK (subscription_type IN ('basic', 'premium', 'vip')),
  payment_method TEXT NOT NULL CHECK (payment_method IN ('transferencia', 'liga_cobro')),
  payment_month TEXT NOT NULL, -- Format: "2025-01"
  message TEXT, -- Optional user message
  proof_image_url TEXT, -- Optional image proof URL
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  admin_notes TEXT, -- Admin notes
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.payment_proofs ENABLE ROW LEVEL SECURITY;

-- Users can view their own payment proofs
CREATE POLICY "Users can view their own payment proofs" 
  ON public.payment_proofs 
  FOR SELECT 
  USING (auth.uid() = user_id);

-- Users can create their own payment proofs
CREATE POLICY "Users can create their own payment proofs" 
  ON public.payment_proofs 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

-- Users can update their own pending payment proofs
CREATE POLICY "Users can update their own pending payment proofs" 
  ON public.payment_proofs 
  FOR UPDATE 
  USING (auth.uid() = user_id AND status = 'pending');

-- Admins can view all payment proofs
CREATE POLICY "Admins can view all payment proofs" 
  ON public.payment_proofs 
  FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND user_role = 'admin'
    )
  );

-- Admins can update all payment proofs
CREATE POLICY "Admins can update all payment proofs" 
  ON public.payment_proofs 
  FOR UPDATE 
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND user_role = 'admin'
    )
  );

-- Trigger for updated_at
CREATE TRIGGER update_payment_proofs_updated_at
  BEFORE UPDATE ON public.payment_proofs
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();