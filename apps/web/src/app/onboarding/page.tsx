import { redirect } from "next/navigation";
import { createClient } from "@vinser/core/supabase/server";
import { OnboardingForm } from "./onboarding-form";

export default async function OnboardingPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name, bio")
    .eq("id", user.id)
    .single();

  const { data: profileTags } = await supabase
    .from("profile_tags")
    .select("tag_id")
    .eq("profile_id", user.id);

  const selectedTagIds = profileTags?.map(pt => (pt as any).tag_id) || [];

  return (
    <OnboardingForm
      initialName={(profile as any)?.full_name || ""}
      initialBio={(profile as any)?.bio || ""}
      initialSelectedTags={selectedTagIds}
    />
  );
}
