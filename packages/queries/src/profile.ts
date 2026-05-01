import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { createClient } from '@vinser/core/supabase/client';

export function useProfile(userId?: string) {
  const supabase = createClient();

  return useQuery({
    queryKey: ['profile', userId],
    queryFn: async () => {
      let targetId = userId;
      if (!targetId) {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error('Not authenticated');
        targetId = user.id;
      }

      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', targetId)
        .single();

      if (error) throw error;

      // Fetch profile tags
      const { data: tagsData, error: tagsError } = await supabase
        .from('profile_tags')
        .select(`
            tag_id,
            tags (
                id,
                name,
                category_id
            )
        `)
        .eq('profile_id', targetId);

      if (tagsError) throw tagsError;

      return { ...data, tags: tagsData.map(t => (t as any).tags) };
    },
  });
}

export function useCategories() {
    const supabase = createClient();

    return useQuery({
        queryKey: ['categories'],
        queryFn: async () => {
            const { data, error } = await supabase
                .from('categories')
                .select('*');
            if (error) throw error;
            return data;
        }
    });
}

export function useTagsByCategory(categoryId: string) {
    const supabase = createClient();

    return useQuery({
        queryKey: ['tags', categoryId],
        queryFn: async () => {
            const { data, error } = await supabase
                .from('tags')
                .select('*')
                .eq('category_id', categoryId);

            if (error) throw error;
            return data;
        },
        enabled: !!categoryId,
    });
}

export function usePopularTags() {
    const supabase = createClient();

    return useQuery({
        queryKey: ['tags', 'popular'],
        queryFn: async () => {
             const { data: tagData, error: tagError } = await supabase
                .from('tags')
                .select('*, profile_tags(count)')
                .order('profile_tags(count)', { ascending: false } as any)
                .limit(20);
             if (tagError) throw tagError;
             return tagData;
        }
    });
}

export function useConnections(userId?: string) {
    const supabase = createClient();

    return useQuery({
        queryKey: ['connections', userId],
        queryFn: async () => {
            let targetId = userId;
            if (!targetId) {
                const { data: { user } } = await supabase.auth.getUser();
                if (!user) throw new Error('Not authenticated');
                targetId = user.id;
            }

            const { data, error } = await supabase
                .from('connections')
                .select(`
                    *,
                    requester:profiles!requester_id(*),
                    recipient:profiles!recipient_id(*)
                `)
                .or(`requester_id.eq.${targetId},recipient_id.eq.${targetId}`);

            if (error) throw error;
            return data;
        }
    });
}
