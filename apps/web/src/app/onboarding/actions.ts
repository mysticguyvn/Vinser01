"use server";

import { createClient } from "@vinser/core/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

const onboardingSchema = z.object({
  fullName: z.string().min(2, "Tên phải có ít nhất 2 ký tự"),
  bio: z.string().max(160, "Tiểu sử không quá 160 ký tự").optional(),
  avatarColor: z.string().regex(/^#[0-9A-F]{6}$/i, "Màu không hợp lệ").optional(),
  tags: z.array(z.string()).max(10, "Chọn tối đa 10 thẻ").optional(),
});

export async function submitOnboarding(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("Not authenticated");
  }

  const tagsStr = formData.get("tags") as string;
  const tags = tagsStr ? JSON.parse(tagsStr) : [];

  const validatedFields = onboardingSchema.safeParse({
    fullName: formData.get("fullName"),
    bio: formData.get("bio"),
    avatarColor: formData.get("avatarColor"),
    tags,
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  const { fullName, bio, avatarColor, tags: selectedTags } = validatedFields.data;

  const typedClient = supabase as any;
  const { error: profileError } = await typedClient
    .from("profiles")
    .update({
      full_name: fullName,
      bio: bio || null,
      avatar_color: avatarColor || "#4d44e3",
      updated_at: new Date().toISOString(),
    })
    .eq("id", user.id);

  if (profileError) {
    return { error: "Không thể cập nhật hồ sơ. Vui lòng thử lại sau." };
  }

  if (selectedTags && selectedTags.length > 0) {
    await typedClient.from("profile_tags").delete().eq("profile_id", user.id);

    const tagInserts = selectedTags.map(tagId => ({
      profile_id: user.id,
      tag_id: tagId,
    }));

    await typedClient.from("profile_tags").insert(tagInserts);
  }

  revalidatePath("/profile");
  redirect("/profile");
}
