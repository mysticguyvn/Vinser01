import { createClient } from "@vinser/core/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { ProfileView } from "./profile-view";

export default async function ProfilePage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  if (!profile || !(profile as any).full_name) {
    redirect("/onboarding");
  }

  const { data: userSchools } = await supabase
    .from("user_schools")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  const { data: profileTagsRaw } = await supabase
    .from("profile_tags")
    .select(`
      tag_id,
      tags(
        id,
        name,
        category_id,
        categories(
          id,
          name,
          type
        )
      )
    `)
    .eq("profile_id", user.id);

  const profileTags = profileTagsRaw?.map((pt: any) => pt.tags) || [];

  return (
    <div className="min-h-screen bg-surface">
      <header className="bg-surface-container-lowest border-b border-outline-variant/30 py-4 px-gutter flex justify-between items-center shadow-sm">
        <h1 className="text-headline-md font-bold text-primary tracking-tight">Vinser</h1>
        <Link href="/profile/edit" className="flex items-center gap-2 px-4 py-2 rounded-lg border-2 border-outline-variant text-on-surface-variant font-label-bold uppercase hover:bg-surface-container transition-colors">
          <span className="material-symbols-outlined text-lg">edit</span>
          Chỉnh sửa hồ sơ
        </Link>
      </header>
      <main className="max-w-[1280px] mx-auto py-stack-lg px-gutter">
        <ProfileView
          profile={profile}
          userSchools={userSchools || []}
          tags={profileTags as any}
          isOwner={true}
        />
      </main>
    </div>
  );
}
