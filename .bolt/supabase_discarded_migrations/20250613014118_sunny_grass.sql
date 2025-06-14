/*
  # Notification System

  1. New Tables
    - `notifications` - User notifications
    - `notification_templates` - Reusable notification templates
    
  2. Security
    - RLS policies for user privacy
    - Admin notification management
    
  3. Features
    - Real-time notifications
    - Email notifications
    - Push notifications
    - Template system
*/

-- Notification templates
CREATE TABLE IF NOT EXISTS public.notification_templates (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  title_template TEXT NOT NULL,
  body_template TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('info', 'success', 'warning', 'error')),
  category TEXT NOT NULL, -- 'system', 'payment', 'companion', 'chat', etc.
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- User notifications
CREATE TABLE IF NOT EXISTS public.notifications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  body TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('info', 'success', 'warning', 'error')),
  category TEXT NOT NULL,
  is_read BOOLEAN DEFAULT false,
  action_url TEXT, -- Optional URL for action button
  action_text TEXT, -- Optional text for action button
  metadata JSONB, -- Additional data
  expires_at TIMESTAMP WITH TIME ZONE, -- Optional expiry
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.notification_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- RLS Policies for notification_templates
CREATE POLICY "Only admins can manage notification templates" 
  ON public.notification_templates 
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND user_role = 'admin'
    )
  );

-- RLS Policies for notifications
CREATE POLICY "Users can view their own notifications" 
  ON public.notifications 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own notifications" 
  ON public.notifications 
  FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "System can insert notifications" 
  ON public.notifications 
  FOR INSERT 
  WITH CHECK (true);

CREATE POLICY "Admins can view all notifications" 
  ON public.notifications 
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND user_role = 'admin'
    )
  );

-- Trigger for updated_at
CREATE TRIGGER update_notification_templates_updated_at
  BEFORE UPDATE ON public.notification_templates
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Function to create notification from template
CREATE OR REPLACE FUNCTION public.create_notification_from_template(
  template_name TEXT,
  target_user_id UUID,
  template_variables JSONB DEFAULT '{}'::jsonb,
  action_url TEXT DEFAULT NULL,
  action_text TEXT DEFAULT NULL,
  expires_at TIMESTAMP WITH TIME ZONE DEFAULT NULL
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  template_record RECORD;
  notification_id UUID;
  final_title TEXT;
  final_body TEXT;
  var_key TEXT;
  var_value TEXT;
BEGIN
  -- Get template
  SELECT * INTO template_record
  FROM public.notification_templates
  WHERE name = template_name AND is_active = true;

  IF template_record IS NULL THEN
    RAISE EXCEPTION 'Template not found: %', template_name;
  END IF;

  -- Replace variables in title and body
  final_title := template_record.title_template;
  final_body := template_record.body_template;

  -- Replace template variables
  FOR var_key, var_value IN SELECT * FROM jsonb_each_text(template_variables)
  LOOP
    final_title := REPLACE(final_title, '{{' || var_key || '}}', var_value);
    final_body := REPLACE(final_body, '{{' || var_key || '}}', var_value);
  END LOOP;

  -- Create notification
  INSERT INTO public.notifications (
    user_id,
    title,
    body,
    type,
    category,
    action_url,
    action_text,
    metadata,
    expires_at
  ) VALUES (
    target_user_id,
    final_title,
    final_body,
    template_record.type,
    template_record.category,
    action_url,
    action_text,
    template_variables,
    expires_at
  ) RETURNING id INTO notification_id;

  RETURN notification_id;
END;
$$;

-- Insert default notification templates
INSERT INTO public.notification_templates (name, title_template, body_template, type, category) VALUES
('welcome_user', 'Bienvenido a AnimeDating', 'Hola {{username}}, bienvenido a nuestra plataforma. ¡Esperamos que disfrutes conectando con companions increíbles!', 'info', 'system'),
('subscription_activated', 'Suscripción Activada', 'Tu suscripción {{plan}} ha sido activada exitosamente. ¡Disfruta de todas las funciones premium!', 'success', 'payment'),
('subscription_expiring', 'Suscripción por Expirar', 'Tu suscripción {{plan}} expira el {{expiry_date}}. Renueva ahora para continuar disfrutando de los beneficios.', 'warning', 'payment'),
('companion_approved', 'Perfil Aprobado', 'Felicidades {{stage_name}}, tu perfil de companion ha sido aprobado. ¡Ya puedes comenzar a recibir clientes!', 'success', 'companion'),
('payment_proof_received', 'Comprobante Recibido', 'Hemos recibido tu comprobante de pago para la suscripción {{plan}}. Lo revisaremos en las próximas 24 horas.', 'info', 'payment'),
('payment_proof_approved', 'Comprobante Aprobado', 'Tu comprobante de pago ha sido aprobado. Tu suscripción {{plan}} está ahora activa.', 'success', 'payment'),
('payment_proof_rejected', 'Comprobante Rechazado', 'Tu comprobante de pago ha sido rechazado. Motivo: {{reason}}. Por favor, envía un nuevo comprobante.', 'error', 'payment')
ON CONFLICT (name) DO NOTHING;