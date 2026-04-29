import { useQuery } from "@tanstack/react-query";
import { createClient } from "@vinser/core/supabase/client";

export const categoryKeys = {
  all: ["categories"] as const,
};

export function useCategories() {
  return useQuery({
    queryKey: categoryKeys.all,
    queryFn: async () => {
      const supabase = createClient();
      const { data, error } = await supabase
        .from("categories")
        .select("*")
        .order("created_at");

      if (error) {
        throw new Error(error.message);
      }

      return data;
    },
  });
}
