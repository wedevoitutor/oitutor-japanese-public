import { supabase } from './supabase';

const SIGNUP_REDIRECT_PATH = '/login';

export const signIn = (email, password) =>
  supabase.auth.signInWithPassword({ email: email.trim(), password });

export const signOut = () => supabase.auth.signOut();

export const getSession = () => supabase.auth.getSession();

/**
 * Starts a Supabase OAuth login flow.
 *
 * @param {'discord'} provider
 * @returns {Promise<import('@supabase/supabase-js').OAuthResponse>}
 */
export async function signInWithProvider(provider) {
  const origin = typeof window !== 'undefined' ? window.location.origin : '';

  const response = await supabase.auth.signInWithOAuth({
    provider,
    options: {
      ...(origin ? { redirectTo: `${origin}/dashboard` } : {}),
      skipBrowserRedirect: true,
    },
  });

  if (!response.error && response.data?.url && typeof window !== 'undefined') {
    window.location.assign(response.data.url);
  }

  return response;
}

/**
 * Creates a student auth account and sends the email confirmation link when
 * Supabase Auth email confirmation is enabled for the project.
 *
 * @param {{ name: string, email: string, password: string, captchaToken?: string }} input
 * @returns {Promise<import('@supabase/supabase-js').AuthResponse>}
 */
export function signUpStudent({ name, email, password, captchaToken }) {
  const origin = typeof window !== 'undefined' ? window.location.origin : '';
  const emailRedirectTo = origin ? `${origin}${SIGNUP_REDIRECT_PATH}` : undefined;
  const fullName = name.trim();

  return supabase.auth.signUp({
    email: email.trim(),
    password,
    options: {
      emailRedirectTo,
      data: {
        full_name: fullName,
        name: fullName,
      },
      ...(captchaToken ? { captchaToken } : {}),
    },
  });
}
