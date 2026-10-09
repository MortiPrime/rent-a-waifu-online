CREATE TABLE public.companion_services (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  title text NOT NULL,
  description text,
  price numeric NOT NULL DEFAULT 0,
  price_unit text NOT NULL DEFAULT 'por sesión',
  is_active boolean NOT NULL DEFAULT true,
  display_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.companion_services TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.companion_services TO authenticated;
GRANT ALL ON public.companion_services TO service_role;
ALTER TABLE public.companion_services ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone sees active services" ON public.companion_services FOR SELECT USING (is_active OR auth.uid() = user_id OR public.has_role(auth.uid(),'admin'));
CREATE POLICY "Owner inserts services" ON public.companion_services FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Owner updates services" ON public.companion_services FOR UPDATE TO authenticated USING (auth.uid() = user_id OR public.has_role(auth.uid(),'admin'));
CREATE POLICY "Owner deletes services" ON public.companion_services FOR DELETE TO authenticated USING (auth.uid() = user_id OR public.has_role(auth.uid(),'admin'));
CREATE TRIGGER update_companion_services_updated_at BEFORE UPDATE ON public.companion_services FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TABLE public.wall_posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  wall_owner_id uuid NOT NULL,
  author_id uuid NOT NULL,
  author_name text,
  parent_id uuid REFERENCES public.wall_posts(id) ON DELETE CASCADE,
  content text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX wall_posts_owner_idx ON public.wall_posts(wall_owner_id, created_at DESC);
GRANT SELECT ON public.wall_posts TO anon;
GRANT SELECT, INSERT, DELETE ON public.wall_posts TO authenticated;
GRANT ALL ON public.wall_posts TO service_role;
ALTER TABLE public.wall_posts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Wall is public" ON public.wall_posts FOR SELECT USING (true);
CREATE POLICY "Logged users post" ON public.wall_posts FOR INSERT TO authenticated WITH CHECK (auth.uid() = author_id AND length(content) BETWEEN 1 AND 1000);
CREATE POLICY "Author owner admin delete" ON public.wall_posts FOR DELETE TO authenticated USING (auth.uid() = author_id OR auth.uid() = wall_owner_id OR public.has_role(auth.uid(),'admin'));

CREATE TABLE public.dm_threads (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id uuid NOT NULL,
  companion_id uuid NOT NULL,
  client_name text,
  companion_name text,
  last_message text,
  last_message_at timestamptz NOT NULL DEFAULT now(),
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (client_id, companion_id)
);
GRANT SELECT, INSERT, UPDATE ON public.dm_threads TO authenticated;
GRANT ALL ON public.dm_threads TO service_role;
ALTER TABLE public.dm_threads ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Participants view threads" ON public.dm_threads FOR SELECT TO authenticated USING (auth.uid() IN (client_id, companion_id));
CREATE POLICY "Client starts thread" ON public.dm_threads FOR INSERT TO authenticated WITH CHECK (auth.uid() = client_id AND client_id <> companion_id);
CREATE POLICY "Participants update thread" ON public.dm_threads FOR UPDATE TO authenticated USING (auth.uid() IN (client_id, companion_id));

CREATE TABLE public.dm_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  thread_id uuid NOT NULL REFERENCES public.dm_threads(id) ON DELETE CASCADE,
  sender_id uuid NOT NULL,
  content text NOT NULL,
  read_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX dm_messages_thread_idx ON public.dm_messages(thread_id, created_at);
GRANT SELECT, INSERT, UPDATE ON public.dm_messages TO authenticated;
GRANT ALL ON public.dm_messages TO service_role;
ALTER TABLE public.dm_messages ENABLE ROW LEVEL SECURITY;
CREATE OR REPLACE FUNCTION public.is_thread_participant(_thread uuid, _user uuid)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.dm_threads WHERE id = _thread AND _user IN (client_id, companion_id))
$$;
CREATE POLICY "Participants read messages" ON public.dm_messages FOR SELECT TO authenticated USING (public.is_thread_participant(thread_id, auth.uid()));
CREATE POLICY "Participants send messages" ON public.dm_messages FOR INSERT TO authenticated WITH CHECK (auth.uid() = sender_id AND public.is_thread_participant(thread_id, auth.uid()) AND length(content) BETWEEN 1 AND 2000);
CREATE POLICY "Participants mark read" ON public.dm_messages FOR UPDATE TO authenticated USING (public.is_thread_participant(thread_id, auth.uid()));

ALTER PUBLICATION supabase_realtime ADD TABLE public.dm_messages;
ALTER PUBLICATION supabase_realtime ADD TABLE public.wall_posts;