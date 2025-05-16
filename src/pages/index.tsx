import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { Session } from '@supabase/supabase-js';
import Auth from '../components/auth/Auth';
import TestConnection from '../components/TestConnection';

export default function Home() {
  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Welcome to Ulster</h1>
      <TestConnection />
      {!session ? <Auth /> : (
        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-4">Welcome back!</h2>
          <button
            onClick={() => supabase.auth.signOut()}
            className="px-4 py-2 text-white bg-red-600 rounded-md hover:bg-red-700"
          >
            Sign Out
          </button>
        </div>
      )}
    </div>
  );
} 