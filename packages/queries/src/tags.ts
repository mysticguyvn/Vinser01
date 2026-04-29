import { useQuery } from "@tanstack/react-query";
import { createClient } from "@vinser/core/supabase/client";

export const tagKeys = {
  all: ["tags"] as const,
  byCategory: (categoryId: string) => ["tags", { categoryId }] as const,
};

export function useTags() {
  return useQuery({
    queryKey: tagKeys.all,
    queryFn: async () => {
      const supabase = createClient();
      const { data, error } = await supabase
        .from("tags")
        .select("*")
        .order("name");

      if (error) {
        throw new Error(error.message);
      }

      return data;
    },
  });
}
