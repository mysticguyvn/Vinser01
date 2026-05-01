"use server"

import { createClient } from '../supabase/server';
import { type ProfileUpdate, type TagCreate, type ConnectionCreate } from './schema';

export async function updateProfile(updates: ProfileUpdate) {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  const { data, error } = await supabase
    .from('profiles')
    // @ts-ignore
    .update(updates)
    .eq('id', user.id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function createTag(tag: TagCreate) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('tags')
    // @ts-ignore
    .insert([{ ...tag, is_system: false }])
    .select()
    .single();

  if (error && error.code !== '23505') { // Ignore unique constraint violation
    throw error;
  }

  // If it already existed, fetch it
  if (error && error.code === '23505') {
      const { data: existingData, error: fetchError } = await supabase
        .from('tags')
        .select()
        .eq('category_id', tag.category_id)
        .ilike('name', tag.name)
        .single();

      if (fetchError) throw fetchError;
      return existingData;
  }

  return data;
}

export async function addProfileTags(tagIds: string[]) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const inserts = tagIds.map(tag_id => ({ profile_id: user.id, tag_id }));

    const { data, error } = await supabase
        .from('profile_tags')
        // @ts-ignore
        .upsert(inserts, { onConflict: 'profile_id,tag_id' })
        .select();

    if (error) throw error;
    return data;
}

export async function sendConnectionRequest(request: ConnectionCreate) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  const { data, error } = await supabase
    .from('connections')
    // @ts-ignore
    .insert([{
      requester_id: user.id,
      recipient_id: request.recipient_id,
      status: 'pending'
    }])
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function updateConnectionStatus(connectionId: string, status: 'accepted' | 'rejected') {
    const supabase = await createClient();

    const { data, error } = await supabase
        .from('connections')
        // @ts-ignore
        .update({ status })
        .eq('id', connectionId)
        .select()
        .single();

    if (error) throw error;
    return data;
}
