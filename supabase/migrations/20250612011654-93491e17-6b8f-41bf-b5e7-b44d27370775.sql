
-- Crear tabla para almacenar comprobantes de pago enviados por usuarios
CREATE TABLE public.payment_proofs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  subscription_type TEXT NOT NULL CHECK (subscription_type IN ('basic', 'premium', 'vip')),
  payment_method TEXT NOT NULL CHECK (payment_method IN ('transferencia', 'liga_cobro')),
  payment_month TEXT NOT NULL, -- Mes del pago (ej: "2025-01")
  message TEXT, -- Mensaje opcional del usuario
  proof_image_url TEXT, -- URL de la imagen del comprobante (si la suben)
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  admin_notes TEXT, -- Notas del administrador
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Habilitar RLS en la tabla de comprobantes
ALTER TABLE public.payment_proofs ENABLE ROW LEVEL SECURITY;

-- Política para que los usuarios solo vean sus propios comprobantes
CREATE POLICY "Users can view their own payment proofs" 
  ON public.payment_proofs 
  FOR SELECT 
  USING (auth.uid() = user_id);

-- Política para que los usuarios puedan crear sus propios comprobantes
CREATE POLICY "Users can create their own payment proofs" 
  ON public.payment_proofs 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

-- Política para que los usuarios puedan actualizar sus propios comprobantes (solo si están pendientes)
CREATE POLICY "Users can update their own pending payment proofs" 
  ON public.payment_proofs 
  FOR UPDATE 
  USING (auth.uid() = user_id AND status = 'pending');

-- Política para que los admins puedan ver todos los comprobantes
CREATE POLICY "Admins can view all payment proofs" 
  ON public.payment_proofs 
  FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND user_role = 'admin'
    )
  );

-- Política para que los admins puedan actualizar cualquier comprobante
CREATE POLICY "Admins can update all payment proofs" 
  ON public.payment_proofs 
  FOR UPDATE 
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND user_role = 'admin'
    )
  );

-- Trigger para actualizar updated_at
CREATE TRIGGER update_payment_proofs_updated_at
  BEFORE UPDATE ON public.payment_proofs
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Función para que los admins actualicen la fecha de expiración de suscripción
CREATE OR REPLACE FUNCTION public.admin_update_subscription_expiry(
  target_user_id UUID, 
  new_expires_at TIMESTAMP WITH TIME ZONE, 
  reason TEXT DEFAULT NULL
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  admin_user_id UUID;
  old_expires_at TIMESTAMP WITH TIME ZONE;
BEGIN
  -- Verificar que el usuario actual es admin
  SELECT id INTO admin_user_id FROM public.profiles 
  WHERE id = auth.uid() AND user_role = 'admin';
  
  IF admin_user_id IS NULL THEN
    RETURN jsonb_build_object('error', 'No tienes permisos de administrador');
  END IF;

  -- Obtener fecha actual de expiración
  SELECT subscription_expires_at INTO old_expires_at
  FROM public.profiles 
  WHERE id = target_user_id;

  -- Actualizar fecha de expiración
  UPDATE public.profiles
  SET 
    subscription_expires_at = new_expires_at,
    updated_at = now()
  WHERE id = target_user_id;

  -- Registrar la acción del admin
  INSERT INTO public.admin_actions (
    admin_id, target_user_id, action_type, old_value, new_value, reason
  ) VALUES (
    admin_user_id, 
    target_user_id, 
    'subscription_expiry_update',
    jsonb_build_object('subscription_expires_at', old_expires_at),
    jsonb_build_object('subscription_expires_at', new_expires_at),
    reason
  );

  RETURN jsonb_build_object('success', true, 'message', 'Fecha de expiración actualizada correctamente');
END;
$$;
