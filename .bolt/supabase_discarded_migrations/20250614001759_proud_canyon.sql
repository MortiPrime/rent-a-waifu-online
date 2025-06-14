/*
  # Actualizar funciones de administración

  1. Funciones de administración
    - admin_update_user_subscription: Actualizar suscripción de usuario
    - admin_update_subscription_expiry: Actualizar fecha de expiración
    - admin_update_companion_plan: Actualizar plan de companion

  2. Seguridad
    - Solo administradores pueden ejecutar estas funciones
    - Registro de todas las acciones en admin_actions
*/

-- Función para actualizar suscripción de usuario
CREATE OR REPLACE FUNCTION admin_update_user_subscription(
  target_user_id uuid,
  new_subscription_type text,
  new_expires_at timestamptz,
  reason text DEFAULT NULL
)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  admin_user_id uuid;
  old_subscription_type text;
  old_expires_at timestamptz;
  result json;
BEGIN
  -- Verificar que el usuario actual es admin
  admin_user_id := auth.uid();
  
  IF NOT EXISTS (
    SELECT 1 FROM profiles 
    WHERE id = admin_user_id AND user_role = 'admin'
  ) THEN
    RETURN json_build_object('error', 'No tienes permisos de administrador');
  END IF;

  -- Obtener valores actuales
  SELECT subscription_type, subscription_expires_at 
  INTO old_subscription_type, old_expires_at
  FROM profiles 
  WHERE id = target_user_id;

  IF NOT FOUND THEN
    RETURN json_build_object('error', 'Usuario no encontrado');
  END IF;

  -- Actualizar la suscripción
  UPDATE profiles 
  SET 
    subscription_type = new_subscription_type,
    subscription_expires_at = new_expires_at,
    updated_at = now()
  WHERE id = target_user_id;

  -- Registrar la acción del admin
  INSERT INTO admin_actions (
    admin_id,
    target_user_id,
    action_type,
    old_value,
    new_value,
    reason
  ) VALUES (
    admin_user_id,
    target_user_id,
    'update_subscription',
    json_build_object(
      'subscription_type', old_subscription_type,
      'expires_at', old_expires_at
    ),
    json_build_object(
      'subscription_type', new_subscription_type,
      'expires_at', new_expires_at
    ),
    reason
  );

  -- Crear registro en historial de suscripciones
  INSERT INTO subscription_history (
    user_id,
    subscription_type,
    amount,
    currency,
    payment_status,
    payment_method,
    starts_at,
    expires_at
  ) VALUES (
    target_user_id,
    new_subscription_type,
    CASE 
      WHEN new_subscription_type = 'basic' THEN 0
      WHEN new_subscription_type = 'premium' THEN 399
      WHEN new_subscription_type = 'vip' THEN 799
      ELSE 0
    END,
    'MXN',
    'completed',
    'admin_update',
    now(),
    new_expires_at
  );

  result := json_build_object(
    'success', true,
    'message', 'Suscripción actualizada correctamente'
  );

  RETURN result;
END;
$$;

-- Función para actualizar solo la fecha de expiración
CREATE OR REPLACE FUNCTION admin_update_subscription_expiry(
  target_user_id uuid,
  new_expires_at timestamptz,
  reason text DEFAULT NULL
)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  admin_user_id uuid;
  old_expires_at timestamptz;
  current_subscription_type text;
  result json;
BEGIN
  -- Verificar que el usuario actual es admin
  admin_user_id := auth.uid();
  
  IF NOT EXISTS (
    SELECT 1 FROM profiles 
    WHERE id = admin_user_id AND user_role = 'admin'
  ) THEN
    RETURN json_build_object('error', 'No tienes permisos de administrador');
  END IF;

  -- Obtener valores actuales
  SELECT subscription_expires_at, subscription_type
  INTO old_expires_at, current_subscription_type
  FROM profiles 
  WHERE id = target_user_id;

  IF NOT FOUND THEN
    RETURN json_build_object('error', 'Usuario no encontrado');
  END IF;

  -- Actualizar solo la fecha de expiración
  UPDATE profiles 
  SET 
    subscription_expires_at = new_expires_at,
    updated_at = now()
  WHERE id = target_user_id;

  -- Registrar la acción del admin
  INSERT INTO admin_actions (
    admin_id,
    target_user_id,
    action_type,
    old_value,
    new_value,
    reason
  ) VALUES (
    admin_user_id,
    target_user_id,
    'update_subscription_expiry',
    json_build_object('expires_at', old_expires_at),
    json_build_object('expires_at', new_expires_at),
    reason
  );

  result := json_build_object(
    'success', true,
    'message', 'Fecha de expiración actualizada correctamente'
  );

  RETURN result;
END;
$$;

-- Función para actualizar plan de companion
CREATE OR REPLACE FUNCTION admin_update_companion_plan(
  companion_profile_id uuid,
  new_promotion_plan text,
  reason text DEFAULT NULL
)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  admin_user_id uuid;
  old_promotion_plan text;
  companion_user_id uuid;
  result json;
BEGIN
  -- Verificar que el usuario actual es admin
  admin_user_id := auth.uid();
  
  IF NOT EXISTS (
    SELECT 1 FROM profiles 
    WHERE id = admin_user_id AND user_role = 'admin'
  ) THEN
    RETURN json_build_object('error', 'No tienes permisos de administrador');
  END IF;

  -- Obtener valores actuales
  SELECT promotion_plan, user_id
  INTO old_promotion_plan, companion_user_id
  FROM companion_profiles 
  WHERE id = companion_profile_id;

  IF NOT FOUND THEN
    RETURN json_build_object('error', 'Perfil de companion no encontrado');
  END IF;

  -- Actualizar el plan de promoción
  UPDATE companion_profiles 
  SET 
    promotion_plan = new_promotion_plan,
    updated_at = now()
  WHERE id = companion_profile_id;

  -- Actualizar también en companion_listings
  UPDATE companion_listings 
  SET 
    promotion_plan = new_promotion_plan,
    updated_at = now()
  WHERE companion_id = companion_profile_id;

  -- Registrar la acción del admin
  INSERT INTO admin_actions (
    admin_id,
    target_user_id,
    action_type,
    old_value,
    new_value,
    reason
  ) VALUES (
    admin_user_id,
    companion_user_id,
    'update_companion_plan',
    json_build_object('promotion_plan', old_promotion_plan),
    json_build_object('promotion_plan', new_promotion_plan),
    reason
  );

  result := json_build_object(
    'success', true,
    'message', 'Plan de companion actualizado correctamente'
  );

  RETURN result;
END;
$$;