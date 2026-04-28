"use server";

import { createClient } from "@vinser/core/supabase/server";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const editProfileSchema = z.object({
  fullName: z.string().min(2, "Tên phải có ít nhất 2 ký tự"),
  bio: z.string().max(160, "Tiểu sử không quá 160 ký tự").optional().nullable(),
  contactEmail: z.string().email("Email không hợp lệ").optional().or(z.literal('')),
  contactEmailPrivacy: z.enum(["public", "same_school", "connections_only", "only_me"]),
  socialLinksPrivacy: z.enum(["public", "same_school", "connections_only", "only_me"]),
  socialLinks: z.string().optional(),
});

export async function updateProfile(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("Not authenticated");
  }

  const validatedFields = editProfileSchema.safeParse({
    fullName: formData.get("fullName"),
    bio: formData.get("bio"),
    contactEmail: formData.get("contactEmail"),
    contactEmailPrivacy: formData.get("contactEmailPrivacy"),
    socialLinksPrivacy: formData.get("socialLinksPrivacy"),
    socialLinks: formData.get("socialLinks"),
  });

  if (!validatedFields.success) {
    return {
      success: false,
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  const {
    fullName,
    bio,
    contactEmail,
    contactEmailPrivacy,
    socialLinksPrivacy,
    socialLinks
  } = validatedFields.data;

  let parsedSocialLinks = [];
  try {
    if (socialLinks) {
      parsedSocialLinks = JSON.parse(socialLinks);
    }
  } catch (e) {
  }

  const typedClient = supabase as any;
  const { error: profileError } = await typedClient
    .from("profiles")
    .update({
      full_name: fullName,
      bio: bio || null,
      contact_email: contactEmail || null,
      contact_email_privacy: contactEmailPrivacy,
      social_links_privacy: socialLinksPrivacy,
      social_links: parsedSocialLinks,
      updated_at: new Date().toISOString(),
    })
    .eq("id", user.id);

  if (profileError) {
    return { success: false, error: profileError.message };
  }

  revalidatePath("/profile");
  return { success: true };
}
