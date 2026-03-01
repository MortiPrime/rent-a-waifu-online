
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Megaphone, X } from 'lucide-react';

interface Announcement {
  id: string;
  title: string;
  content: string;
  display_location: string;
}

interface AnnouncementBannerProps {
  location?: string; // 'catalog', 'donations', 'profiles', 'all'
}

const AnnouncementBanner = ({ location = 'all' }: AnnouncementBannerProps) => {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [dismissed, setDismissed] = useState<Set<string>>(new Set());

  useEffect(() => {
    const load = async () => {
      const { data } = await supabase
        .from('announcements')
        .select('id, title, content, display_location')
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (data) {
        const filtered = data.filter(
          (a: any) => a.display_location === 'all' || a.display_location === location
        );
        setAnnouncements(filtered);
      }
    };
    load();
  }, [location]);

  const visible = announcements.filter(a => !dismissed.has(a.id));
  if (visible.length === 0) return null;

  return (
    <div className="space-y-3 mb-6">
      {visible.map(a => (
        <div
          key={a.id}
          className="relative bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border border-yellow-500/30 rounded-xl p-4 backdrop-blur-md"
        >
          <button
            onClick={() => setDismissed(prev => new Set(prev).add(a.id))}
            className="absolute top-2 right-2 text-white/60 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
          <div className="flex items-start gap-3">
            <Megaphone className="w-5 h-5 text-yellow-400 mt-0.5 flex-shrink-0" />
            <div>
              <h4 className="text-white font-semibold text-sm">{a.title}</h4>
              <p className="text-white/80 text-sm mt-1">{a.content}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default AnnouncementBanner;
