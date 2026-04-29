import { createClient } from "@vinser/core/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { EditProfileForm } from "./edit-profile-form";

export default async function EditProfilePage() {
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

  if (!profile) {
    redirect("/onboarding");
  }

  const { data: userSchools } = await supabase
    .from("user_schools")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  return (
    <div className="min-h-screen bg-surface">
      <header className="bg-surface-container-lowest border-b border-outline-variant/30 py-4 px-gutter flex items-center gap-4 shadow-sm">
        <Link href="/profile" className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-surface-container transition-colors text-on-surface-variant">
          <span className="material-symbols-outlined">arrow_back</span>
        </Link>
        <h1 className="text-headline-md font-bold text-on-surface tracking-tight">Chỉnh sửa hồ sơ</h1>
      </header>
      <main className="max-w-[800px] mx-auto py-stack-lg px-gutter">
        <EditProfileForm profile={profile} userSchools={userSchools || []} />
      </main>
    </div>
  );
}
