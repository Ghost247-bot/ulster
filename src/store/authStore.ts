import { create } from 'zustand';
import { supabase } from '../lib/supabase';
import { Database } from '../types/supabase';

type Profile = Database['public']['Tables']['profiles']['Row'];

interface AuthState {
  user: any | null;
  profile: Profile | null;
  setUser: (user: any) => void;
  setProfile: (profile: Profile) => void;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signUp: (email: string, password: string, userData: any, isAdmin?: boolean) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  profile: null,
  
  setUser: (user) => set({ user }),
  setProfile: (profile) => set({ profile }),
  
  signIn: async (email, password) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) {
        return { error };
      }
      
      if (data.user) {
        set({ user: data.user });
        
        // Fetch user profile
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', data.user.id)
          .single();
        
        if (profileError) {
          console.error('Error fetching profile:', profileError);
          return { error: profileError };
        }
        
        if (profileData) {
          set({ profile: profileData });
        }
      }
      
      return { error: null };
    } catch (err) {
      console.error('Sign in error:', err);
      return { error: err };
    }
  },
  
  signUp: async (email, password, userData, isAdmin = false) => {
    try {
      // Step 1: Create auth user
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      });
      
      if (error) {
        if (error.message?.includes('429')) {
          return { error: { message: 'Too many signup attempts. Please try again in a few minutes.' } };
        }
        return { error };
      }
      
      // Step 2: Wait a moment for the session to be established
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Step 3: Ensure we have a session
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError) {
        console.error('Session error:', sessionError);
        return { error: sessionError };
      }
      
      if (!session) {
        return { error: { message: 'Failed to establish session. Please try again.' } };
      }
      
      // Step 4: Create profile
      if (data.user) {
        const { error: profileError } = await supabase
          .from('profiles')
          .insert({
            id: data.user.id,
            ...userData,
            is_admin: isAdmin,
          });
        
        if (profileError) {
          console.error('Error creating profile:', profileError);
          // If profile creation fails, we should clean up the auth user
          await supabase.auth.signOut();
          return { error: profileError };
        }
        
        set({ user: data.user });
      }
      
      return { error: null };
    } catch (err) {
      console.error('Sign up error:', err);
      return { error: err };
    }
  },
  
  signOut: async () => {
    await supabase.auth.signOut();
    set({ user: null, profile: null });
  },
}));