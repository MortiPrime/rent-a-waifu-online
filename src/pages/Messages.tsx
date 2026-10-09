import { useEffect, useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import Navbar from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { MessageCircle, Send, ArrowLeft } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

interface Thread {
  id: string;
  client_id: string;
  companion_id: string;
  client_name: string | null;
  companion_name: string | null;
  last_message: string | null;
  last_message_at: string;
}
interface Msg { id: string; thread_id: string; sender_id: string; content: string; read_at: string | null; created_at: string; }

const Messages = () => {
  const { user, profile } = useAuth();
  const [params, setParams] = useSearchParams();
  const [threads, setThreads] = useState<Thread[]>([]);
  const [active, setActive] = useState<Thread | null>(null);
  const [messages, setMessages] = useState<Msg[]>([]);
  const [unread, setUnread] = useState<Record<string, number>>({});
  const [text, setText] = useState('');
  const endRef = useRef<HTMLDivElement>(null);

  const loadThreads = async () => {
    if (!user) return [];
    const { data } = await supabase.from('dm_threads').select('*').order('last_message_at', { ascending: false });
    const list = (data as Thread[]) || [];
    setThreads(list);
    const { data: un } = await supabase.from('dm_messages').select('thread_id').is('read_at', null).neq('sender_id', user.id);
    const counts: Record<string, number> = {};
    (un || []).forEach((m: any) => { counts[m.thread_id] = (counts[m.thread_id] || 0) + 1; });
    setUnread(counts);
    return list;
  };

  // Abrir o crear conversación desde ?to=
  useEffect(() => {
    if (!user) return;
    (async () => {
      const list = await loadThreads();
      const to = params.get('to');
      if (!to || to === user.id) return;
      let t = list.find((x) => (x.companion_id === to && x.client_id === user.id) || (x.client_id === to && x.companion_id === user.id));
      if (!t) {
        const { data } = await supabase.from('dm_threads').insert({
          client_id: user.id, companion_id: to,
          client_name: profile?.full_name || profile?.username || 'Usuario',
          companion_name: params.get('name') || 'Companion',
        }).select().single();
        t = data as Thread;
        await loadThreads();
      }
      if (t) setActive(t);
      const service = params.get('service');
      if (service) setText(`Hola, me interesa tu servicio "${service}". ¿Tienes disponibilidad?`);
      setParams({}, { replace: true });
    })();
  }, [user?.id]);

  useEffect(() => {
    if (!active || !user) return;
    const loadMsgs = async () => {
      const { data } = await supabase.from('dm_messages').select('*').eq('thread_id', active.id).order('created_at');
      setMessages((data as Msg[]) || []);
      await supabase.from('dm_messages').update({ read_at: new Date().toISOString() })
        .eq('thread_id', active.id).neq('sender_id', user.id).is('read_at', null);
      setUnread((u) => ({ ...u, [active.id]: 0 }));
    };
    loadMsgs();
    const ch = supabase.channel(`dm-${active.id}`)
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'dm_messages', filter: `thread_id=eq.${active.id}` }, loadMsgs)
      .subscribe();
    return () => { supabase.removeChannel(ch); };
  }, [active?.id, user?.id]);

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

  const send = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !active || !text.trim()) return;
    const content = text.trim().slice(0, 2000);
    setText('');
    await supabase.from('dm_messages').insert({ thread_id: active.id, sender_id: user.id, content });
    await supabase.from('dm_threads').update({ last_message: content.slice(0, 120), last_message_at: new Date().toISOString() }).eq('id', active.id);
    loadThreads();
  };

  const otherName = (t: Thread) => (t.client_id === user?.id ? t.companion_name : t.client_name) || 'Usuario';

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="container mx-auto max-w-5xl px-4 py-8">
        <h1 className="mb-6 font-playfair text-3xl font-bold">Mensajes</h1>
        <div className="grid h-[70vh] overflow-hidden rounded-xl border border-surface-border/20 surface-card md:grid-cols-[280px_1fr]">
          <aside className={cn('overflow-y-auto border-r border-surface-border/20', active && 'hidden md:block')}>
            {threads.length === 0 && (
              <p className="p-6 text-center text-sm text-surface-foreground/60">Aún no tienes conversaciones. Escribe a una companion desde su perfil.</p>
            )}
            {threads.map((t) => (
              <button key={t.id} onClick={() => setActive(t)}
                className={cn('flex w-full items-start gap-3 border-b border-surface-border/10 p-4 text-left hover:bg-surface/10', active?.id === t.id && 'bg-brand/10')}>
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand/25 font-semibold">{otherName(t)[0]}</div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between">
                    <p className="truncate font-medium">{otherName(t)}</p>
                    {unread[t.id] > 0 && <span className="rounded-full bg-brand px-2 text-xs text-primary-foreground">{unread[t.id]}</span>}
                  </div>
                  <p className="truncate text-xs text-surface-foreground/55">{t.last_message || 'Nueva conversación'}</p>
                </div>
              </button>
            ))}
          </aside>
          <section className={cn('flex min-h-0 flex-col', !active && 'hidden md:flex')}>
            {active ? (
              <>
                <header className="flex items-center gap-2 border-b border-surface-border/20 p-4">
                  <Button size="icon" variant="ghost" className="md:hidden" onClick={() => setActive(null)}><ArrowLeft className="h-4 w-4" /></Button>
                  <p className="font-semibold">{otherName(active)}</p>
                </header>
                <div className="flex-1 space-y-2 overflow-y-auto p-4">
                  {messages.map((m) => (
                    <div key={m.id} className={cn('flex', m.sender_id === user?.id ? 'justify-end' : 'justify-start')}>
                      <div className={cn('max-w-[75%] rounded-2xl px-3 py-2 text-sm',
                        m.sender_id === user?.id ? 'bg-brand text-primary-foreground' : 'bg-surface/15')}>
                        <p className="whitespace-pre-wrap">{m.content}</p>
                        <p className="mt-0.5 text-right text-[10px] opacity-60">{format(new Date(m.created_at), 'HH:mm')}</p>
                      </div>
                    </div>
                  ))}
                  <div ref={endRef} />
                </div>
                <form onSubmit={send} className="flex gap-2 border-t border-surface-border/20 p-3">
                  <Input value={text} onChange={(e) => setText(e.target.value)} placeholder="Escribe un mensaje…" maxLength={2000} className="field-dark" />
                  <Button type="submit" className="brand-button" disabled={!text.trim()}><Send className="h-4 w-4" /></Button>
                </form>
              </>
            ) : (
              <div className="flex flex-1 flex-col items-center justify-center text-surface-foreground/50">
                <MessageCircle className="mb-2 h-10 w-10" />Selecciona una conversación
              </div>
            )}
          </section>
        </div>
      </main>
    </div>
  );
};

export default Messages;
