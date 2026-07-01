import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

/**
 * Returns the current Supabase session and keeps it reactive.
 * undefined = still checking, null = not authenticated, object = authenticated.
 */
export function useSession() {
  const [session, setSession] = useState(undefined);

  useEffect(() => {
    if (!supabase) { setSession(null); return; }
    supabase.auth.getSession().then(({ data: { session: s } }) => setSession(s ?? null));
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, s) => setSession(s ?? null),
    );
    return () => subscription.unsubscribe();
  }, []);

  return session;
}
