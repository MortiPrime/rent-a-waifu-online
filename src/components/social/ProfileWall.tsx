import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { MessagesSquare, Reply, Trash2 } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';

interface WallPost {
  id: string;
  wall_owner_id: string;
  author_id: string;
  author_name: string | null;
  parent_id: string | null;
  content: string;
  created_at: string;
}

const ProfileWall = ({ ownerId, ownerName }: { ownerId: string; ownerName: string }) => {
  const { user, profile, isAdmin } = useAuth() as any;
  const [posts, setPosts] = useState<WallPost[]>([]);
  const [text, setText] = useState('');
  const [replyTo, setReplyTo] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');

  const load = async () => {
    const { data } = await supabase
      .from('wall_posts')
      .select('*')
      .eq('wall_owner_id', ownerId)
      .order('created_at', { ascending: false })
      .limit(100);
    setPosts((data as WallPost[]) || []);
  };

  useEffect(() => {
    load();
    const ch = supabase
      .channel(`wall-${ownerId}`)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'wall_posts', filter: `wall_owner_id=eq.${ownerId}` }, load)
      .subscribe();
    return () => { supabase.removeChannel(ch); };
  }, [ownerId]);

  const isOwner = user?.id === ownerId;
  const myName = isOwner ? ownerName : profile?.full_name || profile?.username || 'Usuario';

  const publish = async (content: string, parent_id: string | null) => {
    if (!user || !content.trim()) return;
    await supabase.from('wall_posts').insert({
      wall_owner_id: ownerId, author_id: user.id, author_name: myName, content: content.trim().slice(0, 1000), parent_id,
    });
    load();
  };

  const remove = async (id: string) => { await supabase.from('wall_posts').delete().eq('id', id); load(); };

  const roots = posts.filter((p) => !p.parent_id);
  const replies = (id: string) => posts.filter((p) => p.parent_id === id).reverse();

  const PostItem = ({ p, small }: { p: WallPost; small?: boolean }) => (
    <div className={small ? 'ml-6 mt-2 border-l-2 border-brand/30 pl-3' : ''}>
      <div className="flex items-center justify-between text-xs text-surface-foreground/55">
        <span className={p.author_id === ownerId ? 'font-semibold text-brand' : 'font-semibold text-surface-foreground/85'}>
          {p.author_name || 'Usuario'}{p.author_id === ownerId && ' ✦'}
        </span>
        <span>{formatDistanceToNow(new Date(p.created_at), { addSuffix: true, locale: es })}</span>
      </div>
      <p className="mt-1 whitespace-pre-wrap text-sm">{p.content}</p>
      <div className="mt-1 flex gap-1">
        {!small && user && (
          <Button size="sm" variant="ghost" className="h-6 px-2 text-xs" onClick={() => setReplyTo(replyTo === p.id ? null : p.id)}>
            <Reply className="mr-1 h-3 w-3" />Responder
          </Button>
        )}
        {user && (user.id === p.author_id || isOwner || isAdmin) && (
          <Button size="sm" variant="ghost" className="h-6 px-2 text-xs" onClick={() => remove(p.id)}>
            <Trash2 className="h-3 w-3" />
          </Button>
        )}
      </div>
    </div>
  );

  return (
    <section className="space-y-3">
      <h4 className="flex items-center gap-2 font-semibold"><MessagesSquare className="h-4 w-4" />Muro</h4>
      {user ? (
        <div className="space-y-2">
          <Textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            maxLength={1000}
            placeholder={isOwner ? 'Comparte algo con tus seguidores…' : `Deja un saludo o pregunta pública a ${ownerName}…`}
            className="field-dark min-h-[70px]"
          />
          <Button size="sm" className="brand-button" disabled={!text.trim()} onClick={() => { publish(text, null); setText(''); }}>
            Publicar
          </Button>
        </div>
      ) : (
        <p className="text-sm text-surface-foreground/60">Inicia sesión para participar en el muro.</p>
      )}
      {roots.length === 0 && <p className="text-sm text-surface-foreground/50">Aún no hay publicaciones.</p>}
      <div className="space-y-3">
        {roots.map((p) => (
          <div key={p.id} className="rounded-lg bg-surface/5 p-3">
            <PostItem p={p} />
            {replies(p.id).map((r) => <PostItem key={r.id} p={r} small />)}
            {replyTo === p.id && (
              <div className="ml-6 mt-2 flex gap-2">
                <Textarea value={replyText} onChange={(e) => setReplyText(e.target.value)} className="field-dark min-h-[50px]" maxLength={1000} />
                <Button size="sm" className="brand-button self-end" disabled={!replyText.trim()}
                  onClick={() => { publish(replyText, p.id); setReplyText(''); setReplyTo(null); }}>
                  Enviar
                </Button>
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
};

export default ProfileWall;
