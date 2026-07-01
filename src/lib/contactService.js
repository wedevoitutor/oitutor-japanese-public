import { supabase } from './supabase';

export const submitContactForm = ({ fullName, email, subject, message }) =>
  supabase
    ? supabase.from('contact_messages').insert([
        { full_name: fullName, email, subject, message },
      ])
    : Promise.resolve({ error: { message: 'Supabase not configured' } });
