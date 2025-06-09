import React, { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { useAuthStore } from '../../store/authStore';
import { X, ChevronDown, ChevronUp } from 'lucide-react';

interface Banner {
  id: string;
  title: string;
  description: string | null;
  image_url: string | null;
  link_url: string | null;
  is_active: boolean;
  content: string | null;
  users?: {
    user: {
      id: string;
    };
  }[];
}

const BannerDisplay: React.FC = () => {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [dismissedBanners, setDismissedBanners] = useState<string[]>([]);
  const [minimizedBanners, setMinimizedBanners] = useState<string[]>([]);
  const { user } = useAuthStore();

  useEffect(() => {
    fetchBanners();
  }, []);

  async function fetchBanners() {
    if (!user) return;

    const { data, error } = await supabase
      .from('banners')
      .select(`
        *,
        users:banner_user_relationship(
          user:profiles!banner_user_relationship_user_id_fkey(
            id
          )
        )
      `)
      .eq('is_active', true)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching banners:', error);
      return;
    }

    // Filter banners that are either for all users or specifically for this user
    const userBanners = data?.filter(banner => {
      const isForAllUsers = !banner.users || banner.users.length === 0;
      const isForThisUser = banner.users?.some((rel: { user: { id: string } }) => rel.user.id === user.id);
      return isForAllUsers || isForThisUser;
    }) || [];

    setBanners(userBanners);
    // Initialize all banners as minimized
    setMinimizedBanners(userBanners.map(banner => banner.id));
  }

  const dismissBanner = (bannerId: string) => {
    setDismissedBanners(prev => [...prev, bannerId]);
  };

  const toggleMinimize = (bannerId: string) => {
    setMinimizedBanners(prev => {
      if (prev.includes(bannerId)) {
        return prev.filter(id => id !== bannerId);
      }
      return [...prev, bannerId];
    });
  };

  const visibleBanners = banners.filter(banner => !dismissedBanners.includes(banner.id));

  if (visibleBanners.length === 0) return null;

  return (
    <div className="space-y-2">
      {visibleBanners.map(banner => (
        <div
          key={banner.id}
          className="relative bg-red-50 border border-red-100 rounded-lg shadow-sm overflow-hidden"
        >
          <div className="absolute top-1.5 right-1.5 flex items-center gap-1.5">
            <button
              onClick={() => toggleMinimize(banner.id)}
              className="text-red-400 hover:text-red-600"
            >
              {minimizedBanners.includes(banner.id) ? (
                <ChevronDown className="w-4 h-4" />
              ) : (
                <ChevronUp className="w-4 h-4" />
              )}
            </button>
            <button
              onClick={() => dismissBanner(banner.id)}
              className="text-red-400 hover:text-red-600"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          
          {minimizedBanners.includes(banner.id) ? (
            <div className="py-2 px-3">
              <h3 className="text-sm font-medium text-red-900">{banner.title}</h3>
            </div>
          ) : (
            <>
              {banner.image_url && (
                <div className="w-full h-32 overflow-hidden">
                  <img
                    src={banner.image_url}
                    alt={banner.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              
              <div className={`py-2 px-3 ${!banner.image_url ? 'pt-6' : ''}`}>
                <h3 className="text-sm font-medium text-red-900">{banner.title}</h3>
                {banner.description && (
                  <p className="mt-0.5 text-xs text-red-700">{banner.description}</p>
                )}
                {banner.content && (
                  <div className="mt-1 text-xs text-red-700">{banner.content}</div>
                )}
                {banner.link_url && (
                  <a
                    href={banner.link_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-1.5 inline-block text-xs font-medium text-red-600 hover:text-red-700"
                  >
                    Learn more →
                  </a>
                )}
              </div>
            </>
          )}
        </div>
      ))}
    </div>
  );
};

export default BannerDisplay; 