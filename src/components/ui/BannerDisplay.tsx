import React, { useEffect, useState, useCallback, useRef } from 'react';
import { supabase } from '../../lib/supabase';
import { useAuthStore } from '../../store/authStore';
import { X, ChevronDown, ChevronUp, ExternalLink, AlertCircle } from 'lucide-react';

interface Banner {
  id: string;
  title: string;
  description: string | null;
  image_url: string | null;
  link_url: string | null;
  is_active: boolean;
  content: string | null;
  created_at: string | null;
  updated_at: string | null;
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
  const [animatingBanners, setAnimatingBanners] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuthStore();
  const isMountedRef = useRef(true);

  const fetchBanners = useCallback(async () => {
    if (!user || !isMountedRef.current) {
      console.log('No user found or component unmounted, skipping banner fetch');
      if (isMountedRef.current) {
        setLoading(false);
      }
      return;
    }

    console.log('Fetching banners for user:', user.id);
    if (isMountedRef.current) {
      setLoading(true);
      setError(null);
    }

    try {
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
        if (isMountedRef.current) {
          setError(error.message);
          setLoading(false);
        }
        return;
      }

      console.log('Raw banner data:', data);

      // Filter banners that are either for all users or specifically for this user
      const userBanners = data?.filter(banner => {
        const isForAllUsers = !banner.users || banner.users.length === 0;
        const isForThisUser = banner.users?.some((rel: { user: { id: string } }) => rel.user.id === user.id);
        return isForAllUsers || isForThisUser;
      }) || [];

      console.log('Filtered banners for user:', userBanners);
      
      if (isMountedRef.current) {
        setBanners(userBanners);
        // Initialize all banners as expanded (not minimized)
        setMinimizedBanners([]);
      }
    } catch (err) {
      console.error('Unexpected error fetching banners:', err);
      if (isMountedRef.current) {
        setError('Failed to load banners');
      }
    } finally {
      if (isMountedRef.current) {
        setLoading(false);
      }
    }
  }, [user?.id]); // Only depend on user.id

  useEffect(() => {
    fetchBanners();
  }, [fetchBanners]);

  // Cleanup effect to prevent state updates after unmount
  useEffect(() => {
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  const dismissBanner = (bannerId: string) => {
    // Add to animating state first for exit animation
    setAnimatingBanners(prev => [...prev, bannerId]);
    
    // After animation completes, add to dismissed
    setTimeout(() => {
      setDismissedBanners(prev => [...prev, bannerId]);
      setAnimatingBanners(prev => prev.filter(id => id !== bannerId));
    }, 300);
  };

  const toggleMinimize = (bannerId: string) => {
    setMinimizedBanners(prev => {
      const isCurrentlyMinimized = prev.includes(bannerId);
      
      if (isCurrentlyMinimized) {
        // Expand the banner
        return prev.filter(id => id !== bannerId);
      } else {
        // Minimize the banner
        return [...prev, bannerId];
      }
    });
  };

  const visibleBanners = banners.filter(banner => !dismissedBanners.includes(banner.id));

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="bg-gray-100 rounded-xl p-6 animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
          <div className="h-3 bg-gray-200 rounded w-1/2"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-4">
        <div className="bg-red-50 border border-red-200 rounded-xl p-4">
          <p className="text-red-600 text-sm">Error loading banners: {error}</p>
        </div>
      </div>
    );
  }

  if (visibleBanners.length === 0) return null;

  return (
    <div className="space-y-4">
      {visibleBanners.map((banner, index) => (
        <div
          key={banner.id}
          className={`relative bg-gradient-to-r from-red-50 via-rose-50 to-pink-50 border border-red-200/50 rounded-xl shadow-lg hover:shadow-xl transition-all duration-500 cursor-pointer group overflow-hidden transform ${
            animatingBanners.includes(banner.id) 
              ? 'animate-slide-out-right opacity-0 scale-95' 
              : 'animate-slide-in-up opacity-100 scale-100'
          }`}
          style={{
            animationDelay: `${index * 100}ms`,
            animationFillMode: 'both'
          }}
          onClick={() => toggleMinimize(banner.id)}
        >
          {/* Decorative gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-red-500/5 via-rose-500/5 to-pink-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          
          {/* Control buttons */}
          <div className="absolute top-3 right-3 flex items-center gap-2 z-10">
            <button
              onClick={(e) => {
                e.stopPropagation();
                toggleMinimize(banner.id);
              }}
              className="p-1.5 rounded-full bg-white/80 hover:bg-white text-slate-600 hover:text-slate-800 shadow-sm hover:shadow-md transition-all duration-300 backdrop-blur-sm hover:scale-110 active:scale-95"
              title={minimizedBanners.includes(banner.id) ? "Expand banner" : "Minimize banner"}
            >
              <div className={`transition-transform duration-300 ${minimizedBanners.includes(banner.id) ? 'rotate-0' : 'rotate-180'}`}>
                {minimizedBanners.includes(banner.id) ? (
                  <ChevronDown className="w-4 h-4" />
                ) : (
                  <ChevronUp className="w-4 h-4" />
                )}
              </div>
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                dismissBanner(banner.id);
              }}
              className="p-1.5 rounded-full bg-white/80 hover:bg-red-50 text-slate-600 hover:text-red-600 shadow-sm hover:shadow-md transition-all duration-300 backdrop-blur-sm hover:scale-110 active:scale-95 hover:rotate-90"
              title="Dismiss banner"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          
          {minimizedBanners.includes(banner.id) ? (
            <div className="py-4 px-6 flex items-center gap-3 animate-slide-down">
              <div className="p-2 rounded-full bg-red-100 text-red-600 animate-pulse">
                <AlertCircle className="w-5 h-5" />
              </div>
              <h3 className="text-base font-semibold text-red-900">{banner.title}</h3>
            </div>
          ) : (
            <div className="relative animate-slide-up">
              {banner.image_url && (
                <div className="w-full h-48 overflow-hidden">
                  <img
                    src={banner.image_url}
                    alt={banner.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                </div>
              )}
              
              <div className={`p-6 ${!banner.image_url ? 'pt-8' : ''}`}>
                <div className="flex items-start gap-3 mb-3">
                  <div className="p-2 rounded-full bg-red-100 text-red-600 flex-shrink-0 animate-bounce">
                    <AlertCircle className="w-5 h-5" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-red-900 mb-2 animate-fade-in">{banner.title}</h3>
                    {banner.description && (
                      <p className="text-sm text-red-700 leading-relaxed mb-3 animate-fade-in" style={{ animationDelay: '100ms' }}>{banner.description}</p>
                    )}
                    {banner.content && (
                      <div className="text-sm text-red-700 leading-relaxed mb-3 animate-fade-in" style={{ animationDelay: '200ms' }}>{banner.content}</div>
                    )}
                    {banner.link_url && (
                      <a
                        href={banner.link_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded-lg transition-all duration-300 shadow-sm hover:shadow-md hover:scale-105 active:scale-95 animate-fade-in"
                        style={{ animationDelay: '300ms' }}
                        onClick={(e) => e.stopPropagation()}
                      >
                        Learn more
                        <ExternalLink className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default BannerDisplay; 