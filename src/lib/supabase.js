// src/lib/supabase.js
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseKey);

/**
 * Encerra a sessão do usuário no Supabase
 */
export const signOutUser = async () => {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
};