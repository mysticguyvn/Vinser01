import { createClient } from '../supabase/client';

export async function signInWithOAuth() {
  const supabase = createClient();
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${window.location.origin}/auth/callback`,
    },
  });

  if (error) {
    console.error('Error signing in with OAuth:', error);
    throw error;
  }

  return data;
}

export async function linkIdentity() {
  const supabase = createClient();
  const { data, error } = await supabase.auth.linkIdentity({
    provider: 'google',
    options: {
      redirectTo: `${window.location.origin}/auth/callback`,
    },
  });

  if (error) {
    console.error('Error linking identity:', error);
    throw error;
  }

  return data;
}
