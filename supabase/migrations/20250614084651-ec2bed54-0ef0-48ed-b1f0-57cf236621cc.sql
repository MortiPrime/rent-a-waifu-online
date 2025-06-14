
-- Crear función para que los admins puedan acceder a datos de auth.users
CREATE OR REPLACE FUNCTION public.admin_get_auth_users()
RETURNS TABLE (
  id uuid,
  email text,
  email_confirmed_at timestamptz,
  created_at timestamptz,
  updated_at timestamptz,
  last_sign_in_at timestamptz,
  raw_user_meta_data jsonb,
  is_super_admin boolean,
  phone text,
  phone_confirmed_at timestamptz,
  banned_until timestamptz,
  deleted_at timestamptz
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  admin_user_id UUID;
BEGIN
  -- Verificar que el usuario actual es admin
  SELECT profiles.id INTO admin_user_id 
  FROM public.profiles 
  WHERE profiles.id = auth.uid() AND user_role = 'admin';
  
  IF admin_user_id IS NULL THEN
    RAISE EXCEPTION 'No tienes permisos de administrador';
  END IF;

  -- Retornar datos de auth.users
  RETURN QUERY
  SELECT 
    au.id,
    au.email,
    au.email_confirmed_at,
    au.created_at,
    au.updated_at,
    au.last_sign_in_at,
    au.raw_user_meta_data,
    au.is_super_admin,
    au.phone,
    au.phone_confirmed_at,
    au.banned_until,
    au.deleted_at
  FROM auth.users au
  ORDER BY au.created_at DESC;
END;
$$;

-- Crear función para actualizar usuario desde admin
CREATE OR REPLACE FUNCTION public.admin_update_auth_user(
  target_user_id uuid,
  new_email text DEFAULT NULL,
  new_email_confirmed boolean DEFAULT NULL,
  new_banned_until timestamptz DEFAULT NULL,
  reason text DEFAULT NULL
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  admin_user_id UUID;
  old_data JSONB;
BEGIN
  -- Verificar que el usuario actual es admin
  SELECT id INTO admin_user_id FROM public.profiles 
  WHERE id = auth.uid() AND user_role = 'admin';
  
  IF admin_user_id IS NULL THEN
    RETURN jsonb_build_object('error', 'No tienes permisos de administrador');
  END IF;

  -- Obtener datos actuales del usuario
  SELECT jsonb_build_object(
    'email', email,
    'email_confirmed_at', email_confirmed_at,
    'banned_until', banned_until
  ) INTO old_data
  FROM auth.users 
  WHERE id = target_user_id;

  -- Actualizar email si se proporciona
  IF new_email IS NOT NULL THEN
    UPDATE auth.users
    SET email = new_email, updated_at = now()
    WHERE id = target_user_id;
  END IF;

  -- Confirmar email si se solicita
  IF new_email_confirmed IS TRUE THEN
    UPDATE auth.users
    SET email_confirmed_at = now(), updated_at = now()
    WHERE id = target_user_id;
  ELSIF new_email_confirmed IS FALSE THEN
    UPDATE auth.users
    SET email_confirmed_at = NULL, updated_at = now()
    WHERE id = target_user_id;
  END IF;

  -- Actualizar banned_until si se proporciona
  IF new_banned_until IS NOT NULL THEN
    UPDATE auth.users
    SET banned_until = new_banned_until, updated_at = now()
    WHERE id = target_user_id;
  END IF;

  -- Registrar la acción del admin
  INSERT INTO public.admin_actions (
    admin_id, target_user_id, action_type, old_value, new_value, reason
  ) VALUES (
    admin_user_id, 
    target_user_id, 
    'auth_user_update',
    old_data,
    jsonb_build_object(
      'email', new_email,
      'email_confirmed', new_email_confirmed,
      'banned_until', new_banned_until
    ),
    reason
  );

  RETURN jsonb_build_object('success', true, 'message', 'Usuario actualizado correctamente');
END;
$$;
