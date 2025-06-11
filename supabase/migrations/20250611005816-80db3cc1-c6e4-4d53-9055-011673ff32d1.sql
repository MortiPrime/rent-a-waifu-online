
-- Crear tabla para gestión de administradores
CREATE TABLE public.admin_actions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  admin_id UUID REFERENCES auth.users NOT NULL,
  target_user_id UUID REFERENCES auth.users NOT NULL,
  action_type TEXT NOT NULL,
  old_value JSONB,
  new_value JSONB,
  reason TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Habilitar RLS
ALTER TABLE public.admin_actions ENABLE ROW LEVEL SECURITY;

-- Política para que solo admins puedan ver acciones
CREATE POLICY "Only admins can view admin actions" 
  ON public.admin_actions 
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND user_role = 'admin'
    )
  );

-- Función para que admins puedan cambiar planes de usuarios
CREATE OR REPLACE FUNCTION public.admin_update_user_subscription(
  target_user_id UUID,
  new_subscription_type TEXT,
  new_expires_at TIMESTAMP WITH TIME ZONE,
  reason TEXT DEFAULT NULL
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  admin_user_id UUID;
  old_subscription JSONB;
  result JSONB;
BEGIN
  -- Verificar que el usuario actual es admin
  SELECT id INTO admin_user_id FROM public.profiles 
  WHERE id = auth.uid() AND user_role = 'admin';
  
  IF admin_user_id IS NULL THEN
    RETURN jsonb_build_object('error', 'No tienes permisos de administrador');
  END IF;

  -- Obtener datos actuales del usuario
  SELECT jsonb_build_object(
    'subscription_type', subscription_type,
    'subscription_expires_at', subscription_expires_at
  ) INTO old_subscription
  FROM public.profiles 
  WHERE id = target_user_id;

  -- Actualizar suscripción del usuario
  UPDATE public.profiles
  SET 
    subscription_type = new_subscription_type,
    subscription_expires_at = new_expires_at,
    updated_at = now()
  WHERE id = target_user_id;

  -- Registrar la acción del admin
  INSERT INTO public.admin_actions (
    admin_id, target_user_id, action_type, old_value, new_value, reason
  ) VALUES (
    admin_user_id, 
    target_user_id, 
    'subscription_update',
    old_subscription,
    jsonb_build_object(
      'subscription_type', new_subscription_type,
      'subscription_expires_at', new_expires_at
    ),
    reason
  );

  RETURN jsonb_build_object('success', true, 'message', 'Suscripción actualizada correctamente');
END;
$$;

-- Función para que admins puedan cambiar planes de promoción de companions
CREATE OR REPLACE FUNCTION public.admin_update_companion_plan(
  companion_profile_id UUID,
  new_promotion_plan TEXT,
  reason TEXT DEFAULT NULL
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  admin_user_id UUID;
  companion_user_id UUID;
  old_plan TEXT;
  result JSONB;
BEGIN
  -- Verificar que el usuario actual es admin
  SELECT id INTO admin_user_id FROM public.profiles 
  WHERE id = auth.uid() AND user_role = 'admin';
  
  IF admin_user_id IS NULL THEN
    RETURN jsonb_build_object('error', 'No tienes permisos de administrador');
  END IF;

  -- Obtener datos del companion
  SELECT user_id, promotion_plan INTO companion_user_id, old_plan
  FROM public.companion_profiles 
  WHERE id = companion_profile_id;

  -- Actualizar plan del companion
  UPDATE public.companion_profiles
  SET 
    promotion_plan = new_promotion_plan,
    updated_at = now()
  WHERE id = companion_profile_id;

  -- Registrar la acción del admin
  INSERT INTO public.admin_actions (
    admin_id, target_user_id, action_type, old_value, new_value, reason
  ) VALUES (
    admin_user_id, 
    companion_user_id, 
    'companion_plan_update',
    jsonb_build_object('promotion_plan', old_plan),
    jsonb_build_object('promotion_plan', new_promotion_plan),
    reason
  );

  RETURN jsonb_build_object('success', true, 'message', 'Plan de companion actualizado correctamente');
END;
$$;
